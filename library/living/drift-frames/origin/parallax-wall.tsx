import { useEffect, useRef } from "react";
import { useLocale } from "@/components/home/locale";

const ROWS = [
  { tilt: "-7deg", k: "0.22", top: "6%" },
  { tilt: "4deg", k: "-0.16", top: "38%" },
  { tilt: "-3deg", k: "0.28", top: "68%" },
];

export function ParallaxWall() {
  const { t } = useLocale();
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let current = 0;
    let target = 0;
    let frame = 0;

    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.15) current = target;
      wall.style.setProperty("--scroll", current.toFixed(2));
      frame = current === target ? 0 : window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const rect = wall.getBoundingClientRect();
      target = window.innerHeight * 0.45 - (rect.top + rect.height * 0.5);
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const cards = t.wallpapers;

  return (
    <div className="cl-wall" ref={wallRef} aria-hidden="true">
      {ROWS.map((row, rowIndex) => (
        <div
          key={row.top}
          className="cl-wall-row"
          style={{ ["--tilt" as string]: row.tilt, ["--k" as string]: row.k, top: row.top }}
        >
          {[0, 1].flatMap((copy) =>
            cards.map((card) => (
              <figure key={`${copy}-${rowIndex}-${card.id}`} className="cl-frame">
                <img src={`/wallpapers/${card.id}.jpg`} alt="" />
                <figcaption>
                  <strong>{card.label}</strong>
                  <span>{card.note}</span>
                </figcaption>
              </figure>
            )),
          )}
        </div>
      ))}
      <div className="cl-wall-fade" />
    </div>
  );
}
