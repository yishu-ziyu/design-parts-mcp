import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { FilterId } from "@/components/home/content";
import { paintScene } from "@/components/home/dither";
import { useLocale } from "@/components/home/locale";

const sources = {
  cliff: "/wallpapers/cliff.jpg",
  river: "/wallpapers/river.jpg",
  rain: "/wallpapers/rain.jpg",
  sea: "/wallpapers/sea.jpg",
  morning: "/wallpapers/morning.jpg",
  night: "/wallpapers/night.jpg",
} as const;

export function NewTab() {
  const { t, lang } = useLocale();
  const frameRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const frameUrl = useRef<string | null>(null);
  const [paper, setPaper] = useState<(typeof t.wallpapers)[number]["id"]>("cliff");
  const [filter, setFilter] = useState<FilterId>("plain");
  const [zen, setZen] = useState(false);
  const [query, setQuery] = useState("");
  const [clock, setClock] = useState("09:41");
  const [poem, setPoem] = useState(t.poem[0]);
  const [frame, setFrame] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString(lang === "zh" ? "zh-Hans" : "en", { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    const day = Math.floor(Date.now() / 86_400_000) % t.poem.length;
    setPoem(t.poem[day]);
    return () => window.clearInterval(id);
  }, [lang, t.poem]);

  useEffect(() => {
    const stage = frameRef.current;
    if (!stage) return;
    let dead = false;
    let request = 0;
    const image = new Image();
    image.src = sources[paper];
    const canvas = document.createElement("canvas");

    const draw = () => {
      if (dead || !image.complete || image.naturalWidth === 0) return;
      const rect = stage.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      paintScene(ctx, image, width, height, filter);
      const mine = ++request;
      canvas.toBlob((blob) => {
        if (!blob || dead || mine !== request) return;
        const url = URL.createObjectURL(blob);
        if (frameUrl.current) URL.revokeObjectURL(frameUrl.current);
        frameUrl.current = url;
        setFrame(url);
      }, "image/jpeg", 0.84);
    };

    setFrame(null);
    image.onload = draw;
    const observer = new ResizeObserver(() => draw());
    observer.observe(stage);
    return () => {
      dead = true;
      observer.disconnect();
    };
  }, [paper, filter]);

  useEffect(() => {
    return () => {
      if (frameUrl.current) URL.revokeObjectURL(frameUrl.current);
    };
  }, []);

  function onDockMove(event: PointerEvent<HTMLDivElement>) {
    const dock = dockRef.current;
    if (!dock) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (const child of dock.children) {
      if (!(child instanceof HTMLElement)) continue;
      const box = child.getBoundingClientRect();
      const distance = Math.abs(event.clientX - (box.left + box.width / 2));
      const scale = Math.max(1, 1.22 - distance / 220);
      child.style.transform = `translateY(${(1 - scale) * -16}px) scale(${scale})`;
    }
  }

  function resetDock() {
    const dock = dockRef.current;
    if (!dock) return;
    for (const child of dock.children) {
      if (child instanceof HTMLElement) child.style.transform = "";
    }
  }

  const night = paper === "night" || paper === "sea" || filter === "night" || filter === "ink";
  const needle = query.trim().toLowerCase();

  return (
    <div className="cl-newtab">
      <div className={night ? "cl-stage is-night" : "cl-stage"} ref={frameRef} data-zen={zen ? "true" : "false"}>
        <img src={sources[paper]} alt="" className="cl-nt-photo" />
        {frame ? <img src={frame} alt="" className="cl-nt-photo is-drawn" /> : null}
        <div className="cl-nt-copy">
          <div className="cl-nt-extra">
            <p className="cl-clock">{clock}</p>
            <p className="cl-poem">{poem}</p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchHere}
            aria-label={t.searchHere}
          />
        </div>
        <div
          className="cl-dock"
          ref={dockRef}
          onPointerMove={onDockMove}
          onPointerLeave={resetDock}
        >
          {t.dock.map((site) => {
            const dim = needle.length > 0 && !site.name.toLowerCase().includes(needle) && !site.hint.includes(needle);
            return (
              <button key={site.hint} type="button" className={dim ? "cl-dock-item is-dim" : "cl-dock-item"}>
                <span>{site.name.slice(0, 1)}</span>
                {site.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="cl-stage-controls">
        <div className="cl-papers">
          <span>{t.today}</span>
          {t.wallpapers.map((item) => (
            <button
              key={item.id}
              type="button"
              className="cl-paper"
              aria-pressed={paper === item.id}
              onClick={() => setPaper(item.id)}
            >
              <i style={{ backgroundImage: `url(${sources[item.id]})` }} />
              <span>{item.label}</span>
              <em>{item.note}</em>
            </button>
          ))}
        </div>
        <div className="cl-filters" role="group" aria-label={t.tabTitle}>
          {t.filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className="cl-filter"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button type="button" className="cl-btn cl-btn-ghost" aria-pressed={zen} onClick={() => setZen((value) => !value)}>
          {zen ? t.zenOn : t.zen}
        </button>
      </div>
    </div>
  );
}
