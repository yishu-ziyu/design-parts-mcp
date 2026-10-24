/* sketchbook — WebGL page-curl sketchbook viewer. No dependencies. */
(function (global) {
  'use strict';

  var DEFAULTS = {
    maxWidth: 920,
    widthRatio: 0.48,
    mobileBreak: 640,
    pageWidth: 1,
    pageHeight: 1.01,
    segments: 28,
    curlPeak: 1.15,
    flipWeight: 1.6,
    fov: 48,
    spring: { stiffness: 55, damping: 18, mass: 1.2 },
    drag: { completeThreshold: 0.5, flickVelocity: 1.4 },
    shadowMax: 0.22,
    cornerRadius: 0.05,
    textureWidth: 800,
    paper: '#f1eee7',
    spreads: []
  };

  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  /* ---------- pencil & watercolor doodles (all code-drawn) ---------- */
  function Pen(ctx, r, scale) {
    this.c = ctx; this.r = r; this.s = scale;
  }
  Pen.prototype.j = function (a) { return (this.r() - 0.5) * a * this.s; };
  Pen.prototype.line = function (pts, o) {
    o = o || {};
    var c = this.c, passes = o.passes || 2, s = this.s;
    c.save();
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.strokeStyle = o.color || 'rgba(38,36,40,0.62)';
    for (var p = 0; p < passes; p++) {
      c.lineWidth = (o.w || 1.6) * 0.62 * s * (0.7 + this.r() * 0.6);
      c.globalAlpha = o.alpha || (p === 0 ? 0.8 : 0.35);
      c.beginPath();
      for (var i = 0; i < pts.length; i++) {
        var x = pts[i][0] * s + this.j(o.jit || 2.2), y = pts[i][1] * s + this.j(o.jit || 2.2);
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      if (o.close) c.closePath();
      c.stroke();
    }
    c.restore();
  };
  Pen.prototype.ellipse = function (cx, cy, rx, ry, o) {
    var pts = [], n = 48, a0 = this.r() * 6.28, turns = (o && o.turns) || 1.08, ph = this.r() * 6.28;
    for (var i = 0; i <= n * turns; i++) {
      var a = a0 + (i / n) * Math.PI * 2;
      var wob = 1 + Math.sin(a * 2 + ph) * 0.025 + (i / n) * 0.03;
      pts.push([cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob]);
    }
    this.line(pts, Object.assign({ jit: 0.8 }, o));
  };
  Pen.prototype.hatch = function (x, y, w, h, gap, o) {
    o = o || {};
    var ang = o.angle == null ? -0.9 : o.angle, dx = Math.cos(ang), dy = Math.sin(ang);
    var c = this.c;
    c.save();
    c.beginPath(); c.rect(x * this.s, y * this.s, w * this.s, h * this.s); c.clip();
    var L = (w + h) * 1.5;
    for (var t = -L; t < L; t += gap) {
      var cx = x + w / 2 + -dy * t, cy = y + h / 2 + dx * t;
      this.line([[cx - dx * L, cy - dy * L], [cx + dx * L, cy + dy * L]],
        { w: o.w || 0.9, passes: 1, alpha: o.alpha || 0.35, jit: 1.2 });
    }
    c.restore();
  };
  Pen.prototype.wash = function (cx, cy, rad, color, o) {
    o = o || {};
    var c = this.c, s = this.s, layers = o.layers || 7;
    c.save();
    c.globalCompositeOperation = 'multiply';
    for (var L = 0; L < layers; L++) {
      c.globalAlpha = (o.alpha || 0.11);
      c.fillStyle = color;
      c.beginPath();
      var n = 22, sx = o.sx || 1, sy = o.sy || 1;
      for (var i = 0; i <= n; i++) {
        var a = (i / n) * Math.PI * 2;
        var rr = rad * (0.78 + this.r() * 0.36);
        var x = (cx + Math.cos(a) * rr * sx) * s, y = (cy + Math.sin(a) * rr * sy) * s;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.closePath(); c.fill();
    }
    c.restore();
  };
  Pen.prototype.text = function (str, x, y, size, o) {
    var c = this.c, s = this.s;
    c.save();
    c.fillStyle = (o && o.color) || 'rgba(40,38,44,0.78)';
    c.font = 'italic ' + Math.round(size * s) + 'px "Bradley Hand", "Segoe Print", "Comic Sans MS", cursive';
    c.translate(x * s, y * s);
    c.rotate((o && o.rot) || -0.03);
    c.fillText(str, 0, 0);
    c.restore();
  };

  /* Page coordinate space: 100 wide × 101 tall, regardless of texture size. */
  var SUBJECTS = {
    title: function (p, d) {
      p.text(d.title || 'sketchbook', 14, 44, 9, { rot: -0.05 });
      p.text(d.sub || '', 16, 56, 4.4, { rot: -0.03, color: 'rgba(60,58,66,0.6)' });
      p.line([[14, 62], [52, 60.5]], { w: 1.1, passes: 1 });
    },
    plant: function (p) {
      p.wash(50, 34, 20, '#7f9d6a', { sx: 1.2, sy: 0.9 });
      p.line([[34, 70], [66, 70], [62, 92], [38, 92]], { close: true });
      p.hatch(38, 74, 26, 18, 3.2, { angle: -0.6 });
      var leaves = [[50, 70, 30, 30], [50, 70, 70, 26], [50, 70, 48, 14], [50, 70, 22, 46], [50, 70, 78, 48]];
      leaves.forEach(function (l) {
        var mx = (l[0] + l[2]) / 2, my = (l[1] + l[3]) / 2;
        p.line([[l[0], l[1]], [mx - 6, my - 4], [l[2], l[3]], [mx + 6, my + 3], [l[0], l[1]]], { w: 1.3 });
        p.line([[l[0], l[1]], [l[2], l[3]]], { w: 0.8, passes: 1, alpha: 0.4 });
      });
      p.text('monstera, day 12', 10, 14, 4.6);
    },
    window: function (p) {
      p.line([[16, 12], [84, 12], [84, 82], [16, 82]], { close: true, w: 2 });
      p.line([[50, 12], [50, 82]], { w: 1.4 });
      p.line([[16, 46], [84, 46]], { w: 1.4 });
      p.wash(36, 30, 12, '#9db8d6', { sx: 1.4 });
      p.wash(66, 28, 10, '#c9b6dc');
      for (var i = 0; i < 6; i++) {
        var x = 20 + i * 11, h = 14 + (i * 7) % 18;
        p.line([[x, 82], [x, 82 - h], [x + 8, 82 - h], [x + 8, 82]], { w: 1.1 });
        p.hatch(x + 1, 83 - h, 6, h - 2, 2.4, { alpha: 0.3 });
      }
      p.line([[10, 90], [90, 90]], { w: 2.2 });
      p.text('6:40pm, still light', 52, 97, 4.2);
    },
    teapot: function (p) {
      p.wash(48, 60, 22, '#e2b48a', { sx: 1.1, sy: 0.8, layers: 6 });
      p.ellipse(48, 60, 22, 17, { w: 1.6 });
      p.ellipse(48, 42, 9, 2.6, { w: 1.2 });
      p.ellipse(48, 38, 2.6, 2.2, { w: 1.2 });
      p.line([[26, 56], [14, 46], [10, 40]], { w: 1.6 });
      p.line([[28, 66], [16, 52], [11, 41]], { w: 1.2 });
      p.line([[70, 52], [80, 50], [80, 66], [69, 70]], { w: 1.6 });
      p.hatch(52, 60, 18, 14, 2.6, { angle: -1.1 });
      p.ellipse(48, 82, 30, 4, { w: 0.9, alpha: 0.4 });
    },
    bike: function (p) {
      p.ellipse(28, 66, 15, 15, { w: 1.5 });
      p.ellipse(74, 66, 15, 15, { w: 1.5 });
      p.line([[28, 66], [46, 66], [62, 44], [36, 44], [28, 66]], { w: 1.6 });
      p.line([[46, 66], [36, 44], [34, 38]], { w: 1.4 });
      p.line([[30, 38], [40, 38]], { w: 2 });
      p.line([[62, 44], [74, 66]], { w: 1.4 });
      p.line([[62, 44], [60, 36], [68, 34]], { w: 1.6 });
      p.text('borrowed bike', 12, 20, 5);
      p.line([[4, 84], [96, 84]], { w: 0.9, passes: 1, alpha: 0.4 });
    },
    hills: function (p) {
      p.wash(50, 34, 40, '#cfd9e6', { sx: 1.3, sy: 0.5, layers: 5 });
      p.wash(30, 62, 30, '#8ea37b', { sx: 1.5, sy: 0.45 });
      p.wash(72, 70, 28, '#6f8a62', { sx: 1.4, sy: 0.4 });
      p.wash(50, 86, 36, '#b9a27a', { sx: 1.5, sy: 0.3 });
      p.line([[0, 56], [18, 46], [34, 52], [52, 40], [70, 50], [100, 44]], { w: 1.1, alpha: 0.5 });
      p.ellipse(78, 22, 5, 5, { w: 1 });
    },
    fruit: function (p) {
      p.wash(38, 54, 11, '#e0874f');
      p.wash(58, 52, 12, '#e6c14f');
      p.wash(48, 40, 9, '#b9443f');
      p.ellipse(38, 54, 11, 10.5, { w: 1.3 });
      p.ellipse(58, 52, 12, 11, { w: 1.3 });
      p.ellipse(48, 40, 9, 8.5, { w: 1.3 });
      p.line([[48, 32], [50, 26]], { w: 1.2 });
      p.line([[20, 60], [80, 60], [72, 76], [28, 76]], { close: true, w: 1.6 });
      p.hatch(28, 62, 44, 13, 3, { angle: -0.4 });
      p.text('market haul', 56, 92, 4.6);
    },
    studies: function (p) {
      for (var r = 0; r < 3; r++) for (var c = 0; c < 2; c++) {
        var x = 12 + c * 40, y = 10 + r * 30;
        p.line([[x, y], [x + 34, y], [x + 34, y + 24], [x, y + 24]], { close: true, w: 0.9, passes: 1, alpha: 0.5 });
        var k = (r * 2 + c) % 3;
        if (k === 0) p.ellipse(x + 17, y + 12, 8, 7, { w: 1.1 });
        if (k === 1) p.line([[x + 6, y + 20], [x + 16, y + 6], [x + 28, y + 20]], { w: 1.1 });
        if (k === 2) p.hatch(x + 4, y + 4, 26, 16, 2.6, { alpha: 0.4 });
      }
    },
    notes: function (p, d) {
      var lines = d.lines || [];
      for (var i = 0; i < lines.length; i++) p.text(lines[i], 12, 20 + i * 9, 4.8, { rot: -0.015 });
      p.line([[12, 22 + lines.length * 9], [40, 21 + lines.length * 9]], { w: 1, passes: 1 });
    }
  };

  function paperTexture(side, spec, opts, seed) {
    var W = opts.textureWidth, H = Math.round(W * opts.pageHeight / opts.pageWidth);
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var c = cv.getContext('2d');
    var r = rng(seed * 7919 + 13);
    var rad = opts.cornerRadius * W;
    var left = side === 'left';
    c.beginPath();
    var x0 = 0, x1 = W;
    // Only the outer corners are rounded; the gutter side stays square.
    var tl = left ? rad : 0, tr = left ? 0 : rad;
    c.moveTo(x0 + tl, 0); c.lineTo(x1 - tr, 0);
    if (tr) c.quadraticCurveTo(x1, 0, x1, tr);
    c.lineTo(x1, H - tr);
    if (tr) c.quadraticCurveTo(x1, H, x1 - tr, H);
    c.lineTo(x0 + tl, H);
    if (tl) c.quadraticCurveTo(x0, H, x0, H - tl);
    c.lineTo(x0, tl);
    if (tl) c.quadraticCurveTo(x0, 0, x0 + tl, 0);
    c.closePath();
    c.fillStyle = (spec && spec.paper) || opts.paper;
    c.fill();
    c.save(); c.clip();
    var g = c.createImageData(W, H), dta = g.data;
    for (var i = 0; i < dta.length; i += 4) {
      var v = (r() - 0.5) * 18;
      dta[i] = dta[i + 1] = dta[i + 2] = v < 0 ? 0 : 255;
      dta[i + 3] = Math.abs(v);
    }
    var tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
    tmp.getContext('2d').putImageData(g, 0, 0);
    c.globalAlpha = 0.5; c.drawImage(tmp, 0, 0); c.globalAlpha = 1;
    if (spec && SUBJECTS[spec.draw]) SUBJECTS[spec.draw](new Pen(c, r, W / 100), spec);
    var gx = left ? W : 0, gutter = c.createLinearGradient(gx, 0, left ? W * 0.94 : W * 0.06, 0);
    gutter.addColorStop(0, 'rgba(60,50,40,0.16)');
    gutter.addColorStop(0.12, 'rgba(60,50,40,0.05)');
    gutter.addColorStop(1, 'rgba(60,50,40,0)');
    c.fillStyle = gutter; c.fillRect(0, 0, W, H);
    c.restore();
    return cv;
  }

  /* ---------- WebGL ---------- */
  var VS = [
    'attribute vec2 aPos;',
    'uniform mat4 uProj; uniform float uDist, uCurl, uRot, uZ, uMirror, uH, uYShift;',
    'varying vec2 vUv; varying float vFace; varying float vWX;',
    'void main(){',
    '  float x = aPos.x; float k = uCurl; float a = x * k;',
    '  vec3 p = vec3(x, aPos.y, 0.0); vec3 n = vec3(0.0, 0.0, 1.0);',
    '  if (k > 0.0001) { p.x = sin(a) / k; p.z = (1.0 - cos(a)) / k; n = normalize(vec3(-sin(a), 0.0, cos(a))); }',
    '  float c = cos(uRot), s = sin(uRot);',
    '  vec3 q = vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);',
    '  vec3 nn = vec3(n.x * c + n.z * s, n.y, -n.x * s + n.z * c);',
    '  q.x *= uMirror; q.z += uZ;',
    '  vFace = nn.z; vWX = q.x;',
    '  vUv = vec2(uMirror > 0.0 ? x : 1.0 - x, 0.5 - aPos.y / uH);',
    '  gl_Position = uProj * vec4(q.x, q.y + uYShift, q.z - uDist, 1.0);',
    '}'
  ].join('\n');
  var FS = [
    'precision mediump float;',
    'uniform sampler2D uFront, uBack; uniform float uShade, uEdge, uShadeSide;',
    'varying vec2 vUv; varying float vFace; varying float vWX;',
    'void main(){',
    '  vec4 col = vFace >= 0.0 ? texture2D(uFront, vUv) : texture2D(uBack, vec2(1.0 - vUv.x, vUv.y));',
    '  if (col.a < 0.5) discard;',
    '  float light = mix(0.94, 1.0, abs(vFace));',
    '  float d = max(0.0, (vWX - uEdge) * uShadeSide);',
    '  float sh = uShade * exp(-d * 3.2);',
    '  gl_FragColor = vec4(col.rgb * light * (1.0 - sh), 1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  }

  function perspective(fovDeg, aspect, near, far) {
    var f = 1 / Math.tan(fovDeg * Math.PI / 360), nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  }

  function createSketchbook(container, options) {
    var o = {};
    for (var k in DEFAULTS) o[k] = DEFAULTS[k];
    for (k in options || {}) o[k] = options[k];
    var spreads = o.spreads;
    // Leaf i: front = right page of spread i, back = left page of spread i+1.
    var leaves = spreads.length;
    var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var stage = container.querySelector('[data-sb-stage]');
    var canvas = stage.querySelector('canvas');
    var shadowEl = stage.querySelector('[data-sb-shadow]');
    var band = stage.querySelector('[data-sb-band]');
    var capLoc = container.querySelector('[data-sb-loc]');
    var capDate = container.querySelector('[data-sb-date]');
    var capNote = container.querySelector('[data-sb-note]');
    var caption = container.querySelector('[data-sb-caption]');
    var dial = container.querySelector('[data-sb-dial]');

    var gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) { container.classList.add('sb-nogl'); return { destroy: function () {} }; }
    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    var U = {};
    ['uProj', 'uDist', 'uCurl', 'uRot', 'uZ', 'uMirror', 'uH', 'uYShift', 'uFront', 'uBack', 'uShade', 'uEdge', 'uShadeSide']
      .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

    var seg = o.segments, verts = [], idx = [], H = o.pageHeight;
    for (var i = 0; i <= seg; i++) {
      var x = i / seg * o.pageWidth;
      verts.push(x, H / 2, x, -H / 2);
    }
    for (i = 0; i < seg; i++) { var a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    var vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    var ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    gl.uniform1i(U.uFront, 0); gl.uniform1i(U.uBack, 1);
    gl.uniform1f(U.uH, H);

    var texCache = new Map();
    function tex(key, side, spec) {
      if (texCache.has(key)) return texCache.get(key);
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paperTexture(side, spec, o, key.length * 31 + hash(key)));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      texCache.set(key, t);
      return t;
    }
    function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
    function leftTex(s) { return tex('L' + s, 'left', spreads[s] && spreads[s].left); }
    function rightTex(s) { return tex('R' + s, 'right', spreads[s] && spreads[s].right); }

    var cur = 0;            // spread index at rest
    var flip = null;        // { leaf, p, v, target }
    var dpr = 1, bookW = 0, bookH = 0, cw = 0, ch = 0, dist = 3.7;

    function layout() {
      var vw = container.clientWidth, vh = container.clientHeight;
      var mobile = vw < o.mobileBreak;
      bookW = Math.min(o.maxWidth, mobile ? vw - 32 : vw * o.widthRatio);
      bookW = Math.min(bookW, (vh * 0.62) * 2 * o.pageWidth / H);
      bookH = bookW / 2 * H / o.pageWidth;
      cw = Math.round(bookW * 1.3); ch = Math.round(bookH * 2.4);
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
      canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
      stage.style.width = bookW + 'px'; stage.style.height = bookH + 'px';
      var visH = H * ch / bookH;
      dist = visH / (2 * Math.tan(o.fov * Math.PI / 360));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniformMatrix4fv(U.uProj, false, perspective(o.fov, cw / ch, 0.1, 100));
      gl.uniform1f(U.uDist, dist);
      gl.uniform1f(U.uYShift, 0);
      draw();
    }

    function drawPage(front, back, rot, curl, z, mirror, shade, edge, shadeSide) {
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, front);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, back || front);
      gl.uniform1f(U.uRot, rot); gl.uniform1f(U.uCurl, curl); gl.uniform1f(U.uZ, z);
      gl.uniform1f(U.uMirror, mirror);
      gl.uniform1f(U.uShade, shade || 0); gl.uniform1f(U.uEdge, edge || 0); gl.uniform1f(U.uShadeSide, shadeSide || 1);
      gl.drawElements(gl.TRIANGLES, seg * 6, gl.UNSIGNED_SHORT, 0);
    }

    function eased(t) {
      var w = o.flipWeight, a = Math.pow(t, w), b = Math.pow(1 - t, w);
      return a / (a + b);
    }

    function draw() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!flip) {
        drawPage(leftTex(cur), null, 0, 0, 0, -1);
        drawPage(rightTex(cur), null, 0, 0, 0, 1);
        return;
      }
      var L = flip.leaf, t = Math.min(1, Math.max(0, flip.p)), r = eased(t);
      var rot = -Math.PI * r, curl = o.curlPeak * Math.sin(Math.PI * t);
      // Edge of the turning leaf in world x, used to fall the cast shadow off the static pages.
      var edgeX = Math.cos(rot);
      var amt = o.shadowMax * Math.sin(Math.PI * t);
      // Static pages under the turning leaf: left = spread L, right = spread L+1.
      drawPage(leftTex(L), null, 0, 0, 0, -1, r > 0.5 ? amt : 0, edgeX, -1);
      drawPage(rightTex(L + 1), null, 0, 0, 0, 1, r <= 0.5 ? amt : 0, edgeX, 1);
      drawPage(rightTex(L), leftTex(L + 1), rot, curl, 0.004 + 0.02 * Math.sin(Math.PI * t), 1, 0);
    }

    function setCaption(s) {
      var d = spreads[s] || {};
      capLoc.textContent = d.place || '';
      capDate.textContent = d.date || '';
      capNote.textContent = d.note || '';
      var ticks = dial ? dial.children : [];
      for (var i = 0; i < ticks.length; i++) ticks[i].classList.toggle('is-on', i === s);
    }

    if (dial) {
      spreads.forEach(function (sp, i) {
        var b = document.createElement('button');
        b.className = 'sb-tick'; b.type = 'button';
        b.setAttribute('aria-label', 'Spread ' + (i + 1) + (sp.place ? ', ' + sp.place : ''));
        b.addEventListener('click', function () { jump(i); });
        dial.appendChild(b);
      });
    }

    var raf = 0, last = 0;
    function tick(now) {
      raf = 0;
      if (!flip) return;
      var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (!flip.dragging) {
        // Several queued pages (dial jump) run on a stiffer spring so a long jump doesn't take seconds.
        var sp = o.spring, boost = flip.queue != null ? 3 : 1;
        var F = -sp.stiffness * boost * (flip.p - flip.target) - sp.damping * Math.sqrt(boost) * flip.v;
        flip.v += F / sp.mass * dt; flip.p += flip.v * dt;
        if (Math.abs(flip.p - flip.target) < 0.006 && Math.abs(flip.v) < 0.05) {
          var done = flip; flip = null;
          cur = done.target === 1 ? done.leaf + 1 : done.leaf;
          setCaption(cur);
          if (done.queue != null && done.queue !== cur) { go(done.queue); }
          draw(); return;
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    }
    function kick() { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } }

    function start(dir, p0) {
      var leaf = dir > 0 ? cur : cur - 1;
      if (leaf < 0 || leaf >= leaves - 1) return null;
      flip = { leaf: leaf, p: p0, v: 0, target: dir > 0 ? 1 : 0, dragging: false };
      return flip;
    }
    function go(target) {
      if (target === cur || target < 0 || target >= leaves) return;
      if (flip) { flip.queue = target; return; }
      var dir = target > cur ? 1 : -1;
      if (reduced) { cur = target; setCaption(cur); draw(); return; }
      var f = start(dir, dir > 0 ? 0 : 1);
      if (!f) return;
      if (Math.abs(target - cur) > 1) f.queue = target;
      setCaption(dir > 0 ? cur + 1 : cur - 1);
      kick();
    }
    function next() { go(cur + 1); }
    function prev() { go(cur - 1); }
    function jump(i) { go(i); }

    var drag = null;
    function onDown(e) {
      if (flip || e.button > 0 || (e.target.closest && e.target.closest('[data-sb-caption]'))) return;
      var rect = stage.getBoundingClientRect();
      drag = { x0: e.clientX, y0: e.clientY, side: e.clientX > rect.left + rect.width / 2 ? 1 : -1, moved: false, lastX: e.clientX, lastT: performance.now(), vx: 0 };
      stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      if (!drag) return;
      var dx = e.clientX - drag.x0;
      var now = performance.now(), dtm = Math.max(1, now - drag.lastT);
      drag.vx = (e.clientX - drag.lastX) / dtm * 1000 / bookW; drag.lastX = e.clientX; drag.lastT = now;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        if (reduced || !start(drag.side, drag.side > 0 ? 0 : 1)) { drag = null; return; }
        flip.dragging = true;
      }
      if (drag.moved && flip) {
        var p = drag.side > 0 ? -dx / bookW : 1 - dx / bookW;
        flip.p = Math.min(1, Math.max(0, p));
        draw();
      }
    }
    function onUp(e) {
      if (!drag) return;
      var d = drag; drag = null;
      if (!d.moved) {
        if (d.side > 0) next(); else prev();
        return;
      }
      if (!flip) return;
      flip.dragging = false;
      var fwd = d.side > 0, prog = fwd ? flip.p : 1 - flip.p, flick = fwd ? -d.vx : d.vx;
      var complete = prog > o.drag.completeThreshold || flick > o.drag.flickVelocity;
      flip.target = fwd ? (complete ? 1 : 0) : (complete ? 0 : 1);
      flip.v = -d.vx;
      if (complete) setCaption(fwd ? flip.leaf + 1 : flip.leaf);
      kick();
    }
    function onKey(e) {
      if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
    }

    stage.addEventListener('pointerdown', onDown);
    global.addEventListener('pointermove', onMove);
    global.addEventListener('pointerup', onUp);
    global.addEventListener('pointercancel', onUp);
    container.addEventListener('keydown', onKey);
    var ro = new ResizeObserver(layout);
    ro.observe(container);
    setCaption(0);
    layout();

    return {
      next: next, prev: prev, jump: jump,
      get index() { return cur; },
      setProgress: function (p, dir) {
        if (!flip) start(dir || 1, 0);
        if (flip) { flip.dragging = true; flip.p = p; draw(); }
      },
      destroy: function () {
        cancelAnimationFrame(raf);
        ro.disconnect();
        stage.removeEventListener('pointerdown', onDown);
        global.removeEventListener('pointermove', onMove);
        global.removeEventListener('pointerup', onUp);
        global.removeEventListener('pointercancel', onUp);
        container.removeEventListener('keydown', onKey);
        texCache.forEach(function (t) { gl.deleteTexture(t); });
        texCache.clear();
        if (dial) dial.innerHTML = '';
      }
    };
  }

  global.createSketchbook = createSketchbook;
})(window);
