
const canvas = document.getElementById('canvas');
const lens = document.getElementById('lens');
const refraction = document.getElementById('refraction');
const blurWrap = document.getElementById('blurWrap');
const housing = document.getElementById('filter-housing');
const glintLayer = document.getElementById('glintLayer');
const tintLayer = document.getElementById('tintLayer');
const lensClip = document.getElementById('lensClip');

let LENS_W = 100,LENS_H = 100; // lens size — mutable: animated between full (100) and minimized (60)
let RADIUS = 16; // corner radius — single source of truth. place() pushes it to the lens outline, the
// .lens-clip wrapper, and the refraction clip; buildLensMap bakes it into the map SDF.
// Reassign it + call place() to animate the rounding everywhere in lockstep.
const BOOST = 0.8; //saturation manipulation of map
const PAD = 20; //distance around edge
const SS = 1; // 1x. SS=2 (supersample) quadruples filter pixels — too heavy for Safari at 60fps, and the obj-bbox port to make it Safari-safe broke rendering, so we stay at 1.

// Map is generated at supersampled resolution; the refraction layer is sized SSx and scaled 1/SS.
// MAP_W/MAP_H derive from the (mutable) lens size — recomputed whenever it changes (see stepTransition).
let MAP_W = (LENS_W + 2 * PAD) * SS,MAP_H = (LENS_H + 2 * PAD) * SS;

const params = { depth: 60, splay: 2, feather: 24, curve: 2, blur: 0, chroma: 0, glint: 25, tint: 0, tintColor: '#ffffff' };

let version = 0,curLeft = 250,curTop = 150,needsPaint = true;
const mapCache = new Map(); // every built map persists here so the size tween reuses (not rebuilds) them
const clamp255 = v => v < 0 ? 0 : v > 255 ? 255 : v;

// Build the displacement map

function buildLensMap(mw, mh, winW, winH, radius, rim, curve, feather) {
  const key = `${mw}:${winW}:${radius}:${rim}:${curve}:${feather}`;
  const hit = mapCache.get(key);
  if (hit) return hit;
  const cv = document.createElement('canvas');
  cv.width = mw;cv.height = mh;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(mw, mh),px = img.data;

  const hx = winW / 2,hy = winH / 2; // glass half-size, centred in the padded map
  const sdf = (x, y) => {// signed distance to the rounded-rect glass edge
    const qx = Math.abs(x - mw / 2) - (hx - radius);
    const qy = Math.abs(y - mh / 2) - (hy - radius);
    const ox = Math.max(qx, 0),oy = Math.max(qy, 0);
    return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - radius;
  };

  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const cx = x + 0.5,cy = y + 0.5;
      const s = sdf(cx, cy); // signed distance to the edge (0 = on it)
      const gx = sdf(cx + 1, cy) - sdf(cx - 1, cy); // outward edge normal
      const gy = sdf(cx, cy + 1) - sdf(cx, cy - 1);
      const len = Math.hypot(gx, gy) || 1;
      const nx = gx / len,ny = gy / len;
      const span = s < 0 ? rim + feather : rim; // inner side gets a wider, softer falloff
      let amt = Math.max(0, 1 - Math.abs(s) / span); // ring centred on the edge
      amt = amt * amt * amt * (amt * (amt * 6 - 15) + 10); // smootherstep (no crease)
      amt = Math.pow(amt, curve); // curvature shapes the bevel profile
      const i = (y * mw + x) * 4;
      px[i] = clamp255(Math.round(127.5 - nx * amt * 127 * BOOST)); // R = x displacement (inward)
      px[i + 1] = clamp255(Math.round(127.5 - ny * amt * 127 * BOOST)); // G = y displacement
      px[i + 2] = 128; // B unused — specular/glint is now a CSS overlay (#glintLayer)
      px[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const url = cv.toDataURL('image/png');
  if (mapCache.size > 300) mapCache.delete(mapCache.keys().next().value); // cap growth from slider scrubbing
  mapCache.set(key, url);
  return url;
}

// Inject the filter under a new id (Safari cache-buster).
// https://aave.com/design/building-glass-for-the-web
function applyFilter(mapUrl) {
  const id = `lens-v${++version}`;
  const { depth, chroma } = params; // blur + glint are applied separately (CSS), not in the filter
  const sc = depth * SS; // displacement scale in px (userSpaceOnUse)

  let disp;
  if (chroma > 0) {
    // Typical red/cyan chromatic aberration: red takes the larger displacement, green+blue ride the
    // smaller one. Two displacement passes instead of a full per-channel R/G/B split (three) — ~1/3
    // off the heavy part, and visually ~indistinguishable at these chroma values. (Alpha kept on both
    // layers so the arithmetic add survives premultiplication; clamps to 1 on the opaque scene.)
    const sR = sc * (1 + chroma),sB = sc * (1 - chroma);
    disp = `
      <feDisplacementMap in="SourceGraphic" in2="map" scale="${sR}" xChannelSelector="R" yChannelSelector="G" result="dR"/>
      <feDisplacementMap in="SourceGraphic" in2="map" scale="${sB}" xChannelSelector="R" yChannelSelector="G" result="dGB"/>
      <feColorMatrix in="dR"  type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cR"/>
      <feColorMatrix in="dGB" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cGB"/>
      <feComposite in="cR" in2="cGB" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="disp"/>`;
  } else {
    disp = `<feDisplacementMap in="SourceGraphic" in2="map" scale="${sc}" xChannelSelector="R" yChannelSelector="G" result="disp"/>`;
  }
  housing.innerHTML = `
    <defs>
      <filter id="${id}" x="0" y="0" width="100%" height="100%"
              filterUnits="objectBoundingBox" color-interpolation-filters="sRGB">
        <feImage href="${mapUrl}" xlink:href="${mapUrl}"
                 x="0" y="0" width="${MAP_W}" height="${MAP_H}" preserveAspectRatio="none" result="map"/>
        ${disp}
      </filter>
    </defs>`;
  refraction.style.filter = `url(#${id})`; // displacement only; blur is on #blurWrap (see place())
}


// A CSS `filter` only warps an element's OWN subtree, so the lens layer holds a CLONE of the
// scene. The real #scene stays interactive behind it; the clone is a non-interactive copy that
// gets refracted. Re-run syncScene() if you change the scene's markup.
const scene = document.getElementById('scene');
const cloneWrap = document.createElement('div');
cloneWrap.className = 'refraction-scene';
let cloneOrb = null;
function syncScene() {cloneWrap.innerHTML = scene.innerHTML;cloneOrb = cloneWrap.querySelector('.orb');}
syncScene();
refraction.appendChild(cloneWrap);
const realOrb = scene.querySelector('.orb');

// Animate scene content from JS (main thread) so the filter re-samples it each frame. CSS
// @keyframes on transform/opacity run on Safari's compositor and bypass the SVG filter, so
// they would NOT refract — driving `left` here keeps the moving orb (real + clone) refracting.
const ORB_W = 56,ORB_TOP = 150,ORB_GLOW = 32; // orb size/pos (see CSS .orb, square) + glow/shadow margin
// Extra lead so painting RESUMES before the orb reaches the lens. The first paint after an idle
// stretch is a cold start (filter recompile + map re-decode + GPU layer re-promote) and drops one
// frame; the lead moves that hitch to while the orb is far from the lens (imperceptible) and keeps
// the pipeline warm — hence smooth — through the actual pass under it. Raise it if a stutter remains;
// lower it to reclaim a little more idle time.
const ORB_WARMUP = 90;
const ORB_SPEED = 0.72; // rad/sec. Time-based (was 0.012/frame × 60fps) so the sweep runs at the same
// real speed at 60fps or when frames drop — otherwise low fps = slow-motion orb.
let orbPhase = 0,orbX = 28;
function animateScene(dt) {
  orbPhase += ORB_SPEED * dt;
  orbX = 28 + (0.5 - 0.5 * Math.cos(orbPhase)) * (512 - 28); // eased sweep 28 -> 512 -> 28
  if (realOrb) realOrb.style.left = orbX + 'px';
  if (cloneOrb) cloneOrb.style.left = orbX + 'px';
}

// True when the orb (incl. glow) is at or approaching the lens sampling window — the 140×140
// refraction rect (lens + PAD). ORB_GLOW keeps the band a superset of the true window (so the "orb
// just left" frames still paint and never freeze a ghost); ORB_WARMUP extends it further ahead so the
// pipeline is already warm by the time the orb actually refracts. Outside the whole band the lens
// output is identical frame-to-frame, so the re-mint is skippable.
function orbInLensRegion() {
  const m = ORB_GLOW + ORB_WARMUP;
  const ox1 = orbX - m,ox2 = orbX + ORB_W + m;
  const oy1 = ORB_TOP - m,oy2 = ORB_TOP + ORB_W + m;
  const lx1 = curLeft - PAD,lx2 = curLeft + LENS_W + PAD;
  const ly1 = curTop - PAD,ly2 = curTop + LENS_H + PAD;
  return ox1 < lx2 && ox2 > lx1 && oy1 < ly2 && oy2 > ly1; // AABB overlap
}

// Geometry — only needs to change when the lens moves.
function place() {
  lens.style.left = curLeft + 'px';
  lens.style.top = curTop + 'px';
  lens.style.width = LENS_W + 'px'; // animated during minimize/expand
  lens.style.height = LENS_H + 'px';
  refraction.style.width = MAP_W + 'px';
  refraction.style.height = MAP_H + 'px';
  refraction.style.left = -PAD + 'px';
  refraction.style.top = -PAD + 'px';
  refraction.style.transform = 'none'; // no transform — Safari won't filter a transform-scaled subtree
  // corner radius: one value (RADIUS) drives all three clips here + the map SDF in buildLensMap, so
  // they round in lockstep and can be animated together just by reassigning RADIUS.
  refraction.style.clipPath = `inset(${PAD * SS}px round ${RADIUS * SS}px)`;
  lens.style.borderRadius = `${RADIUS}px`; // lens outline (border, shadow, overflow clip)
  lensClip.style.clipPath = `inset(0 round ${RADIUS}px)`; // rounds the composited inner layers
  // align the cloned scene with the real one using plain positioning (no transform).
  cloneWrap.style.transform = 'none';
  cloneWrap.style.left = `${-(curLeft - PAD)}px`;
  cloneWrap.style.top = `${-(curTop - PAD)}px`;
  // standalone CSS blur on the wrapper (decoupled from the url() filter for cross-browser consistency)
  blurWrap.style.filter = params.blur > 0 ? `blur(${params.blur}px)` : 'none';
  glintLayer.style.opacity = Math.min(1, params.glint / 100); // specular intensity (CSS overlay, not in the filter)
  tintLayer.style.background = params.tintColor; // glass tint colour, blended over the refraction
  tintLayer.style.opacity = params.tint; // tint level 0–1
  needsPaint = true; // every interaction (drag/slider/preset/init) funnels through here → repaint next frame
}

// Re-inject the filter under a fresh id (map is cached, so this is cheap).
function paint() {
  applyFilter(buildLensMap(MAP_W, MAP_H, LENS_W * SS, LENS_H * SS, RADIUS * SS,
  params.splay * SS, params.curve, params.feather * SS));
}

function moveLens(left, top) {
  curLeft = Math.max(0, Math.min(left, canvas.clientWidth - LENS_W));
  curTop = Math.max(0, Math.min(top, canvas.clientHeight - LENS_H));
  place(); // geometry only — the rAF loop owns painting (re-injects the filter each frame)
}

// --- animation loop ---
// The scene clone can contain animated content (CSS animations, video, etc.). Safari caches a
// filter's output by its id and would freeze on the first frame, so we re-mint the id every
// frame — that forces Safari to re-render the moving content through the lens. We only pay that
// cost when something under the lens actually changed: an interaction (needsPaint, set in place())
// or the orb sweeping through the lens region. Parked over a static area, the lens is free — no
// re-mint, no blur pass.
let lastT = 0;
function loop(t) {
  const dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0; // seconds; clamp so a tab-away doesn't jump the orb
  lastT = t;
  if (tr) stepTransition(t);
  animateScene(dt);
  if (needsPaint || orbInLensRegion()) {paint();needsPaint = false;}
  requestAnimationFrame(loop);
}

// --- slider wiring ---
['depth', 'splay', 'feather', 'curve', 'blur', 'chroma', 'glint', 'tint'].forEach(k => {
  const el = document.getElementById(k),out = document.getElementById(k + '-v');
  el.addEventListener('input', () => {
    params[k] = parseFloat(el.value);
    out.textContent = el.value;
    place(); // applies blur + geometry; the loop repaints the filter (live `params`) next frame
  });
});

// colour picker — not a numeric slider, so wired separately
const tintColorEl = document.getElementById('tintColor');
tintColorEl.addEventListener('input', () => {params.tintColor = tintColorEl.value;place();});

// --- presets ---
const presets = {
  soft: { depth: 60, splay: 2, feather: 24, curve: 2, blur: 0.0, chroma: 0.0, glint: 25, tint: 0, tintColor: '#ffffff' },
  thick: { depth: 120, splay: 2, feather: 30, curve: 3, blur: 0.0, chroma: 0.0, glint: 60, tint: 0, tintColor: '#ffffff' },
  frosted: { depth: 120, splay: 16, feather: 26, curve: 2.6, blur: 5.0, chroma: 0.0, glint: 20, tint: 0, tintColor: '#ffffff' },
  cut: { depth: 120, splay: 40, feather: 40, curve: 0.6, blur: 0.05, chroma: 0.0, glint: 15, tint: 0, tintColor: '#ffffff' },
  plexi: { depth: 60, splay: 4, feather: 10, curve: 1.2, blur: 2.5, chroma: 0.0, glint: 25, tint: 0.94, tintColor: '#ff6600' } };

function applyPreset(p) {
  for (const k in p) {
    params[k] = p[k];
    const el = document.getElementById(k);if (el) el.value = p[k];
    const out = document.getElementById(k + '-v');if (out) out.textContent = p[k];
  }
  place();
}
document.querySelectorAll('.preset').forEach(btn => {
  btn.addEventListener('click', () => applyPreset(presets[btn.dataset.preset]));
});

// --- minimize / expand toggle ---
// Two-speed tween: size (100<->60), corner radius (16<->30 = circle, derived from size), and position
// (canvas-centre <-> 20px above the bottom). Each frame place() marks needsPaint so the loop repaints;
// maps are cached (mapCache) and the radius is a function of size, so the size sequence reuses maps
// instead of cold-decoding a fresh one every frame (which is what flashed the un-refracted layer).
const fab = document.getElementById('fab');
let minimized = false,tr = null;
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
const FULL_W = 100,MINI_W = 60,FULL_R = 16,MINI_R = 30;
// radius as a deterministic function of (integer) size → every size yields exactly ONE map, so the
// cache always hits during the tween. Endpoints: 100→r16, 60→r30 (= circle).
const radiusForSize = w => MINI_R + (FULL_R - MINI_R) * (w - MINI_W) / (FULL_W - MINI_W);
function targetState(mini) {
  const cw = canvas.clientWidth,ch = canvas.clientHeight,w = mini ? MINI_W : FULL_W;
  return { w, left: (cw - w) / 2, top: mini ? ch - 20 - w : (ch - w) / 2 };
}
function startTransition(mini, dur) {
  tr = { start: performance.now(), dur,
    from: { w: LENS_W, left: curLeft, top: curTop },
    to: targetState(mini) };
}
function stepTransition(now) {
  const e = ease(Math.min(1, (now - tr.start) / tr.dur));
  const s = Math.round(lerp(tr.from.w, tr.to.w, e)); // integer size → one map per size
  LENS_W = LENS_H = s;
  RADIUS = radiusForSize(s);
  MAP_W = MAP_H = (s + 2 * PAD) * SS;
  curLeft = lerp(tr.from.left, tr.to.left, e);
  curTop = lerp(tr.from.top, tr.to.top, e);
  place(); // geometry + needsPaint → the loop repaints
  if (now - tr.start >= tr.dur) tr = null;
}
fab.addEventListener('click', () => {
  minimized = !minimized;
  const dur = minimized ? 500 : 600; // to button: 500ms; back to lens: 600ms
  fab.style.setProperty('--ico-dur', dur + 'ms'); // keep the X<->… crossfade in sync per direction
  fab.classList.toggle('minimized', minimized);
  startTransition(minimized, dur);
});

// Pre-build + pre-decode every size's map so even the FIRST tween is flicker-free (the first minimize
// otherwise cold-decodes each map live). Chunked over idle time; best-effort warming of the decode cache.
const prewarmImgs = [];
function prewarmTransition() {
  prewarmImgs.length = 0;
  let w = MINI_W;
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 16));
  const step = () => {
    const t0 = performance.now();
    while (w <= FULL_W && performance.now() - t0 < 6) {
      const mw = (w + 2 * PAD) * SS;
      const url = buildLensMap(mw, mw, w * SS, w * SS, radiusForSize(w) * SS,
      params.splay * SS, params.curve, params.feather * SS);
      const im = new Image();im.src = url;im.decode && im.decode().catch(() => {});
      prewarmImgs.push(im);
      w++;
    }
    if (w <= FULL_W) idle(step);
  };
  idle(step);
}

// --- drag ---
let drag = false,sx,sy,ox,oy;
lens.addEventListener('pointerdown', e => {
  if (tr || minimized) return; // no dragging mid-transition or while it's a button
  drag = true;sx = e.clientX;sy = e.clientY;
  ox = lens.offsetLeft;oy = lens.offsetTop;
  lens.setPointerCapture(e.pointerId);
});
lens.addEventListener('pointermove', e => {
  if (drag) moveLens(ox + (e.clientX - sx), oy + (e.clientY - sy));
});
lens.addEventListener('pointerup', () => drag = false);

moveLens(250, 150);
paint(); // paint once so the filter exists before the loop takes over
needsPaint = false; // ...then the loop repaints only on interaction or orb-in-region
requestAnimationFrame(loop);
prewarmTransition(); // warm the size-tween maps in the background so the first toggle is smooth
  