import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AppWindow, BookMarked, CornerDownLeft, History, X } from "lucide-react";
import { matchesQuery, type Engine, type Kind, type LibraryItem } from "@/components/home/content";
import { useLocale } from "@/components/home/locale";

type Mode = "search" | "site" | "model";

const kindIcon = {
  tab: AppWindow,
  bookmark: BookMarked,
  history: History,
} as const;

function inSite(item: LibraryItem, id: string) {
  if (id === "ce") return item.url.startsWith("ce.");
  if (id === "shan") return item.id === "shanhai";
  if (id === "wen") return item.url.startsWith("wen.");
  return true;
}

export function CommandBar() {
  const { t, lang } = useLocale();
  const [mode, setMode] = useState<Mode>("search");
  const [query, setQuery] = useState("");
  const [siteId, setSiteId] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<LibraryItem | Engine | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const site = t.sites.find((item) => item.id === siteId) ?? null;

  const results = useMemo(() => {
    if (mode === "model") {
      return t.engines.filter((engine) =>
        matchesQuery({ title: `${engine.name} ${engine.blurb}`, keys: [engine.name, engine.id] }, query),
      );
    }
    return t.items.filter((item) => {
      if (mode === "site" && site && !inSite(item, site.id)) return false;
      return matchesQuery(item, query);
    });
  }, [mode, query, site, t.engines, t.items]);

  useEffect(() => {
    setActive(0);
    setOpened(null);
  }, [query, mode, siteId, lang]);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const current = track?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!track || !current) return;
      setIndicator({ x: current.offsetLeft, w: current.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mode, lang]);

  function lockSite(raw: string) {
    const needle = raw.trim().toLowerCase();
    const found = t.sites.find((item) => item.keys.some((key) => key.toLowerCase() === needle));
    if (!found) return false;
    setSiteId(found.id);
    setMode("site");
    setQuery("");
    return true;
  }

  function applyExample(id: string) {
    setOpened(null);
    if (id === "tide") {
      setMode("search");
      setSiteId(null);
      setQuery(lang === "zh" ? "潮汐" : "tide");
    } else if (id === "note") {
      setMode("search");
      setSiteId(null);
      setQuery(lang === "zh" ? "山海" : "shan");
    } else if (id === "initial") {
      setMode("search");
      setSiteId(null);
      setQuery("cx");
    } else {
      setMode("site");
      setSiteId("ce");
      setQuery(lang === "zh" ? "潮汐" : "tide");
    }
    inputRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(results.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Tab" && mode !== "model") {
      if (lockSite(query)) event.preventDefault();
    } else if (event.key === "Enter") {
      event.preventDefault();
      const picked = results[active];
      if (picked) setOpened(picked);
    } else if (event.key === "Escape") {
      setOpened(null);
    }
  }

  const prompt = query.trim() || t.samplePrompt;

  return (
    <div className="cl-command" id="command-panel">
      <div className="cl-tabs" ref={trackRef} role="tablist" aria-label={t.commandTitle}>
        <span className="cl-tab-indicator" style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }} />
        {t.modes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            className="cl-tab"
            onClick={() => {
              setMode(item.id);
              if (item.id !== "site") setSiteId(null);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="cl-palette">
        <div className="cl-field">
          {site && mode === "site" ? (
            <button type="button" className="cl-site-chip" onClick={() => setSiteId(null)}>
              {t.siteLocked} {site.name}
              <X size={14} strokeWidth={2} />
              <span className="cl-sr">{t.clearSite}</span>
            </button>
          ) : null}
          <input
            id="command-input"
            ref={inputRef}
            value={query}
            placeholder={t.placeholder[mode]}
            aria-label={t.placeholder[mode]}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
          />
          <CornerDownLeft size={16} strokeWidth={2} aria-hidden="true" />
        </div>

        {opened ? (
          <div className="cl-opened">
            {"kind" in opened ? (
              <>
                <p className="cl-kicker">{t.willOpen}</p>
                <strong>{opened.title}</strong>
                <em>{opened.url}</em>
              </>
            ) : (
              <>
                <p className="cl-kicker">
                  {t.willAsk} {opened.name}
                </p>
                <strong>{prompt}</strong>
                <em>{opened.blurb}</em>
              </>
            )}
            <button type="button" className="cl-btn cl-btn-ghost" onClick={() => setOpened(null)}>
              {t.back}
            </button>
          </div>
        ) : results.length === 0 ? (
          <p className="cl-empty">{mode === "model" ? t.noEngine : t.empty}</p>
        ) : (
          <ul className="cl-results" role="listbox" aria-label={t.commandTitle}>
            {results.map((item, index) => {
              const isEngine = !("kind" in item);
              const Icon = isEngine ? null : kindIcon[(item as LibraryItem).kind as Kind];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    className={index === active ? "cl-result is-active" : "cl-result"}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => setOpened(item)}
                  >
                    <span className="cl-result-kind">
                      {Icon ? <Icon size={16} strokeWidth={2} /> : null}
                      {isEngine ? item.name.slice(0, 1) : t.kind[(item as LibraryItem).kind]}
                    </span>
                    <span className="cl-result-copy">
                      <strong>{isEngine ? item.name : (item as LibraryItem).title}</strong>
                      <em>{isEngine ? (item as Engine).blurb : (item as LibraryItem).url}</em>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="cl-examples">
        <span>{t.hint}</span>
        {t.examples.map((example) => (
          <button key={example.id} type="button" className="cl-chip" onClick={() => applyExample(example.id)}>
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
