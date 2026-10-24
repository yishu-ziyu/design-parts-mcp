/* hoop — a tiny isometric court rendered at low resolution and scaled up with nearest-neighbour. */
(function (global) {
  'use strict';

  var DEFAULTS = {
    courtPixels: 160,        // diamond width in low-res pixels; fixed so the block size scales with the container
    fill: 0.6,               // diamond width / container width
    fillNarrow: 0.84,
    maxFill: 0.92,
    seed: 7,
    speed: 0.32,             // player run speed, ground units per second
    light: [0.62, -0.38],    // shadow direction on the ground (u, v)
    shadowLength: 1.6,       // shadow length = height * this
    colors: {
      grass: ['#3f6a2a', '#4f7c32', '#62913b', '#7aa94a', '#8fbb58'],
      dirt: ['#7b4f33', '#93613f', '#a8744c'],
      asphalt: ['#333333', '#3a3a39', '#424241', '#4a4a48', '#5a5a57', '#6c6c69'],
      paint: ['#284b63', '#2d526c', '#335b77', '#3b6683'],
      line: '#dcdacf',
      shadowMul: 0.5,
      shadowTint: [0.9, 0.95, 1.12],
      pole: '#15171d', poleLit: '#2a2e38',
      board: '#f4f2ee', boardEdge: '#ca4b4c', rim: '#e0532f', net: '#f2f2f0',
      benchTop: '#b88a62', benchSide: '#7b5236', benchLeg: '#2a2422',
      bag: '#2e4995', bagSide: '#203470',
      ball: '#e0672c', ballDark: '#a8461c'
    },
    players: [
      { skin: '#6b4430', hair: '#1b1412', shirt: '#f1efe9', shirtDark: '#c9c6bd', shorts: '#2e3d73', shoes: '#f4f4f4' },
      { skin: '#3f2a20', hair: '#120e0c', shirt: '#c8392f', shirtDark: '#8f241e', shorts: '#1c1c1e', shoes: '#1a1a1a' },
      { skin: '#c99a72', hair: '#5a3a22', shirt: '#e2b23a', shirtDark: '#a98220', shorts: '#e9e7e1', shoes: '#d8d8d8' }
    ]
  };

  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hash(x, y) {
    var h = (x * 374761393 + y * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function hex(c) { var n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function pick(list, r) { return list[Math.min(list.length - 1, Math.floor(r * list.length))]; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  function createHoop(container, options) {
    var cfg = Object.assign({}, DEFAULTS, options || {});
    cfg.colors = Object.assign({}, DEFAULTS.colors, (options && options.colors) || {});
    var C = cfg.colors;
    var reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var view = document.createElement('canvas');
    view.style.cssText = 'display:block;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges';
    container.appendChild(view);
    var vctx = view.getContext('2d');
    var low = document.createElement('canvas');
    var lctx = low.getContext('2d');

    var W = 0, H = 0, px = 4, kx = 33, ky = 16.5, kz = 33, cx = 0, cy = 0;
    var ground = null, groundKind = null, frame = null;

    // ground: u,v in [-1,1]; z up. Screen x grows with u-v, y with u+v.
    function proj(u, v, z) { return [cx + (u - v) * kx, cy + (u + v) * ky - (z || 0) * kz]; }

    var HOOP = { u: 0.06, vPole: -0.93, vBoard: -0.84, vRim: -0.78, zRim: 0.6 };
    var LINE = 0.76, DIRT = 0.845, GRASS = 0.872;
    var KEY = { u0: HOOP.u - 0.3, u1: HOOP.u + 0.3, v0: -LINE, v1: 0.02 };

    function vnoise(x, y) {
      var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      xf = xf * xf * (3 - 2 * xf); yf = yf * yf * (3 - 2 * yf);
      var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), e = hash(xi + 1, yi + 1);
      return a + (b - a) * xf + (c - a) * yf + (a - b - c + e) * xf * yf;
    }
    // rounded-square norm: soft corners like a poured slab
    function slab(u, v) { return Math.pow(Math.pow(Math.abs(u), 7) + Math.pow(Math.abs(v), 7), 1 / 7); }

    function groundAt(u, v, sx, sy) {
      var d = slab(u, v);
      var n = hash(sx, sy), n2 = hash(sx + 911, sy + 37);
      if (d >= GRASS) {
        var t = (d - GRASS - 0.06 * (vnoise(u * 9, v * 9) - 0.5)) / 0.13;
        if (t > 0.45 && n2 < (t - 0.45) * 2.2) return null;
        return [hex(pick(C.grass, n)), 3];
      }
      if (d >= DIRT) return [hex(n2 < 0.18 ? pick(C.grass, n) : pick(C.dirt, n)), 2];
      var w = 0.6 / kx;
      var dq = Math.max(Math.abs(u), Math.abs(v));
      var onLine = Math.abs(dq - LINE) < w;
      if (!onLine && dq < LINE) {
        var inKey = u > KEY.u0 && u < KEY.u1 && v < KEY.v1;
        if (inKey && (Math.abs(u - KEY.u0) < w || Math.abs(u - KEY.u1) < w || Math.abs(v - KEY.v1) < w)) onLine = true;
        var rf = Math.hypot(u - HOOP.u, v - KEY.v1);
        if (Math.abs(rf - 0.3) < w && v > KEY.v1 - w) onLine = true;
        var r3 = Math.hypot(u - HOOP.u, v - HOOP.vRim);
        if (Math.abs(r3 - 0.7) < w && v > HOOP.vRim) onLine = true;
        if (v <= HOOP.vRim && Math.abs(Math.abs(u - HOOP.u) - 0.7) < w) onLine = true;
        if (Math.abs(Math.hypot(u - HOOP.u, v - LINE) - 0.3) < w) onLine = true;
        if (onLine) return [hex(C.line), 1];
        if (inKey) {
          var pr = n2 < 0.06 ? 3 : n < 0.25 ? 0 : n < 0.75 ? 1 : 2;
          return [hex(C.paint[pr]), 1];
        }
      }
      if (onLine) return [hex(C.line), 1];
      var wear = vnoise(u * 5 + 3, v * 5 + 7) * 0.65 + vnoise(u * 13, v * 13) * 0.35;
      var a = n2 < 0.03 + wear * 0.12 ? 5 : n2 < 0.1 + wear * 0.25 ? 4 : n < 0.35 - wear * 0.25 ? 0 : n < 0.7 - wear * 0.2 ? 1 : n < 0.9 ? 2 : 3;
      return [hex(C.asphalt[a]), 1];
    }

    function buildGround() {
      ground = lctx.createImageData(W, H);
      groundKind = new Uint8Array(W * H);
      var g = ground.data;
      for (var sy = 0; sy < H; sy++) {
        for (var sx = 0; sx < W; sx++) {
          var a = (sx + 0.5 - cx) / kx, b = (sy + 0.5 - cy) / ky;
          var u = (a + b) / 2, v = (b - a) / 2;
          if (Math.max(Math.abs(u), Math.abs(v)) > 1.1) continue;
          var r = groundAt(u, v, sx, sy);
          if (!r) continue;
          var i = (sy * W + sx) * 4;
          g[i] = r[0][0]; g[i + 1] = r[0][1]; g[i + 2] = r[0][2]; g[i + 3] = 255;
          groundKind[sy * W + sx] = r[1];
        }
      }
      frame = lctx.createImageData(W, H);
    }

    function resize() {
      var r = container.getBoundingClientRect();
      var cssW = Math.max(200, r.width), cssH = Math.max(160, r.height);
      var want = Math.min(cssW * (cssW < 600 ? cfg.fillNarrow : cfg.fill), cssW * cfg.maxFill, cssH * 1.55);
      px = Math.max(2, Math.round(want / cfg.courtPixels));
      W = Math.ceil(cssW / px); H = Math.ceil(cssH / px);
      kx = cfg.courtPixels / 4; ky = kx / 2; kz = kx;
      cx = Math.round(W / 2); cy = Math.round(H / 2 + kz * 0.22);
      low.width = W; low.height = H;
      view.width = W * px; view.height = H * px;
      view.style.width = (W * px) + 'px'; view.style.height = (H * px) + 'px';
      view.style.marginLeft = Math.round((cssW - W * px) / 2) + 'px';
      buildGround();
      draw();
    }

    function shade(sx, sy) {
      if (sx < 0 || sy < 0 || sx >= W || sy >= H) return;
      var k = sy * W + sx;
      if (!groundKind[k] || groundKind[k] > 9) return;
      var i = k * 4, d = frame.data, m = C.shadowMul;
      d[i] = d[i] * m * C.shadowTint[0]; d[i + 1] = d[i + 1] * m * C.shadowTint[1]; d[i + 2] = Math.min(255, d[i + 2] * m * C.shadowTint[2]);
      groundKind[k] += 10;
    }
    function castShadow(u, v, h, width) {
      var L = h * cfg.shadowLength, lu = cfg.light[0], lv = cfg.light[1];
      var steps = Math.ceil(L * kx * 2.2) + 1;
      for (var s = 0; s <= steps; s++) {
        var f = s / steps, taper = 1 - f * 0.35;
        var pu = u + lu * L * f, pv = v + lv * L * f;
        var p = proj(pu, pv, 0);
        var wpx = Math.max(0.6, width * kx * taper);
        for (var o = -wpx; o <= wpx; o += 0.5) {
          shade(Math.floor(p[0] + o * 0.45), Math.floor(p[1] + o * 0.89 * 0.5));
        }
      }
    }

    function put(x, y, w, h, col) { lctx.fillStyle = col; lctx.fillRect(Math.round(x), Math.round(y), w, h); }
    function poly(pts, col) {
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, i;
      for (i = 0; i < pts.length; i++) { x0 = Math.min(x0, pts[i][0]); x1 = Math.max(x1, pts[i][0]); y0 = Math.min(y0, pts[i][1]); y1 = Math.max(y1, pts[i][1]); }
      lctx.fillStyle = col;
      for (var y = Math.floor(y0); y <= Math.ceil(y1); y++) {
        for (var x = Math.floor(x0); x <= Math.ceil(x1); x++) {
          var cxp = x + 0.5, cyp = y + 0.5, inside = false;
          for (var a = 0, b = pts.length - 1; a < pts.length; b = a++) {
            if ((pts[a][1] > cyp) !== (pts[b][1] > cyp) && cxp < (pts[b][0] - pts[a][0]) * (cyp - pts[a][1]) / (pts[b][1] - pts[a][1]) + pts[a][0]) inside = !inside;
          }
          if (inside) lctx.fillRect(x, y, 1, 1);
        }
      }
    }
    function box(u0, v0, u1, v1, z0, z1, top, side, side2) {
      poly([proj(u0, v0, z1), proj(u1, v0, z1), proj(u1, v1, z1), proj(u0, v1, z1)], top);
      poly([proj(u0, v1, z0), proj(u1, v1, z0), proj(u1, v1, z1), proj(u0, v1, z1)], side);
      poly([proj(u1, v0, z0), proj(u1, v1, z0), proj(u1, v1, z1), proj(u1, v0, z1)], side2 || side);
    }

    /* ---- simulation ---- */
    var rand = mulberry(cfg.seed);
    var players = [], ball = null, clock = 0;
    var RIM = { u: HOOP.u, v: HOOP.vRim, z: HOOP.zRim };

    function randomSpot() {
      return [-0.62 + rand() * 1.24, -0.6 + rand() * 1.15];
    }
    function reset() {
      rand = mulberry(cfg.seed);
      players = cfg.players.map(function (look, i) {
        var s = [[-0.25, 0.1], [0.25, -0.35], [0.45, 0.3]][i % 3];
        return { look: look, u: s[0], v: s[1], tu: s[0], tv: s[1], face: 1, phase: i * 1.7, moving: 0, jump: 0, wait: 0.4 + i * 0.3 };
      });
      ball = { mode: 'hold', owner: 0, t: 0, hold: 1.6, u: 0, v: 0, z: 0.2 };
      clock = 0;
    }

    function ownerHand(p) { return [p.u + 0.04 * p.face, p.v + 0.01, 0.2 + p.jump]; }

    function step(dt) {
      clock += dt;
      var owner = ball.mode === 'hold' ? players[ball.owner] : null;
      players.forEach(function (p, i) {
        if (p.jump > 0 || p.shooting) { p.moving = 0; return; }
        if (ball.mode === 'loose' && i === ball.chaser) { p.tu = ball.u; p.tv = ball.v; }
        else if (owner && p !== owner && i === (ball.owner + 1) % players.length) {
          var du = RIM.u - owner.u, dv = RIM.v - owner.v, l = Math.hypot(du, dv) || 1;
          p.tu = owner.u + du / l * 0.16; p.tv = owner.v + dv / l * 0.16;
        } else {
          p.wait -= dt;
          if (p.wait <= 0 && Math.hypot(p.tu - p.u, p.tv - p.v) < 0.02) {
            var s = randomSpot(); p.tu = s[0]; p.tv = s[1]; p.wait = 0.8 + rand() * 1.6;
          }
        }
        var ddu = p.tu - p.u, ddv = p.tv - p.v, dist = Math.hypot(ddu, ddv);
        var sp = cfg.speed * (p === owner ? 0.8 : 1);
        if (dist > 0.01) {
          var mv = Math.min(dist, sp * dt);
          p.u += ddu / dist * mv; p.v += ddv / dist * mv;
          var screenDx = ddu - ddv;
          if (Math.abs(screenDx) > 0.002) p.face = screenDx > 0 ? 1 : -1;
          p.moving = 1; p.phase += dt * 11;
        } else p.moving = 0;
      });

      if (ball.mode === 'hold') {
        var o = players[ball.owner], h = ownerHand(o);
        ball.t += dt;
        var bounce = Math.abs(Math.sin(ball.t * 6.2));
        ball.u = h[0]; ball.v = h[1]; ball.z = 0.02 + bounce * 0.14;
        if (ball.t > ball.hold) {
          var dHoop = Math.hypot(o.u - RIM.u, o.v - RIM.v);
          if (dHoop < 1.0 && rand() < 0.55) {
            o.shooting = 0.35; ball.mode = 'windup'; ball.t = 0;
            o.face = (RIM.u - RIM.v) - (o.u - o.v) > 0 ? 1 : -1;
          } else {
            var to = (ball.owner + 1 + (rand() < 0.5 ? 0 : 1)) % players.length;
            ball.mode = 'pass'; ball.from = [h[0], h[1], 0.18]; ball.to = to; ball.t = 0; ball.dur = 0.55;
          }
        }
      } else if (ball.mode === 'windup') {
        var s = players[ball.owner];
        ball.t += dt;
        s.jump = Math.sin(clamp(ball.t / 0.7, 0, 1) * Math.PI) * 0.09;
        var hh = ownerHand(s); ball.u = hh[0]; ball.v = hh[1]; ball.z = 0.3 + s.jump;
        if (ball.t > 0.32) {
          ball.mode = 'shot'; ball.t = 0; ball.from = [ball.u, ball.v, ball.z];
          ball.make = rand() < 0.62; ball.dur = 0.95;
        }
      } else if (ball.mode === 'shot') {
        ball.t += dt;
        var sh = players[ball.owner];
        if (sh.jump > 0) { sh.jump = Math.max(0, sh.jump - dt * 0.4); if (sh.jump < 0.005) { sh.jump = 0; sh.shooting = 0; } }
        var f = clamp(ball.t / ball.dur, 0, 1);
        ball.u = ball.from[0] + (RIM.u - ball.from[0]) * f;
        ball.v = ball.from[1] + (RIM.v - ball.from[1]) * f;
        ball.z = ball.from[2] + (RIM.z + 0.03 - ball.from[2]) * f + Math.sin(f * Math.PI) * 0.42;
        if (f >= 1) {
          sh.jump = 0; sh.shooting = 0;
          var ang = rand() * Math.PI * 2, out = ball.make ? 0.08 : 0.45;
          ball.mode = 'fall'; ball.t = 0; ball.from = [RIM.u, RIM.v, RIM.z];
          ball.land = [clamp(RIM.u + Math.cos(ang) * out, -0.8, 0.8), clamp(RIM.v + 0.12 + Math.abs(Math.sin(ang)) * out, -0.8, 0.8)];
          ball.vz = ball.make ? -0.2 : 0.6; ball.dur = ball.make ? 0.5 : 0.9;
        }
      } else if (ball.mode === 'fall') {
        ball.t += dt;
        var ff = clamp(ball.t / ball.dur, 0, 1);
        ball.u = ball.from[0] + (ball.land[0] - ball.from[0]) * ff;
        ball.v = ball.from[1] + (ball.land[1] - ball.from[1]) * ff;
        ball.z = Math.max(0.02, ball.from[2] + ball.vz * ball.t - 2.2 * ball.t * ball.t);
        if (ff >= 1) {
          ball.mode = 'loose'; ball.t = 0; ball.bz = 0.14;
          var best = 0, bd = 9;
          players.forEach(function (p, i) { var d = Math.hypot(p.u - ball.u, p.v - ball.v); if (d < bd) { bd = d; best = i; } });
          ball.chaser = best;
        }
      } else if (ball.mode === 'loose') {
        ball.t += dt;
        ball.z = 0.02 + Math.abs(Math.sin(ball.t * 7)) * ball.bz * Math.exp(-ball.t * 2.5);
        var c = players[ball.chaser];
        if (Math.hypot(c.u - ball.u, c.v - ball.v) < 0.05) {
          ball.mode = 'hold'; ball.owner = ball.chaser; ball.t = 0; ball.hold = 1.2 + rand() * 1.8;
          var sp2 = randomSpot(); c.tu = sp2[0]; c.tv = sp2[1];
        }
      } else if (ball.mode === 'pass') {
        ball.t += dt;
        var rc = players[ball.to], th = ownerHand(rc), fp = clamp(ball.t / ball.dur, 0, 1);
        ball.u = ball.from[0] + (th[0] - ball.from[0]) * fp;
        ball.v = ball.from[1] + (th[1] - ball.from[1]) * fp;
        ball.z = 0.18 + Math.sin(fp * Math.PI) * 0.05;
        if (fp >= 1) {
          ball.mode = 'hold'; ball.owner = ball.to; ball.t = 0; ball.hold = 1.0 + rand() * 2.0;
          var sp3 = randomSpot(); rc.tu = sp3[0]; rc.tv = sp3[1];
        }
      }
    }

    /* ---- drawing ---- */
    function drawPlayer(p) {
      var L = p.look, f = proj(p.u, p.v, p.jump);
      var x = Math.round(f[0]), y = Math.round(f[1]);
      var swing = p.moving ? Math.round(Math.sin(p.phase)) : 0;
      var bob = p.moving && Math.abs(Math.sin(p.phase)) > 0.7 ? 1 : 0;
      var back = p.face > 0 ? -1 : 2;
      y -= bob;
      put(x - 1 + swing, y - 1, 1, 1, L.shoes); put(x + 1 - swing, y - 1, 1, 1, L.shoes);
      put(x - 1 + swing, y - 6, 1, 5, L.skin); put(x + 1 - swing, y - 6, 1, 5, L.skin);
      put(x - 1, y - 9, 4, 3, L.shorts);
      put(x - 1, y - 14, 4, 5, L.shirt);
      put(x + back, y - 14, 1, 5, L.shirtDark);
      var up = p.shooting || (ball.mode === 'windup' && players[ball.owner] === p);
      put(x - 2, y - 13 + (up ? -4 : 0), 1, 4, L.skin);
      put(x + 3, y - 13 + (up ? -4 : -swing), 1, 4, L.skin);
      put(x - 1, y - 18, 3, 4, L.skin);
      put(x - 1, y - 18, 3, 1, L.hair);
      put(x + (p.face > 0 ? -1 : 1), y - 17, 1, 2, L.hair);
    }
    function drawBall() {
      var p = proj(ball.u, ball.v, ball.z);
      put(p[0] - 1, p[1] - 2, 2, 2, C.ball);
      put(p[0], p[1] - 1, 1, 1, C.ballDark);
    }
    function drawHoopBack() {
      var b = proj(HOOP.u, HOOP.vPole, 0), t = proj(HOOP.u, HOOP.vPole, HOOP.zRim + 0.24);
      put(b[0] - 1, t[1], 2, b[1] - t[1], C.pole);
      put(b[0] - 1, t[1], 1, b[1] - t[1], C.poleLit);
      var a = proj(HOOP.u, HOOP.vPole, HOOP.zRim + 0.16), a2 = proj(HOOP.u, HOOP.vBoard, HOOP.zRim + 0.16);
      for (var s = 0; s <= 6; s++) { var q = s / 6; put(a[0] + (a2[0] - a[0]) * q, a[1] + (a2[1] - a[1]) * q, 1, 1, C.pole); }
      // board drawn column by column so the 2:1 slope stays a clean pixel staircase
      var b0 = proj(HOOP.u - 0.12, HOOP.vBoard, HOOP.zRim + 0.2), cols = Math.round(0.24 * kx * 1.02), rows = Math.round(0.23 * kz);
      var bx = Math.round(b0[0]), by = Math.round(b0[1]), mid = Math.floor(cols / 2);
      for (var c = 0; c <= cols; c++) {
        var yt = by + Math.round(c * ky / kx);
        put(bx + c, yt, 1, rows, (c === 0 || c === cols) ? C.boardEdge : C.board);
        put(bx + c, yt, 1, 1, C.boardEdge); put(bx + c, yt + rows - 1, 1, 1, C.boardEdge);
        if (Math.abs(c - mid) <= 2) {
          var ys = yt + rows - 5;
          if (Math.abs(c - mid) === 2) put(bx + c, ys, 1, 3, C.boardEdge); else put(bx + c, ys, 1, 1, C.boardEdge);
        }
      }
    }
    function drawRim() {
      var c = proj(RIM.u, RIM.v, RIM.z);
      put(c[0] - 2, c[1] - 1, 4, 1, C.rim);
      put(c[0] - 2, c[1] + 1, 4, 1, C.rim);
      put(c[0] - 3, c[1], 1, 1, C.rim); put(c[0] + 2, c[1], 1, 1, C.rim);
      put(c[0] - 2, c[1] + 2, 1, 2, C.net); put(c[0], c[1] + 2, 1, 3, C.net); put(c[0] + 1, c[1] + 2, 1, 2, C.net);
    }
    function drawProps() {
      box(-0.5, -0.86, -0.2, -0.81, 0.07, 0.1, C.benchTop, C.benchSide, C.benchSide);
      box(-0.48, -0.85, -0.47, -0.83, 0, 0.07, C.benchLeg, C.benchLeg);
      box(-0.23, -0.85, -0.22, -0.83, 0, 0.07, C.benchLeg, C.benchLeg);
      box(-0.16, -0.86, -0.08, -0.79, 0, 0.06, C.bag, C.bagSide, C.bagSide);
    }

    function draw() {
      if (!ground) return;
      frame.data.set(ground.data);
      for (var k = 0; k < groundKind.length; k++) if (groundKind[k] > 9) groundKind[k] -= 10;
      castShadow(HOOP.u, HOOP.vPole, HOOP.zRim + 0.24, 0.012);
      castShadow(-0.35, -0.83, 0.1, 0.05); castShadow(-0.12, -0.82, 0.06, 0.04);
      players.forEach(function (p) { castShadow(p.u, p.v, 0.5 + p.jump, 0.045); });
      if (ball) { var bp = proj(ball.u, ball.v, 0); shade(Math.floor(bp[0]), Math.floor(bp[1])); shade(Math.floor(bp[0]) - 1, Math.floor(bp[1])); }
      lctx.clearRect(0, 0, W, H);
      lctx.putImageData(frame, 0, 0);

      var items = [{ d: HOOP.vPole * 2 + HOOP.u - 0.01, f: drawProps }, { d: HOOP.u + HOOP.vPole, f: drawHoopBack }];
      players.forEach(function (p) { items.push({ d: p.u + p.v, f: function () { drawPlayer(p); } }); });
      items.push({ d: RIM.u + RIM.v + 0.01, f: drawRim });
      if (ball) items.push({ d: ball.u + ball.v + (ball.mode === 'hold' ? 0.02 : 0.001), f: drawBall });
      items.sort(function (a, b) { return a.d - b.d; });
      items.forEach(function (it) { it.f(); });

      vctx.imageSmoothingEnabled = false;
      vctx.clearRect(0, 0, view.width, view.height);
      vctx.drawImage(low, 0, 0, W * px, H * px);
    }

    var raf = 0, last = 0, running = false, visible = true;
    function loop(t) {
      raf = requestAnimationFrame(loop);
      var dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
      if (!visible) return;
      step(dt); draw();
    }
    function play() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(loop); }
    function pause() { running = false; cancelAnimationFrame(raf); }

    var ro = new ResizeObserver(resize); ro.observe(container);
    var io = 'IntersectionObserver' in global ? new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }) : null;
    if (io) io.observe(container);

    reset();
    resize();
    if (!reduce) play();

    return {
      canvas: view,
      play: play, pause: pause,
      isPlaying: function () { return running; },
      reseed: function (s) { cfg.seed = s; reset(); draw(); },
      destroy: function () { pause(); ro.disconnect(); if (io) io.disconnect(); view.remove(); }
    };
  }

  global.createHoop = createHoop;
})(window);
