const mounted = new WeakMap();
let nextId = 0;

export function mountDragPanel(root, options = {}) {
  const view = root?.ownerDocument?.defaultView;
  if (!view || !(root instanceof view.HTMLElement)) throw new TypeError("Expected a panel container element.");
  if (mounted.has(root)) throw new Error("This container already has a drag panel. Destroy it before mounting again.");
  const panel = root.querySelector("[data-dp-panel]");
  const handle = root.querySelector("[data-dp-handle]");
  const content = root.querySelector("[data-dp-content]");
  if (!panel || !(handle instanceof view.HTMLButtonElement) || !content || !panel.contains(handle) || !panel.contains(content)) {
    throw new Error("Provide a panel, a button handle and a content element inside the container.");
  }
  let config = { collapsedHeight: 104, initial: "collapsed", reducedMotion: "system", onStateChange: null, ...options };
  function validate(value) {
    if (!Number.isFinite(value.collapsedHeight) || value.collapsedHeight < 44) throw new RangeError("collapsedHeight must be at least 44 pixels.");
    if (!["expanded", "collapsed"].includes(value.initial)) throw new TypeError("initial must be expanded or collapsed.");
    if (![true, false, "system"].includes(value.reducedMotion)) throw new TypeError("reducedMotion must be true, false or system.");
    if (value.onStateChange !== null && typeof value.onStateChange !== "function") throw new TypeError("onStateChange must be a function or null.");
  }
  validate(config);
  const attrs = new Map();
  function remember(element, names) {
    attrs.set(element, new Map(names.map(name => [name, element.getAttribute(name)])));
  }
  remember(root, ["data-dp-state"]);
  remember(panel, ["style"]);
  remember(handle, ["aria-expanded", "aria-controls"]);
  remember(content, ["inert", "id"]);
  const originalTransform = panel.style.getPropertyValue("transform");
  const originalPriority = panel.style.getPropertyPriority("transform");
  const hadStyle = panel.hasAttribute("style");
  if (!content.id) {
    do { content.id = `dp-content-${++nextId}`; } while (root.ownerDocument.querySelectorAll(`[id="${content.id}"]`).length > 1);
  }
  handle.setAttribute("aria-controls", content.id);
  const events = new view.AbortController();
  const media = view.matchMedia("(prefers-reduced-motion: reduce)");
  let expanded = config.initial === "expanded";
  let position = 0;
  let velocity = 0;
  let range = 0;
  let frame = 0;
  let lastTime = 0;
  let drag = null;
  let destroyed = false;
  let ignoreClick = false;
  let clickTimer = 0;
  let phase = config.initial;
  const reduced = () => config.reducedMotion === "system" ? media.matches : config.reducedMotion;
  const destination = () => expanded ? 0 : range;
  const draw = () => { panel.style.transform = `translateY(${position}px)`; };
  function state() {
    return { state: phase, expanded, position, travel: range, animating: Boolean(frame), destroyed };
  }
  function announce(next) {
    phase = next;
    root.dataset.dpState = next;
    handle.setAttribute("aria-expanded", String(expanded));
    const detail = state();
    root.dispatchEvent(new view.CustomEvent("dp:change", { detail }));
    config.onStateChange?.(detail);
  }
  function access() {
    if (!expanded && content.contains(root.ownerDocument.activeElement)) handle.focus({ preventScroll: true });
    content.inert = !expanded;
  }
  function stop() {
    if (frame) view.cancelAnimationFrame(frame);
    frame = 0;
  }
  function tick(time) {
    if (destroyed) return;
    const dt = Math.min((time - lastTime) / 1000, 0.025);
    lastTime = time;
    velocity += (-490 * (position - destination()) - 42 * velocity) * dt;
    position += velocity * dt;
    if (Math.abs(position - destination()) < 0.15 && Math.abs(velocity) < 1) {
      position = destination();
      velocity = 0;
      frame = 0;
      draw();
      announce(expanded ? "expanded" : "collapsed");
    } else {
      draw();
      frame = view.requestAnimationFrame(tick);
    }
  }
  function endCapture() {
    const id = drag?.id;
    drag = null;
    if (id !== undefined && handle.hasPointerCapture(id)) handle.releasePointerCapture(id);
  }
  function go(open, animate = true) {
    if (destroyed) return;
    endCapture();
    expanded = open;
    access();
    if (!animate || reduced() || range === 0) {
      stop();
      velocity = 0;
      position = destination();
      draw();
      announce(expanded ? "expanded" : "collapsed");
      return;
    }
    if (!frame) {
      lastTime = view.performance.now();
      frame = view.requestAnimationFrame(tick);
    }
    announce("settling");
  }
  function measure() {
    const next = Math.max(0, panel.offsetHeight - Math.max(config.collapsedHeight, handle.offsetHeight));
    if (next === range) return;
    range = next;
    endCapture();
    stop();
    velocity = 0;
    position = destination();
    draw();
    announce(expanded ? "expanded" : "collapsed");
  }
  function cancelDrag() {
    if (!drag || destroyed) return;
    velocity = 0;
    go(position <= range / 2);
  }
  const listen = (element, name, callback) => element.addEventListener(name, callback, { signal: events.signal });
  listen(handle, "pointerdown", event => {
    if (event.button !== 0 || !event.isPrimary || drag) return;
    stop();
    velocity = 0;
    ignoreClick = false;
    view.clearTimeout(clickTimer);
    drag = { id: event.pointerId, start: event.clientY, origin: position, last: event.clientY, time: event.timeStamp, moved: false };
    handle.setPointerCapture(event.pointerId);
    announce("dragging");
  });
  listen(handle, "pointermove", event => {
    if (!drag || event.pointerId !== drag.id) return;
    const delta = event.clientY - drag.start;
    const raw = drag.origin + delta;
    const rubberBand = value => value * 200 * 0.55 / (200 + 0.55 * Math.abs(value));
    position = raw < 0 ? rubberBand(raw) : raw > range ? range + rubberBand(raw - range) : raw;
    const dt = event.timeStamp - drag.time;
    if (dt > 0) velocity = (event.clientY - drag.last) / dt * 1000;
    drag.moved ||= Math.abs(delta) > 4;
    drag.last = event.clientY;
    drag.time = event.timeStamp;
    draw();
  });
  listen(handle, "pointerup", event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (!drag.moved) {
      velocity = 0;
      endCapture();
      announce(expanded ? "expanded" : "collapsed");
      return;
    }
    if (event.timeStamp - drag.time > 100) velocity = 0;
    ignoreClick = true;
    clickTimer = view.setTimeout(() => { ignoreClick = false; }, 0);
    const projected = position + velocity * 0.998 / 1000 / (1 - 0.998);
    go(projected <= range / 2);
  });
  listen(handle, "pointercancel", cancelDrag);
  listen(handle, "lostpointercapture", cancelDrag);
  listen(handle, "click", event => {
    if (ignoreClick) {
      ignoreClick = false;
      return;
    }
    go(!expanded, event.detail !== 0);
  });
  listen(handle, "keydown", event => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    go(event.key === "ArrowUp" || event.key === "Home", false);
  });
  listen(root, "click", event => {
    const button = event.target.closest?.("[data-dp-open], [data-dp-close]");
    if (!button || !root.contains(button) || button.closest(".dp-root") !== root) return;
    go(button.hasAttribute("data-dp-open"), event.detail !== 0);
  });
  listen(root, "keydown", event => {
    if (event.key === "Escape" && expanded && (content.contains(event.target) || event.target === handle)) {
      event.preventDefault();
      go(false, false);
    }
  });
  const preferenceChanged = () => { if (!drag && reduced()) go(expanded, false); };
  media.addEventListener("change", preferenceChanged);
  const resize = new view.ResizeObserver(measure);
  const api = {
    open: () => go(true),
    close: () => go(false),
    toggle: () => go(!expanded),
    getState: state,
    update(next) {
      if (destroyed) return;
      const updated = { ...config, ...next };
      validate(updated);
      config = updated;
      measure();
      preferenceChanged();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stop();
      endCapture();
      view.clearTimeout(clickTimer);
      events.abort();
      resize.disconnect();
      media.removeEventListener("change", preferenceChanged);
      for (const [element, names] of attrs) {
        if (element === panel) continue;
        for (const [name, value] of names) value === null ? element.removeAttribute(name) : element.setAttribute(name, value);
      }
      originalTransform ? panel.style.setProperty("transform", originalTransform, originalPriority) : panel.style.removeProperty("transform");
      if (!hadStyle && !panel.getAttribute("style")) panel.removeAttribute("style");
      mounted.delete(root);
    },
  };
  mounted.set(root, api);
  range = Math.max(0, panel.offsetHeight - Math.max(config.collapsedHeight, handle.offsetHeight));
  position = destination();
  access();
  draw();
  root.dataset.dpState = phase;
  handle.setAttribute("aria-expanded", String(expanded));
  resize.observe(root);
  resize.observe(panel);
  announce(phase);
  return api;
}
