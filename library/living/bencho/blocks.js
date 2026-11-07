/* Vanilla mounts for the 29 Bencho blocks. Recipes live in source/*.css.txt. */
(function (global) {
  const $ = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const initials = (name) => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  const I = {
    plus: 'M12 5v14M5 12h14',
    search: 'M15.5 14.5l5 5M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z',
    x: 'M6 6l12 12M18 6L6 18',
    mic: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
    home: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z',
    folder: 'M3 7h6l2 2h10v10H3z',
    bookmark: 'M7 4h10v16l-5-3-5 3z',
    user: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 9a7 7 0 0 1 14 0',
    bell: 'M6 9a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7zm4 11a2 2 0 0 0 4 0',
    trash: 'M4 7h16M9 7V5h6v2M6 7l1 14h10l1-14',
    check: 'M5 12l5 5L20 7',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    play: 'M9 7l10 5-10 5z',
    pause: 'M8 6h3v12H8zM13 6h3v12h-3z',
    prev: 'M11 8l-5 4 5 4M18 8l-5 4 5 4',
    next: 'M6 8l5 4-5 4M13 8l5 4-5 4',
    refresh: 'M4 4v6h6M20 20v-6h-6M5 19A8 8 0 0 0 19 8M19 5A8 8 0 0 0 5 16',
    file: 'M6 3h8l4 4v14H6z',
    sheet: 'M6 3h12v18H6zM6 9h12M10 9v12',
    board: 'M4 5h16v14H4zM4 10h16',
    cursor: 'M5 3l14 9-6 1-3 7z',
    stamp: 'M7 11h10v8H7zM9 7h6v4H9z',
    hash: 'M5 9h14M5 15h14M9 4l-2 16M17 4l-2 16',
    rect: 'M5 6h14v12H5z',
    pen: 'M4 20l4.5-1L19 8.5 15.5 5 5 15.5z',
    type: 'M5 7h14M12 7v12M8 19h8',
    minus: 'M6 12h12',
    wave: 'M3 12c2-6 4 6 6 0s4 6 6 0 4 6 6 0'
  };
  function icon(name, size) {
    size = size || 16;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + (I[name] || '') + '"/></svg>';
  }
  function face(name, tint, size) {
    size = size || 28;
    const el = $('<span class="pik-av"></span>');
    el.style.width = el.style.height = size + 'px';
    el.style.background = tint;
    el.textContent = initials(name);
    return el;
  }

  const PEOPLE = [
    { id: 'kai', name: 'Adam Marsh', role: 'Design', tint: '#c084fc' },
    { id: 'mara', name: 'Priya Raman', role: 'Research', tint: '#3b82f6' },
    { id: 'sofia', name: 'Nora Wilder', role: 'Engineering', tint: '#4ade80' },
    { id: 'ines', name: 'Marco Bellini', role: 'Product', tint: '#ef4444' }
  ];
  const ARR = [
    { id: 'mara', name: 'Mara Quinn', here: true, tint: '#7c3aed' },
    { id: 'ines', name: 'Tomás Oliveira', here: false, tint: '#0e7490' },
    { id: 'kai', name: 'Lars Andersen', here: true, tint: '#b8431c' },
    { id: 'sofia', name: 'Sofia Ricci', here: false, tint: '#15803d' }
  ];
  const RST = [
    { id: 'mara', name: 'Nadia Okonkwo', handle: '@nadia', tint: '#3b82f6' },
    { id: 'ines', name: 'Tomas Cardoso', handle: '@tomas', tint: '#ef4444' },
    { id: 'kai', name: 'Kai Brenner', handle: '@kai', tint: '#c084fc' },
    { id: 'sofia', name: 'Lukas Lindqvist', handle: '@lukas', tint: '#4ade80' }
  ];

  function mountMagnet(root) {
    const N = 5, CHIP = 44, PITCH = 72;
    const box = $('<div class="mag"><span class="mag-orb"></span></div>');
    const chips = [];
    let sel = -1;
    for (let n = 0; n < N; n++) {
      const el = $('<button class="mag-chip" type="button"><i></i></button>');
      box.appendChild(el);
      chips.push({ el, a: (n / N) * Math.PI * 2 - Math.PI / 2 });
      el.addEventListener('click', () => { sel = sel === n ? -1 : n; layout(); });
    }
    function layout() {
      const cx = 110, cy = 110;
      const sx = sel < 0 ? cx : cx + Math.cos(chips[sel].a) * PITCH;
      const sy = sel < 0 ? cy : cy + Math.sin(chips[sel].a) * PITCH;
      chips.forEach((c, i) => {
        const on = i === sel;
        c.el.toggleAttribute('data-on', on);
        const x = cx + Math.cos(c.a) * PITCH;
        const y = cy + Math.sin(c.a) * PITCH;
        let px = x, py = y, grow = 1, delay = 0;
        if (sel >= 0) {
          const dx = x - sx, dy = y - sy;
          const gap = Math.hypot(dx, dy) || 1;
          const far = gap / PITCH;
          const pull = on ? 1 : 0.55;
          grow = on ? 1.16 + 0.22 * pull : 1;
          const room = CHIP * ((on ? grow : 1.16 + 0.22) - 1) / 2;
          const aura = 3 + 9 * pull;
          const fall = Math.exp(-(far - 1) / 1.8);
          const push = on ? 0 : room + aura * fall;
          px = x + (dx / gap) * push;
          py = y + (dy / gap) * push;
          delay = far * 22;
        }
        c.el.style.transitionDelay = delay + 'ms';
        c.el.style.transform = 'translate(' + (px - cx) + 'px,' + (py - cy) + 'px) scale(' + grow + ')';
      });
    }
    layout();
    root.appendChild(box);
  }

  function mountSeek(root) {
    const el = $('<div class="seek" role="search"><span class="seek-lens">' + icon('search', 18) + '</span><input type="search" placeholder="Search" /></div>');
    const input = el.querySelector('input');
    const open = () => {
      el.setAttribute('data-sink', '');
      setTimeout(() => {
        el.removeAttribute('data-sink');
        el.setAttribute('data-open', '');
        input.focus();
      }, 90);
    };
    const close = () => { if (!input.value) el.removeAttribute('data-open'); };
    el.addEventListener('click', () => { if (!el.hasAttribute('data-open')) open(); });
    input.addEventListener('blur', close);
    root.appendChild(el);
  }

  function mountEscape(root) {
    const field = $('<div class="esc-field"></div>');
    const btn = $('<button class="esc-btn" type="button">Touch me</button>');
    field.appendChild(btn);
    let dodges = 0, armed = true, caught = false, dir = { x: 1, y: 0 };
    const patience = 4, radius = 120, reach = 70;
    function home() {
      btn.removeAttribute('data-fled');
      btn.style.transform = 'translate(-50%,-50%)';
    }
    field.addEventListener('pointermove', (e) => {
      if (caught) return;
      const box = field.getBoundingClientRect();
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy);
      if (distance > 6) dir = { x: -dx / distance, y: -dy / distance };
      const flee = Math.max(0, 1 - distance / radius) ** 2;
      if (distance < radius * 0.55 && armed) { armed = false; dodges++; }
      if (distance > radius) armed = true;
      if (dodges >= patience) {
        caught = true;
        btn.textContent = 'Fine.';
        btn.removeAttribute('data-fled');
        home();
        return;
      }
      const room = { x: box.width / 2 - 50, y: box.height / 2 - 24 };
      const x = clamp(dir.x * flee * reach, -room.x, room.x);
      const y = clamp(dir.y * flee * reach, -room.y, room.y);
      btn.setAttribute('data-fled', '');
      btn.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px))';
    });
    field.addEventListener('pointerleave', () => { if (!caught) home(); });
    btn.addEventListener('click', () => {
      caught = true;
      btn.textContent = 'Fine.';
      home();
      setTimeout(() => { caught = false; dodges = 0; armed = true; btn.textContent = 'Touch me'; }, 760);
    });
    root.appendChild(field);
  }

  function mountCreate(root) {
    const items = [
      { icon: 'file', label: 'Document' },
      { icon: 'sheet', label: 'Spreadsheet' },
      { icon: 'board', label: 'Board' },
      { icon: 'folder', label: 'Folder' }
    ];
    const stage = $('<div class="crt-stage"><div class="crt-panel"><button class="crt-pill" type="button">' + icon('plus', 16) + '<span>Create</span></button><ul class="crt-menu"></ul></div></div>');
    const menu = stage.querySelector('.crt-menu');
    items.forEach((it, i) => {
      const li = $('<li class="crt-item"><button type="button">' + icon(it.icon, 15) + '<span>' + it.label + '</span></button></li>');
      li.querySelector('button').style.transitionDelay = (70 + i * 38) + 'ms';
      li.querySelector('button').addEventListener('click', () => stage.removeAttribute('data-open'));
      menu.appendChild(li);
    });
    stage.querySelector('.crt-pill').addEventListener('click', () => {
      stage.setAttribute('data-sink', '');
      setTimeout(() => { stage.removeAttribute('data-sink'); stage.setAttribute('data-open', ''); }, 95);
    });
    document.addEventListener('pointerdown', (e) => {
      if (!stage.hasAttribute('data-open')) return;
      const b = stage.querySelector('.crt-panel').getBoundingClientRect();
      const on = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
      if (!on) stage.removeAttribute('data-open');
    });
    root.appendChild(stage);
  }

  function mountRadial(root) {
    const tools = ['cursor', 'stamp', 'hash', 'rect', 'pen', 'type'];
    const fan = $('<div class="fan"><button class="fan-core" type="button">' + icon('plus', 18) + '</button></div>');
    const opts = tools.map((name, i) => {
      const b = $('<button class="fan-opt" type="button">' + icon(name, 16) + '</button>');
      fan.appendChild(b);
      b.style.transitionDelay = (i * 30) + 'ms';
      b.addEventListener('click', () => fan.removeAttribute('data-open'));
      return b;
    });
    function place(open) {
      const r = open ? 68 : 0;
      opts.forEach((b, i) => {
        const a = mix(-Math.PI * 0.85, Math.PI * 0.85, i / (opts.length - 1)) - Math.PI / 2;
        b.style.transform = 'translate(' + Math.cos(a) * r + 'px,' + Math.sin(a) * r + 'px)';
      });
    }
    fan.querySelector('.fan-core').addEventListener('click', () => {
      const open = !fan.hasAttribute('data-open');
      fan.toggleAttribute('data-open', open);
      place(open);
    });
    place(false);
    root.appendChild(fan);
  }

  function mountSound(root) {
    const el = $('<button class="snd" type="button"><img class="snd-cover" alt="" src="assets/sound.jpg" /><div class="snd-meta"><b>Cabra Field</b><span class="snd-by">Side B</span></div><div class="snd-ctrl"><span>' + icon('prev', 14) + '</span><span class="snd-play">' + icon('play', 12) + '</span><span>' + icon('next', 14) + '</span></div><div class="snd-bar"><span class="snd-run"></span></div></button>');
    let open = false, playing = false;
    el.addEventListener('click', (e) => {
      if (e.target.closest('.snd-play')) {
        playing = !playing;
        el.querySelector('.snd-play').innerHTML = icon(playing ? 'pause' : 'play', 12);
        e.stopPropagation();
        return;
      }
      open = !open;
      el.toggleAttribute('data-open', open);
    });
    root.appendChild(el);
  }

  function mountIconBar(root) {
    const names = ['home', 'search', 'folder', 'bookmark', 'user'];
    const bar = $('<div class="gnav"><span class="gnav-pill"></span></div>');
    const pill = bar.querySelector('.gnav-pill');
    names.forEach((n, i) => {
      const b = $('<button class="gnav-item" type="button">' + icon(n, 16) + '</button>');
      bar.appendChild(b);
      b.addEventListener('click', () => { pill.style.transform = 'translateX(' + (i * 40) + 'px)'; });
    });
    root.appendChild(bar);
  }

  function mountProgress(root) {
    const el = $('<div class="ticks"><div class="ticks-read">66<span>%</span></div><div class="ticks-row"></div></div>');
    const row = el.querySelector('.ticks-row');
    const N = 28, filled = 18;
    for (let i = 0; i < N; i++) {
      const b = document.createElement('b');
      const h = 18 + Math.sin(i * 0.55) * 16 + (i > filled ? -8 : 8);
      b.style.height = Math.max(8, h) + 'px';
      b.style.opacity = i < filled ? '1' : '.22';
      row.appendChild(b);
    }
    el.addEventListener('pointermove', (e) => {
      const r = row.getBoundingClientRect();
      const t = clamp((e.clientX - r.left) / r.width, 0, 1);
      const n = Math.round(t * N);
      el.querySelector('.ticks-read').innerHTML = Math.round(t * 100) + '<span>%</span>';
      [...row.children].forEach((b, i) => { b.style.opacity = i < n ? '1' : '.22'; });
    });
    root.appendChild(el);
  }

  function mountCommand(root) {
    const el = $('<form class="cmd"><input placeholder="Ask anything..." /><button class="cmd-ask" type="submit">Ask</button><span class="cmd-mic">' + icon('wave', 16) + '</span></form>');
    const input = el.querySelector('input');
    input.addEventListener('input', () => el.toggleAttribute('data-has', !!input.value.trim()));
    el.addEventListener('submit', (e) => { e.preventDefault(); input.value = ''; el.removeAttribute('data-has'); });
    root.appendChild(el);
  }

  function mountToggle(root) {
    const el = $('<button class="liq-sw" type="button" aria-pressed="false"><span class="liq-thumb"></span></button>');
    el.addEventListener('click', () => {
      el.setAttribute('data-stretch', '');
      setTimeout(() => {
        const on = el.getAttribute('aria-pressed') !== 'true';
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
        el.toggleAttribute('data-on', on);
        el.removeAttribute('data-stretch');
      }, 90);
    });
    root.appendChild(el);
  }

  function mountChecklist(root) {
    const tasks = ['Book the studio', 'Send the estimate', 'Pick a typeface'];
    const form = $('<form class="sheet"></form>');
    const rows = [];
    tasks.forEach((text) => {
      const row = $('<div class="chk-row"><span class="chk-box"><span class="chk-fill"></span><span class="chk-tick">' + icon('check', 12) + '</span></span><span class="chk-word">' + text + '<span class="chk-rule"></span></span></div>');
      form.appendChild(row);
      rows.push(row);
      row.addEventListener('click', () => {
        row.toggleAttribute('data-on');
        const fell = rows.every((r) => r.hasAttribute('data-on'));
        rows.forEach((r, i) => {
          r.style.transition = fell ? 'transform .62s ease-in' : 'transform .4s cubic-bezier(.22,1.12,.36,1)';
          r.style.transitionDelay = fell ? ((rows.length - 1 - i) * 45) + 'ms' : '0ms';
          r.style.transform = fell ? 'translateY(36px) rotate(' + (i % 2 ? 2 : -2) + 'deg)' : '';
        });
      });
    });
    form.appendChild($('<div class="chk-new">Add new task</div>'));
    root.appendChild(form);
  }

  function mountPicker(root) {
    const wrap = $('<div class="pik"></div>');
    const pill = $('<button class="pik-pill" type="button"><span class="pik-rail"></span><span class="pik-chev">▾</span></button>');
    const rail = pill.querySelector('.pik-rail');
    const card = $('<div class="pik-card"></div>');
    let picked = ['kai', 'mara'];
    let open = true;
    function renderRail() {
      rail.innerHTML = '';
      const FACE = 28, overlap = 10;
      rail.style.width = picked.length ? FACE + (picked.length - 1) * (FACE - overlap) + 'px' : '0';
      picked.forEach((id, i) => {
        const p = PEOPLE.find((x) => x.id === id);
        const f = face(p.name, p.tint, 28);
        f.className = 'pik-face';
        f.style.transform = 'translateX(' + (i * (FACE - overlap)) + 'px)';
        rail.appendChild(f);
      });
    }
    PEOPLE.forEach((p) => {
      const row = $('<button class="pik-row" type="button"><span></span><span class="pik-name">' + p.name + '<small>' + p.role + '</small></span><span class="pik-tick">' + icon('check', 12) + '</span></button>');
      row.querySelector('span').replaceWith(face(p.name, p.tint, 32));
      row.addEventListener('click', () => {
        if (picked.includes(p.id)) picked = picked.filter((x) => x !== p.id);
        else picked = [...picked, p.id];
        paint();
      });
      card.appendChild(row);
    });
    function paint() {
      renderRail();
      [...card.children].forEach((row, i) => row.toggleAttribute('data-on', picked.includes(PEOPLE[i].id)));
    }
    pill.addEventListener('click', () => { open = !open; card.style.display = open ? '' : 'none'; });
    paint();
    wrap.appendChild(pill);
    wrap.appendChild(card);
    root.appendChild(wrap);
  }

  function mountAspect(root) {
    const modes = [
      { id: 'land', w: 276, h: 207, icon: 'M4 8h16v8H4z' },
      { id: 'square', w: 239, h: 239, icon: 'M6 6h12v12H6z' },
      { id: 'tall', w: 207, h: 276, icon: 'M8 4h8v16H8z' }
    ];
    let i = 1;
    const el = $('<div class="asp"><div class="asp-pic"></div><div class="asp-tabs"><span class="asp-thumb"></span></div></div>');
    const pic = el.querySelector('.asp-pic');
    const tabs = el.querySelector('.asp-tabs');
    pic.style.backgroundImage = 'url(assets/aspect.jpg)';
    modes.forEach((m, n) => {
      const b = $('<button class="asp-tab" type="button"><svg width="14" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="' + m.icon + '"/></svg></button>');
      tabs.appendChild(b);
      b.addEventListener('click', () => { i = n; apply(); });
    });
    function apply() {
      const m = modes[i];
      pic.style.width = m.w + 'px';
      pic.style.height = m.h + 'px';
      el.querySelector('.asp-thumb').style.transform = 'translateX(' + (i * 32) + 'px)';
    }
    apply();
    root.appendChild(el);
  }

  function mountToolbar(root) {
    const tools = ['cursor', 'stamp', 'hash', 'rect', 'pen', 'type'];
    const bar = $('<div class="tlb"></div>');
    let cur = 'cursor', shape = 'rect';
    tools.forEach((n, i) => {
      if (i === 4) bar.appendChild($('<span class="tlb-div"></span>'));
      const b = $('<button type="button"' + (n === 'rect' ? ' class="notch"' : '') + '>' + icon(n, 15) + '</button>');
      b.dataset.tool = n;
      b.addEventListener('click', () => {
        if (n === 'rect' || n === 'stamp') shape = n;
        cur = n;
        paint();
      });
      bar.appendChild(b);
    });
    function paint() {
      [...bar.querySelectorAll('button')].forEach((b) => b.toggleAttribute('data-on', b.dataset.tool === cur));
    }
    paint();
    root.appendChild(bar);
  }

  function mountTilt(root) {
    const frame = $('<div class="tilt-frame"><div class="tilt-card"></div></div>');
    const card = frame.querySelector('.tilt-card');
    card.style.backgroundImage = 'url(assets/tilt.jpg)';
    let nx = 0, ny = 0, on = false;
    function draw() {
      const rx = -ny * 14, ry = nx * 14;
      const x = mix(50, 50 + nx * 40, 1);
      const y = mix(50, 50 + ny * 40, 1);
      card.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      card.style.backgroundImage =
        'radial-gradient(42% 34% at ' + x + '% ' + y + '%, rgba(9,14,28,.25), transparent),' +
        'radial-gradient(52% 42% at ' + (100 - x) + '% ' + (100 - y) + '%, rgba(255,255,255,.15), transparent),' +
        'url(assets/tilt.jpg)';
      const lit = Math.hypot(nx, ny);
      card.style.boxShadow = '0 ' + mix(20, 9, lit) + 'px ' + mix(44, 24, lit) + 'px -8px rgba(15,23,42,.2)';
    }
    frame.addEventListener('pointermove', (e) => {
      const b = frame.getBoundingClientRect();
      nx = ((e.clientX - b.left) / b.width) * 2 - 1;
      ny = ((e.clientY - b.top) / b.height) * 2 - 1;
      on = true; draw();
    });
    frame.addEventListener('pointerleave', () => { nx = ny = 0; on = false; draw(); });
    root.appendChild(frame);
  }

  function mountConfirm(root) {
    const el = $('<div class="cnf" data-phase="idle"><button type="button" class="idle">' + icon('trash', 14) + ' Delete file</button></div>');
    let phase = 'idle';
    function set(p) {
      phase = p;
      el.dataset.phase = p;
      if (p === 'idle') el.innerHTML = '<button type="button" class="idle">' + icon('trash', 14) + ' Delete file</button>';
      if (p === 'asking') el.innerHTML = '<div class="cnf-row"><button type="button" class="no">Keep</button><button type="button" class="yes">Delete</button></div>';
      if (p === 'done') el.innerHTML = '<button type="button" class="undo">Undo</button><div class="cnf-burn"></div>';
      bind();
    }
    let timer;
    function bind() {
      const idle = el.querySelector('.idle');
      const no = el.querySelector('.no');
      const yes = el.querySelector('.yes');
      const undo = el.querySelector('.undo');
      if (idle) idle.addEventListener('click', () => set('asking'));
      if (no) no.addEventListener('click', () => set('idle'));
      if (yes) yes.addEventListener('click', () => {
        set('done');
        clearTimeout(timer);
        timer = setTimeout(() => set('idle'), 3200);
      });
      if (undo) undo.addEventListener('click', () => { clearTimeout(timer); set('idle'); });
    }
    bind();
    root.appendChild(el);
  }

  function mountPull(root) {
    const el = $('<div class="pull"><div class="pull-spin">Refreshing</div><div class="pull-price">$58,834.75</div><div class="pull-delta">+$1,204.60 · 2.1% today</div><svg class="pull-svg" viewBox="0 0 200 72"></svg><div class="pull-tabs"><b>1H</b><b>4H</b><b data-on>1D</b></div></div>');
    const svg = el.querySelector('.pull-svg');
    function spark(seed) {
      let d = 'M0 50';
      for (let i = 1; i <= 20; i++) {
        const y = 50 - ((Math.sin(i * 0.45 + seed) + 1) * 16 + i * 0.7);
        d += ' L' + (i * 10) + ' ' + y;
      }
      svg.innerHTML = '<path d="' + d + '" fill="none" stroke="#16a34a" stroke-width="2"/><circle cx="200" cy="' + (50 - ((Math.sin(20 * 0.45 + seed) + 1) * 16 + 14)) + '" r="3" fill="#16a34a"/>';
    }
    spark(0);
    let start = null, pulling = false;
    el.addEventListener('pointerdown', (e) => { start = e.clientY; pulling = true; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', (e) => {
      if (!pulling || start == null) return;
      const dy = clamp(e.clientY - start, 0, 72);
      el.querySelector('.pull-spin').style.height = dy + 'px';
    });
    el.addEventListener('pointerup', (e) => {
      const dy = start == null ? 0 : e.clientY - start;
      pulling = false; start = null;
      if (dy > 48) {
        el.querySelector('.pull-spin').style.height = '28px';
        setTimeout(() => {
          const n = 58000 + Math.round(Math.random() * 900);
          el.querySelector('.pull-price').textContent = '$' + n.toLocaleString() + '.' + String(Math.floor(Math.random() * 90) + 10);
          spark(Math.random() * 4);
          el.querySelector('.pull-spin').style.height = '0px';
        }, 700);
      } else el.querySelector('.pull-spin').style.height = '0px';
    });
    root.appendChild(el);
  }

  function mountArrange(root) {
    const wrap = $('<div class="arr"></div>');
    let order = ARR.map((_, i) => i);
    function paint() {
      wrap.innerHTML = '';
      order.forEach((idx) => {
        const p = ARR[idx];
        const row = $('<div class="arr-row"><span class="arr-av"></span><span>' + p.name + '</span><span class="arr-dot"></span></div>');
        if (p.here) row.setAttribute('data-here', '');
        const av = row.querySelector('.arr-av');
        av.style.background = p.tint;
        av.textContent = initials(p.name);
        row.addEventListener('pointerdown', (e) => {
          row.setPointerCapture(e.pointerId);
          row.dataset.drag = '1';
          row.style.zIndex = '2';
        });
        row.addEventListener('pointermove', (e) => {
          if (!row.dataset.drag) return;
          const y = e.movementY;
          row.style.transform = 'translateY(' + y + 'px)';
        });
        row.addEventListener('pointerup', (e) => {
          if (!row.dataset.drag) return;
          delete row.dataset.drag;
          const box = wrap.getBoundingClientRect();
          const t = clamp(Math.round((e.clientY - box.top) / 50), 0, order.length - 1);
          const from = order.indexOf(idx);
          order.splice(from, 1);
          order.splice(t, 0, idx);
          paint();
        });
        wrap.appendChild(row);
      });
    }
    paint();
    root.appendChild(wrap);
  }

  function mountSleep(root) {
    const el = $('<div class="slp"><svg viewBox="0 0 200 200"></svg><div class="slp-read">8h 00<small>m</small></div></div>');
    const svg = el.querySelector('svg');
    let start = 1380, end = 1380 + 480; // minutes from midnight-ish
    const cx = 100, cy = 100, r = 72;
    function ang(m) { return ((m / 1440) * 360 - 90) * Math.PI / 180; }
    function pos(m) { return { x: cx + r * Math.cos(ang(m)), y: cy + r * Math.sin(ang(m)) }; }
    function draw() {
      const span = ((end - start) + 1440) % 1440;
      const a0 = ang(start), a1 = ang(end);
      const p0 = pos(start), p1 = pos(end);
      const large = span > 720 ? 1 : 0;
      let ticks = '';
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2 - Math.PI / 2;
        const inner = i % 4 === 0 ? 58 : 62;
        ticks += '<line x1="' + (cx + inner * Math.cos(a)) + '" y1="' + (cy + inner * Math.sin(a)) + '" x2="' + (cx + 70 * Math.cos(a)) + '" y2="' + (cy + 70 * Math.sin(a)) + '" stroke="#17181a" stroke-opacity=".28" stroke-width="2"/>';
      }
      svg.innerHTML = ticks +
        '<path d="M' + p0.x + ' ' + p0.y + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p1.x + ' ' + p1.y + '" fill="none" stroke="#17181a" stroke-width="6" stroke-linecap="round"/>' +
        '<circle class="h0" cx="' + p0.x + '" cy="' + p0.y + '" r="8" fill="#fff" stroke="#17181a" stroke-width="2"/>' +
        '<circle class="h1" cx="' + p1.x + '" cy="' + p1.y + '" r="8" fill="#fff" stroke="#17181a" stroke-width="2"/>';
      const h = Math.floor(span / 60), m = span % 60;
      el.querySelector('.slp-read').innerHTML = h + 'h ' + String(m).padStart(2, '0') + '<small>m</small>';
    }
    let hold = null;
    el.addEventListener('pointerdown', (e) => {
      const b = svg.getBoundingClientRect();
      const x = e.clientX - b.left - b.width / 2, y = e.clientY - b.top - b.height / 2;
      const a = (Math.atan2(y, x) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
      const min = a / (Math.PI * 2) * 1440;
      const ds = Math.abs(((min - start + 720) % 1440) - 720);
      const de = Math.abs(((min - end + 720) % 1440) - 720);
      hold = ds < de ? 'start' : 'end';
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      if (!hold) return;
      const b = svg.getBoundingClientRect();
      const x = e.clientX - b.left - b.width / 2, y = e.clientY - b.top - b.height / 2;
      const a = (Math.atan2(y, x) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
      const min = Math.round(a / (Math.PI * 2) * 1440 / 15) * 15;
      if (hold === 'start') start = min; else end = min;
      draw();
    });
    el.addEventListener('pointerup', () => { hold = null; });
    draw();
    root.appendChild(el);
  }

  function mountBall(root) {
    const pad = $('<div class="pad"><div class="ball"></div></div>');
    const ball = pad.querySelector('.ball');
    let drag = false, ox = 0, oy = 0;
    ball.addEventListener('pointerdown', (e) => {
      drag = true;
      ball.setPointerCapture(e.pointerId);
      const r = ball.getBoundingClientRect();
      ox = e.clientX - r.left - r.width / 2;
      oy = e.clientY - r.top - r.height / 2;
    });
    pad.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const p = pad.getBoundingClientRect();
      let x = e.clientX - p.left - ox, y = e.clientY - p.top - oy;
      x = clamp(x, 36, p.width - 36);
      y = clamp(y, 36, p.height - 36);
      ball.style.left = x + 'px';
      ball.style.top = y + 'px';
      ball.style.margin = '0';
    });
    pad.addEventListener('pointerup', () => { drag = false; });
    root.appendChild(pad);
  }

  function mountSlide(root) {
    const el = $('<div class="sld"><span class="sld-say">Slide to confirm</span><button class="sld-grip" type="button">' + icon('arrow', 16) + '</button></div>');
    const grip = el.querySelector('.sld-grip');
    const say = el.querySelector('.sld-say');
    let grab = null, x = 0, done = false;
    function local(cx) {
      const b = el.getBoundingClientRect();
      return cx - b.left - 4;
    }
    function travel() { return el.getBoundingClientRect().width - 8 - 44; }
    grip.addEventListener('pointerdown', (e) => { if (done) return; grab = null; grip.setPointerCapture(e.pointerId); });
    grip.addEventListener('pointermove', (e) => {
      if (done || !grip.hasPointerCapture(e.pointerId)) return;
      const at = local(e.clientX);
      if (grab === null) { grab = at - x; return; }
      x = clamp(at - grab, 0, travel());
      grip.style.transform = 'translateX(' + x + 'px)';
    });
    grip.addEventListener('pointerup', () => {
      if (done) return;
      if (x > travel() * 0.72) {
        done = true;
        el.setAttribute('data-done', '');
        grip.style.transform = 'translateX(0)';
        say.textContent = 'Confirmed';
      } else {
        x = 0;
        grip.style.transition = 'transform 320ms cubic-bezier(.22,1,.36,1)';
        grip.style.transform = 'translateX(0)';
        setTimeout(() => { grip.style.transition = ''; }, 320);
      }
      grab = null;
    });
    root.appendChild(el);
  }

  function mountCarousel(root) {
    const src = ['assets/carousel-0.jpg', 'assets/carousel-1.jpg', 'assets/carousel-2.jpg'];
    const el = $('<div class="car"></div>');
    const cards = src.map((s) => {
      const c = $('<div class="car-card"></div>');
      c.style.backgroundImage = 'url(' + s + ')';
      el.appendChild(c);
      return c;
    });
    let turn = 0, px = null;
    function layout() {
      cards.forEach((c, i) => {
        const th = (i - turn) * (Math.PI * 2 / cards.length);
        const f = (Math.cos(th) + 1) / 2;
        const x = Math.sin(th) * 78;
        const y = -(1 - f) * 22;
        const s = mix(0.72, 1, f);
        c.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
        c.style.zIndex = String(Math.round(f * 100));
      });
    }
    el.addEventListener('pointerdown', (e) => { px = e.clientX; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', (e) => {
      if (px == null) return;
      turn -= (e.clientX - px) / 180;
      px = e.clientX;
      layout();
    });
    el.addEventListener('pointerup', () => { px = null; });
    layout();
    root.appendChild(el);
  }

  function mountSlosh(root) {
    const el = $('<div class="slo"><span class="slo-fill"></span><span class="slo-knob"></span></div>');
    const fillEl = el.querySelector('.slo-fill');
    const knob = el.querySelector('.slo-knob');
    let value = 40, fill = 40, fv = 0, dragging = false;
    let last = performance.now();
    function setFrom(cx) {
      const b = el.getBoundingClientRect();
      value = clamp(((cx - b.left) / b.width) * 100, 0, 100);
    }
    function loop(now) {
      const dt = clamp((now - last) / 16.67, 0.5, 2);
      last = now;
      const stiff = 0.34 - 0.15 * 0.29;
      const damp = 0.74 + 0.15 * 0.22;
      fv += (value - fill) * stiff * dt;
      fv *= Math.pow(damp, dt);
      fill += fv * dt;
      if (fill > 100) { fill = 100; fv = -fv * 0.42; }
      if (fill < 0) { fill = 0; fv = -fv * 0.42; }
      fillEl.style.width = fill + '%';
      fillEl.style.setProperty('--lean', clamp(fv * 1.2, -16, 16) + 'px');
      knob.style.left = value + '%';
      if (dragging || Math.abs(fv) > 0.02 || Math.abs(fill - value) > 0.2) requestAnimationFrame(loop);
    }
    el.addEventListener('pointerdown', (e) => {
      dragging = true; el.setPointerCapture(e.pointerId); setFrom(e.clientX); last = performance.now(); requestAnimationFrame(loop);
    });
    el.addEventListener('pointermove', (e) => { if (dragging) setFrom(e.clientX); });
    el.addEventListener('pointerup', () => { dragging = false; });
    knob.style.left = value + '%';
    fillEl.style.width = fill + '%';
    root.appendChild(el);
  }

  function mountPalette(root) {
    const el = $('<div class="pal"><button class="pal-go" type="button">' + icon('refresh', 14) + '</button></div>');
    const sw = [];
    for (let i = 0; i < 4; i++) {
      const s = $('<span class="pal-sw"></span>');
      el.insertBefore(s, el.querySelector('.pal-go'));
      sw.push(s);
    }
    function ramp(base) {
      return [0, 1, 2, 3].map((i) => {
        const p = i / 3;
        const L = 0.9 - p * 0.5;
        const C = 0.05 + Math.sin(p * Math.PI) * 0.105;
        const H = i === 3 ? base + 180 : base + i * 22;
        return 'oklch(' + L.toFixed(3) + ' ' + C.toFixed(3) + ' ' + (H % 360) + ')';
      });
    }
    let hue = 20;
    function paint() {
      const cols = ramp(hue);
      sw.forEach((s, i) => { s.style.background = cols[i]; });
    }
    el.querySelector('.pal-go').addEventListener('click', () => {
      el.setAttribute('data-swap', '');
      setTimeout(() => { hue = (hue + 47) % 360; paint(); el.removeAttribute('data-swap'); }, 140);
    });
    paint();
    root.appendChild(el);
  }

  function mountStepper(root) {
    const el = $('<div class="stp"><button type="button" data-dir="-1">' + icon('minus', 14) + '</button><b>24</b><button type="button" data-dir="1">' + icon('plus', 14) + '</button></div>');
    const label = el.querySelector('b');
    let v = 24, sweeping = false, origin = null, timer = null;
    function show() { label.textContent = String(Math.round(clamp(v, 0, 100))); }
    el.querySelectorAll('button').forEach((b) => {
      const dir = Number(b.dataset.dir);
      b.addEventListener('pointerdown', (e) => {
        origin = { x: e.clientX, v };
        sweeping = false;
        timer = setTimeout(() => { sweeping = true; }, 260);
        b.setPointerCapture(e.pointerId);
      });
      b.addEventListener('pointermove', (e) => {
        if (!origin || !sweeping) return;
        const w = el.getBoundingClientRect().width;
        v = clamp(origin.v + ((e.clientX - origin.x) / w) * 100, 0, 100);
        show();
      });
      b.addEventListener('pointerup', () => {
        clearTimeout(timer);
        if (!sweeping) v = clamp(v + dir, 0, 100);
        sweeping = false; origin = null; show();
      });
    });
    root.appendChild(el);
  }

  function mountToasts(root) {
    const el = $('<button class="bell-btn" type="button"><span class="bell-ico">' + icon('bell', 16) + '</span><span class="bell-say">Notify me</span></button>');
    const ico = el.querySelector('.bell-ico');
    const say = el.querySelector('.bell-say');
    let on = false;
    el.addEventListener('click', () => {
      on = !on;
      el.toggleAttribute('data-on', on);
      say.textContent = on ? 'You’ll be notified' : 'Notify me';
      if (on) {
        ico.animate([
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(-17deg)', offset: 0.11 },
          { transform: 'rotate(14deg)', offset: 0.27 },
          { transform: 'rotate(-9deg)', offset: 0.44 },
          { transform: 'rotate(6deg)', offset: 0.61 },
          { transform: 'rotate(-3deg)', offset: 0.78 },
          { transform: 'rotate(0deg)' }
        ], { duration: 820, easing: 'ease-out' });
      }
    });
    root.appendChild(el);
  }

  function mountDock(root) {
    const names = ['home', 'search', 'folder', 'bookmark', 'user'];
    const bar = $('<div class="gdock"></div>');
    const items = names.map((n) => {
      const b = $('<button class="gdock-item" type="button">' + icon(n, 16) + '</button>');
      bar.appendChild(b);
      return b;
    });
    bar.addEventListener('pointermove', (e) => {
      const r = bar.getBoundingClientRect();
      items.forEach((b) => {
        const br = b.getBoundingClientRect();
        const d = Math.abs(e.clientX - (br.left + br.width / 2));
        const mag = mix(1, 1.32, Math.max(0, 1 - d / 64));
        const lift = mix(0, -8, Math.max(0, 1 - d / 64));
        b.style.transform = 'translateY(' + lift + 'px) scale(' + mag + ')';
      });
    });
    bar.addEventListener('pointerleave', () => items.forEach((b) => { b.style.transform = ''; }));
    root.appendChild(bar);
  }

  function mountHumidity(root) {
    const el = $('<div class="hwheel" tabindex="0"><svg viewBox="0 0 200 200"></svg><div class="hwheel-readout"><span class="hum-figure">62</span><span class="hum-unit">%</span></div></div>');
    const svg = el.querySelector('svg');
    let v = 62;
    function draw() {
      const cx = 100, cy = 100, N = 60;
      let s = '';
      for (let i = 0; i < N; i++) {
        const t = i / N;
        const a = mix(-Math.PI * 0.75, Math.PI * 0.75, t) - Math.PI / 2;
        const on = t <= v / 100;
        const x1 = cx + 58 * Math.cos(a), y1 = cy + 58 * Math.sin(a);
        const x2 = cx + 78 * Math.cos(a), y2 = cy + 78 * Math.sin(a);
        s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (on ? '#4ade80' : '#cfcfc8') + '" stroke-width="2.5" stroke-linecap="round"/>';
      }
      svg.innerHTML = s;
      el.querySelector('.hum-figure').textContent = String(Math.round(v));
    }
    el.addEventListener('pointerdown', (e) => { el.setPointerCapture(e.pointerId); move(e); });
    el.addEventListener('pointermove', (e) => { if (el.hasPointerCapture(e.pointerId)) move(e); });
    function move(e) {
      const b = svg.getBoundingClientRect();
      const x = e.clientX - b.left - b.width / 2, y = e.clientY - b.top - b.height / 2;
      let t = (Math.atan2(y, x) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
      t = (t - Math.PI * 0.25) / (Math.PI * 1.5);
      v = clamp(t * 100, 0, 100);
      draw();
    }
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = clamp(v + 2, 0, 100);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = clamp(v - 2, 0, 100);
      draw();
    });
    draw();
    root.appendChild(el);
  }

  function mountRoster(root) {
    const wrap = $('<div class="rst"><div class="rst-box"></div><button class="rst-cta" type="button" disabled>Requests sent</button></div>');
    const box = wrap.querySelector('.rst-box');
    const cta = wrap.querySelector('.rst-cta');
    const picked = new Set();
    RST.forEach((p) => {
      const row = $('<button class="rst-row" type="button"><span></span><span class="pik-name">' + p.name + '<small>' + p.handle + '</small></span><span class="pik-tick"></span></button>');
      row.querySelector('span').replaceWith(face(p.name, p.tint, 32));
      row.addEventListener('click', () => {
        if (picked.has(p.id)) picked.delete(p.id); else picked.add(p.id);
        row.toggleAttribute('data-on', picked.has(p.id));
        cta.disabled = picked.size === 0;
        cta.textContent = picked.size ? 'Send ' + picked.size + ' request' + (picked.size > 1 ? 's' : '') : 'Requests sent';
        cta.style.opacity = '1';
      });
      box.appendChild(row);
    });
    root.appendChild(wrap);
  }

  const MOUNTS = {
    'magnet-select': mountMagnet,
    seek: mountSeek,
    escape: mountEscape,
    'liq-create': mountCreate,
    radial: mountRadial,
    sound: mountSound,
    'icon-bar': mountIconBar,
    progress: mountProgress,
    command: mountCommand,
    'liq-toggle': mountToggle,
    checklist: mountChecklist,
    picker: mountPicker,
    aspect: mountAspect,
    toolbar: mountToolbar,
    tilt: mountTilt,
    confirm: mountConfirm,
    pull: mountPull,
    'liq-arrange': mountArrange,
    sleep: mountSleep,
    'drag-ball': mountBall,
    'slide-confirm': mountSlide,
    carousel: mountCarousel,
    slosh: mountSlosh,
    palette: mountPalette,
    stepper: mountStepper,
    toasts: mountToasts,
    dock: mountDock,
    humidity: mountHumidity,
    roster: mountRoster
  };

  const ORDER = [
    { id: 'magnet-select', name: 'Magnetic select' },
    { id: 'checklist', name: 'Checklist' },
    { id: 'drag-ball', name: 'Dragging ball' },
    { id: 'seek', name: 'Search' },
    { id: 'picker', name: 'Assignees' },
    { id: 'slide-confirm', name: 'Slide to confirm' },
    { id: 'escape', name: 'Escape button' },
    { id: 'aspect', name: 'Aspect ratio' },
    { id: 'carousel', name: 'Carousel' },
    { id: 'liq-create', name: 'Create menu' },
    { id: 'toolbar', name: 'Canvas toolbar' },
    { id: 'slosh', name: 'Slosh slider' },
    { id: 'radial', name: 'Radial menu' },
    { id: 'tilt', name: 'Tilt card' },
    { id: 'palette', name: 'Palette' },
    { id: 'sound', name: 'Now playing' },
    { id: 'confirm', name: 'Inline confirm' },
    { id: 'stepper', name: 'Drag stepper' },
    { id: 'toasts', name: 'Notify' },
    { id: 'icon-bar', name: 'Icon bar' },
    { id: 'pull', name: 'Pull to refresh' },
    { id: 'dock', name: 'Magnifying dock' },
    { id: 'progress', name: 'Progress ticks' },
    { id: 'liq-arrange', name: 'Reorder list' },
    { id: 'humidity', name: 'Wheel' },
    { id: 'command', name: 'Command bar' },
    { id: 'liq-toggle', name: 'Liquid toggle' },
    { id: 'sleep', name: 'Range dial' },
    { id: 'roster', name: 'Selection list' }
  ];

  function mountAll(grid) {
    grid.innerHTML = '';
    ORDER.forEach((item) => {
      const art = $('<article class="block" id="' + item.id + '" data-id="' + item.id + '"><div class="stage"></div><span class="cap">' + item.name + '</span></article>');
      grid.appendChild(art);
      const fn = MOUNTS[item.id];
      if (fn) fn(art.querySelector('.stage'));
    });
  }

  global.BenchoBlocks = { mountAll, ORDER, MOUNTS };
})(window);
