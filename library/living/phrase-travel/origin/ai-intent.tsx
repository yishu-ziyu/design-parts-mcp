import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/home/locale";

type Phase = "idle" | "open" | "fold" | "travel" | "done";

export function AiIntent() {
  const { t, lang } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const run = useRef(0);

  useEffect(() => {
    run.current += 1;
    setPhase("idle");
    setCopied(false);
  }, [lang]);

  function placeBar() {
    const stage = stageRef.current;
    const phrase = document.getElementById("intent-phrase");
    if (!stage || !phrase) return;
    const stageBox = stage.getBoundingClientRect();
    const phraseBox = phrase.getBoundingClientRect();
    setPos({
      x: Math.max(8, phraseBox.left - stageBox.left),
      y: Math.max(8, phraseBox.top - stageBox.top - 56),
    });
  }

  function selectPhrase() {
    placeBar();
    setPhase("open");
  }

  function onMouseUp() {
    const selection = window.getSelection();
    const phrase = document.getElementById("intent-phrase");
    if (!selection || selection.isCollapsed || !phrase) return;
    if (selection.containsNode(phrase, true)) selectPhrase();
  }

  async function ask() {
    if (phase !== "open") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mine = ++run.current;
    if (reduce) {
      setPhase("done");
      return;
    }
    setPhase("fold");
    await wait(280);
    if (mine !== run.current) return;
    const bar = barRef.current;
    const dest = destRef.current;
    if (bar && dest) {
      const from = bar.getBoundingClientRect();
      const to = dest.getBoundingClientRect();
      setDelta({ x: to.left - from.left + 16, y: to.top - from.top + 18 });
    }
    setPhase("travel");
    await wait(620);
    if (mine !== run.current) return;
    setPhase("done");
  }

  async function copyPhrase() {
    try {
      await navigator.clipboard.writeText(t.phrase);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  const showBar = phase !== "idle" && phase !== "done";

  return (
    <div className="cl-intent" ref={stageRef}>
      <article className="cl-article" onMouseUp={onMouseUp}>
        <p>
          {t.articleBefore}
          <span id="intent-phrase" className={phase === "idle" ? "" : "is-sel"}>
            {t.phrase}
          </span>
          {t.articleAfter}
        </p>
        <button type="button" className="cl-btn cl-btn-ghost" onClick={selectPhrase}>
          {t.select}
        </button>
      </article>

      {showBar ? (
        <div
          ref={barRef}
          className="cl-toolbar"
          data-phase={phase}
          style={{
            left: pos.x,
            top: pos.y,
            transform: phase === "travel" ? `translate(${delta.x}px, ${delta.y}px)` : undefined,
          }}
        >
          <button type="button" className="cl-tool" onClick={ask}>
            {phase === "open" ? t.ask : t.sent}
          </button>
          <button type="button" className="cl-tool extra" onClick={copyPhrase}>
            {copied ? "OK" : t.copy}
          </button>
          <button type="button" className="cl-tool extra" onClick={() => { run.current += 1; setPhase("idle"); }}>
            {t.dismiss}
          </button>
        </div>
      ) : null}

      <div className={phase === "done" ? "cl-dest is-done" : "cl-dest"} ref={destRef}>
        <span>{t.destLabel}</span>
        <strong>{phase === "done" ? t.phrase : t.destIdle}</strong>
        <em>{phase === "done" ? t.destDone : t.intentLead}</em>
        {phase === "done" ? (
          <button type="button" className="cl-btn cl-btn-ghost" onClick={() => { run.current += 1; setPhase("idle"); }}>
            {t.again}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
