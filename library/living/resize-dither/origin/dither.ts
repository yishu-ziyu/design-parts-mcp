import type { FilterId } from "@/components/home/content";

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

function quantize(value: number, levels: number) {
  const clamped = Math.max(0, Math.min(255, value));
  const step = 255 / (levels - 1);
  return Math.round(Math.round(clamped / step) * step);
}

export function paintScene(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
  filter: FilterId,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.filter = filter === "soft" ? "blur(1.2px) saturate(0.82) contrast(0.95)" : "none";
  ctx.drawImage(image, 0, 0, width, height);
  ctx.filter = "none";

  if (filter === "plain" || filter === "soft") return;

  if (filter === "warm" || filter === "cool") {
    ctx.fillStyle = filter === "warm" ? "rgba(176, 122, 78, 0.2)" : "rgba(78, 118, 140, 0.22)";
    ctx.fillRect(0, 0, width, height);
    return;
  }

  const snap = ctx.getImageData(0, 0, width, height);
  const src = snap.data;
  const out = new Uint8ClampedArray(src);
  const cell = filter === "coarse" ? 6 : filter === "ink" ? 3 : 2;
  const levels = filter === "ink" || filter === "coarse" ? 2 : 4;
  const amp = filter === "coarse" ? 90 : filter === "ink" ? 70 : 42;

  for (let by = 0; by < height; by += cell) {
    for (let bx = 0; bx < width; bx += cell) {
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      const yMax = Math.min(height, by + cell);
      const xMax = Math.min(width, bx + cell);
      for (let y = by; y < yMax; y++) {
        for (let x = bx; x < xMax; x++) {
          const i = (y * width + x) * 4;
          r += src[i];
          g += src[i + 1];
          b += src[i + 2];
          n++;
        }
      }
      r /= n;
      g /= n;
      b /= n;
      if (filter === "night") {
        r *= 0.42;
        g *= 0.48;
        b *= 0.6;
      }
      const threshold = (BAYER[Math.floor(by / cell) % 4][Math.floor(bx / cell) % 4] / 16 - 0.5) * amp;
      const lum = r * 0.299 + g * 0.587 + b * 0.114;
      const qr = quantize((filter === "ink" ? lum : r) + threshold, levels);
      const qg = quantize((filter === "ink" ? lum : g) + threshold, levels);
      const qb = quantize((filter === "ink" ? lum : b) + threshold, levels);
      for (let y = by; y < yMax; y++) {
        for (let x = bx; x < xMax; x++) {
          const i = (y * width + x) * 4;
          out[i] = qr;
          out[i + 1] = qg;
          out[i + 2] = qb;
          out[i + 3] = 255;
        }
      }
    }
  }

  snap.data.set(out);
  ctx.putImageData(snap, 0, 0);
}
