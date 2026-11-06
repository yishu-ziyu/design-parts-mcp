import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = fs.realpathSync(path.resolve(process.env.PREVIEW_ROOT || path.join(import.meta.dirname, "..", "distribution")));
const port = Number(process.env.PORT || 4179);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".md": "text/plain; charset=utf-8" };
const server = http.createServer((req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) return res.writeHead(405).end("Read-only preview.");
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    let file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}/`)) return res.writeHead(403).end("Forbidden");
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) return res.writeHead(404).end("Not found");
    file = fs.realpathSync(file);
    if (!file.startsWith(`${root}/`) || !fs.statSync(file).isFile()) return res.writeHead(403).end("Forbidden");
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(file).on("error", () => res.destroy()).pipe(res);
  } catch (error) {
    console.error(`Preview request failed: ${error.message}`);
    if (!res.headersSent) res.writeHead(400).end("Invalid request");
  }
});
server.on("error", error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, "127.0.0.1", () => console.log(`Local preview: http://127.0.0.1:${port}`));
