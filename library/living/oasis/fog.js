/* Fog: caustics shader + 6-point blob. Numbers from mymind onboard.js. */
(function (global) {
  const VERT = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const FRAG = `
    precision highp float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uScale;
    uniform float uRed;
    uniform float uGreen;
    uniform float uBlue;
    uniform float uBackgroundRed;
    uniform float uBackgroundGreen;
    uniform float uBackgroundBlue;
    uniform float uInterpolation;
    uniform float uIntensity;
    uniform float uPattern;
    varying vec2 vUv;

    float hash(vec3 p) {
      p = 50.0 * fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
      return -1.0 + 2.0 * fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    vec4 noised(in vec3 x) {
      vec3 i = floor(x);
      vec3 w = fract(x);
      vec3 u = 0.5 - 0.5 * cos(3.1416 * w);
      vec3 du = 0.5 * 3.1416 * sin(3.1416 * w);
      float a = hash(i + vec3(0.0, 0.0, 0.0));
      float b = hash(i + vec3(1.0, 0.0, 0.0));
      float c = hash(i + vec3(0.0, 1.0, 0.0));
      float d = hash(i + vec3(1.0, 1.0, 0.0));
      float e = hash(i + vec3(0.0, 0.0, 1.0));
      float f = hash(i + vec3(1.0, 0.0, 1.0));
      float g = hash(i + vec3(0.0, 1.0, 1.0));
      float h = hash(i + vec3(1.0, 1.0, 1.0));
      float k0 = a;
      float k1 = b - a;
      float k2 = c - a;
      float k3 = e - a;
      float k4 = a - b - c + d;
      float k5 = a - c - e + g;
      float k6 = a - b - e + f;
      float k7 = -a + b + c - d + e - f - g + h;
      return vec4(
        k0 + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z,
        du * vec3(
          k1 + k4 * u.y + k6 * u.z + k7 * u.y * u.z,
          k2 + k5 * u.z + k4 * u.x + k7 * u.z * u.x,
          k3 + k6 * u.x + k5 * u.y + k7 * u.x * u.y
        )
      );
    }

    float noised_caustics_improveXYPlanes(in vec3 x) {
      mat3 orthonormalMap = mat3(
        0.788675134594813, -0.211324865405187, -0.577350269189626,
        -0.211324865405187, 0.788675134594813, -0.577350269189626,
        0.577350269189626, 0.577350269189626, 0.577350269189626
      );
      x = x * orthonormalMap;
      vec4 result = noised(x);
      return noised(x - uPattern * result.yzw).x;
    }

    void main() {
      vec2 fragCoord = vUv * vec2(uResolution.x, uResolution.y);
      vec2 uv = fragCoord / uResolution.y;
      vec3 X = vec3(uv * uScale, uTime * uSpeed);
      float value = noised_caustics_improveXYPlanes(X);
      value = value * uInterpolation + uIntensity;
      vec4 backCol = vec4(uBackgroundRed, uBackgroundGreen, uBackgroundBlue, 1.0);
      vec4 col = vec4(value * vec3(uRed, uGreen, uBlue), 1.0);
      gl_FragColor = mix(col, backCol, 0.4);
    }
  `;

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) || "shader");
    }
    return s;
  }

  function startShader(canvas) {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return { attr: { timeAdded: 0 }, resize() {}, dispose() {} };

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "position");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "link");
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const loc = (n) => gl.getUniformLocation(prog, n);
    const uRes = loc("uResolution");
    const uTime = loc("uTime");
    // presetShader(0.6, 2.7, 0.9, 0.95, 1, 1.8, 0.07, 0.05, 0.13, 0.5, 0.13)
    gl.uniform1f(loc("uSpeed"), 0.6);
    gl.uniform1f(loc("uScale"), 2.7);
    gl.uniform1f(loc("uRed"), 0.9);
    gl.uniform1f(loc("uGreen"), 0.95);
    gl.uniform1f(loc("uBlue"), 1);
    gl.uniform1f(loc("uIntensity"), 1.8);
    gl.uniform1f(loc("uBackgroundRed"), 0.07);
    gl.uniform1f(loc("uBackgroundGreen"), 0.05);
    gl.uniform1f(loc("uBackgroundBlue"), 0.13);
    gl.uniform1f(loc("uInterpolation"), 0.5);
    gl.uniform1f(loc("uPattern"), 0.13);

    const attr = { timeAdded: 0 };
    let raf = 0;
    let dead = false;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }

    function frame(t) {
      if (dead) return;
      raf = requestAnimationFrame(frame);
      gl.uniform1f(uTime, t / 1000 + attr.timeAdded);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    resize();
    raf = requestAnimationFrame(frame);
    return {
      attr,
      resize,
      dispose() {
        dead = true;
        cancelAnimationFrame(raf);
      }
    };
  }

  function cardinal(data, closed, tension) {
    if (data.length < 1) return "M0 0";
    if (tension == null) tension = 1;
    const size = data.length - (closed ? 0 : 1);
    let path = "M" + data[0].x + " " + data[0].y + " C";
    for (let i = 0; i < size; i++) {
      let p0, p1, p2, p3;
      if (closed) {
        p0 = data[(i - 1 + size) % size];
        p1 = data[i];
        p2 = data[(i + 1) % size];
        p3 = data[(i + 2) % size];
      } else {
        p0 = i == 0 ? data[0] : data[i - 1];
        p1 = data[i];
        p2 = data[i + 1];
        p3 = i == size - 1 ? p2 : data[i + 2];
      }
      const x1 = p1.x + ((p2.x - p0.x) / 6) * tension;
      const y1 = p1.y + ((p2.y - p0.y) / 6) * tension;
      const x2 = p2.x - ((p3.x - p1.x) / 6) * tension;
      const y2 = p2.y - ((p3.y - p1.y) / 6) * tension;
      path += " " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + p2.x + " " + p2.y;
    }
    return closed ? path + "z" : path;
  }

  function createBlob(gsap, path, options) {
    const points = [];
    const slice = (Math.PI * 2) / options.numPoints;
    const startAngle = gsap.utils.random(0, 360);
    const tl = gsap.timeline({ onUpdate: update, paused: false });
    for (let i = 0; i < options.numPoints; i++) {
      const angle = startAngle + i * slice;
      const duration = gsap.utils.random(options.minDuration, options.maxDuration);
      const point = {
        x: options.centerX + Math.cos(angle) * options.minRadius,
        y: options.centerY + Math.sin(angle) * options.minRadius
      };
      const tween = gsap.to(point, {
        duration,
        x: options.centerX + Math.cos(angle) * options.maxRadius,
        y: options.centerY + Math.sin(angle) * options.maxRadius,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      tl.add(tween, -gsap.utils.random(0, duration));
      points.push(point);
    }
    tl.seek(0.001);
    update();
    function update() {
      path.setAttribute("d", cardinal(points, true, 1.2));
    }
    return tl;
  }

  global.initFog = function initFog({ gsap, canvas, path, img, stage }) {
    const shader = startShader(canvas);
    let blob = createBlob(gsap, path, {
      numPoints: 6,
      centerX: 500,
      centerY: 500,
      minRadius: 330,
      maxRadius: 350,
      minDuration: 1.2,
      maxDuration: 2
    });

    gsap.set(img, { xPercent: -50, yPercent: -56, transformOrigin: "50% 50%" });

    const wrap = canvas.parentElement;
    const toX = gsap.quickTo(wrap, "x", { duration: 0.7, ease: "power2" });
    const toY = gsap.quickTo(wrap, "y", { duration: 0.7, ease: "power2" });

    function onMove(e) {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      toX(nx * 18);
      toY(ny * 12);
    }

    function onClick() {
      gsap.to(shader.attr, {
        timeAdded: shader.attr.timeAdded + 2,
        ease: "power2.inOut",
        duration: 0.8
      });
    }

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("click", onClick);
    window.addEventListener("resize", shader.resize);

    return {
      pulse: onClick,
      restartBlob() {
        blob.kill();
        blob = createBlob(gsap, path, {
          numPoints: 6,
          centerX: 500,
          centerY: 500,
          minRadius: 330,
          maxRadius: 350,
          minDuration: 1.2,
          maxDuration: 2
        });
      },
      resize: shader.resize
    };
  };
})(window);
