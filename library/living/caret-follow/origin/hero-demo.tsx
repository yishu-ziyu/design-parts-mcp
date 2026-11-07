import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useLocale } from "@/components/home/locale";

type Phase = "page" | "open" | "results";

export function HeroDemo() {
  const { t, lang } = useLocale();
  const frameRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const kbdRef = useRef<HTMLButtonElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [phase, setPhase] = useState<Phase>("page");
  const [typed, setTyped] = useState("");
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("results");
      setTyped(t.heroQuery);
      setActive(0);
      return;
    }

    const ac = new AbortController();
    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(resolve, ms);
        ac.signal.addEventListener("abort", () => {
          window.clearTimeout(timer);
          reject(new DOMException("aborted", "AbortError"));
        });
      });

    (async () => {
      try {
        while (!ac.signal.aborted) {
          setPhase("page");
          setTyped("");
          setActive(0);
          await sleep(900);
          setPhase("open");
          await sleep(420);
          const word = t.heroQuery;
          for (let i = 1; i <= word.length; i++) {
            setTyped(word.slice(0, i));
            await sleep(150);
          }
          await sleep(220);
          setPhase("results");
          await sleep(520);
          setActive(1);
          await sleep(640);
          setActive(0);
          await sleep(1500);
        }
      } catch {
        /* replay or unmount */
      }
    })();

    return () => ac.abort();
  }, [lang, run, t.heroQuery]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const pointer = pointerRef.current;
    if (!frame || !pointer) return;
    const target =
      phase === "page" ? kbdRef.current : phase === "results" ? rowRefs.current[active] : caretRef.current;
    if (!target) return;
    const frameBox = frame.getBoundingClientRect();
    const box = target.getBoundingClientRect();
    const x = box.left - frameBox.left + (phase === "results" ? 18 : box.width + (phase === "page" ? 8 : 2));
    const y = box.top - frameBox.top + (phase === "page" ? box.height * 0.35 : 10);
    pointer.style.transform = `translate(${x}px, ${y}px)`;
  }, [phase, typed, active, lang]);

  const open = phase !== "page";

  return (
    <div className="cl-browser" ref={frameRef} data-phase={phase}>
      <div className="cl-chrome">
        <span className="cl-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="cl-url">{t.pageTitle}</span>
      </div>
      <div className="cl-page cl-page-art">
        <img src="/wallpapers/cliff.jpg" alt="" />
        <button ref={kbdRef} className="cl-kbd" type="button" tabIndex={-1}>
          {t.shortcut}
          <span>{t.summon}</span>
        </button>
      </div>
      <div className="cl-hero-palette" data-open={open ? "true" : "false"} data-phase={phase}>
        <div className="cl-hero-field">
          <span className="cl-hero-typed">
            {typed}
            <span ref={caretRef} className="cl-caret" />
          </span>
          {typed.length === 0 ? <span className="cl-ghost">{t.placeholder.search}</span> : null}
        </div>
        <div className="cl-hero-list">
          {t.heroRows.map((row, index) => (
            <div
              key={row.url}
              ref={(node) => {
                rowRefs.current[index] = node;
              }}
              className={index === active ? "cl-hero-row is-active" : "cl-hero-row"}
            >
              <span>{t.kind[row.kind]}</span>
              <strong>{row.title}</strong>
              <em>{row.url}</em>
            </div>
          ))}
        </div>
      </div>
      <div ref={pointerRef} className="cl-pointer" data-phase={phase} aria-hidden="true">
        <svg viewBox="0 0 18 18" width="18" height="18">
          <path d="M3 2.2 14.2 8.4 8.8 9.6 7.2 15.2Z" fill="var(--color-ink)" stroke="var(--color-paper)" strokeWidth="1.2" />
        </svg>
      </div>
      <button className="cl-replay" type="button" onClick={() => setRun((n) => n + 1)}>
        <RotateCcw size={16} strokeWidth={2} />
        {t.replay}
      </button>
    </div>
  );
}
