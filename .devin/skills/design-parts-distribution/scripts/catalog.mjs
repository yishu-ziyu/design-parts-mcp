import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const [command, address, ...args] = process.argv.slice(2);

try {
  if (!["list", "search", "show", "plan", "verify"].includes(command) || !address) {
    throw new Error("Usage: catalog.mjs list|search|show|plan|verify <catalog-url> [query or name] [project-directory]");
  }
  const url = new URL(address);
  if (url.username || url.password || !["https:", "http:"].includes(url.protocol)) throw new Error("Use an HTTP(S) catalog URL without embedded credentials.");
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: "error" });
  if (!response.ok) throw new Error(`Catalog returned HTTP ${response.status}.`);
  const catalog = await response.json();
  if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.items)) throw new Error("Unsupported catalog format.");
  const names = new Set();
  for (const item of catalog.items) {
    if (!/^[a-z][a-z0-9-]*$/.test(item.name) || names.has(item.name)) throw new Error("Invalid or duplicate catalog name.");
    names.add(item.name);
  }
  const inspection = command === "plan" || command === "verify";
  const query = (inspection ? args[0] || "" : args.join(" ")).trim().toLowerCase();
  if (command !== "list" && !query) throw new Error(`${command} requires a query or name.`);
  const results = catalog.items.filter(item => {
    if (command === "show" || inspection) return item.name === query;
    if (command === "list") return true;
    const text = JSON.stringify([item.name, item.title, item.description, item.keywords]).toLowerCase();
    return query.split(/\s+/).some(word => text.includes(word)) || (item.keywords || []).some(word => query.includes(word.toLowerCase()));
  }).map(item => {
    const registryUrl = new URL(item.registryPath, url);
    const exampleUrl = new URL(item.examplePath, url);
    if (registryUrl.origin !== url.origin || exampleUrl.origin !== url.origin || registryUrl.username || registryUrl.password || exampleUrl.username || exampleUrl.password) throw new Error("Catalog file links must stay on the catalog origin without credentials.");
    const summary = { name: item.name, title: item.title, description: item.description, version: item.version, framework: item.framework, status: item.status, registryUrl: registryUrl.href, exampleUrl: exampleUrl.href };
    return command === "show" ? { ...item, ...summary } : summary;
  });
  if (inspection && results.length) {
    const project = fs.realpathSync(path.resolve(args[1] || process.cwd()));
    const payload = await fetch(results[0].registryUrl, { signal: AbortSignal.timeout(15000), redirect: "error" });
    if (!payload.ok) throw new Error(`Package returned HTTP ${payload.status}.`);
    const item = await payload.json();
    const metadata = catalog.items.find(part => part.name === query);
    if (!Array.isArray(metadata.files) || !metadata.files.length || new Set(metadata.files).size !== metadata.files.length || metadata.files.some(file => !/^(?:[a-z0-9][a-z0-9-]*\.(?:js|css|html|md)|LICENSE)$/.test(file)) || !metadata.files.includes("LICENSE") || !metadata.files.includes(metadata.entry) || !metadata.files.includes(metadata.example)) throw new Error("Invalid catalog file manifest.");
    if (!metadata.integrity || Object.keys(metadata.integrity).length !== metadata.files.length || metadata.files.some(file => !/^[a-f0-9]{64}$/.test(metadata.integrity[file])) || !/^[a-f0-9]{64}$/.test(metadata.revision)) throw new Error("Invalid catalog checksums.");
    const allowed = new Set([...metadata.files, "metadata.json"]);
    if (item.name !== metadata.name || item.type !== "registry:item" || item.meta?.version !== metadata.version || item.meta?.revision !== metadata.revision || !Array.isArray(item.files) || item.files.length !== allowed.size || [item.dependencies, item.registryDependencies].some(value => value !== undefined && (!Array.isArray(value) || value.length))) throw new Error("Unexpected package identity, files or dependencies.");
    const seen = new Set();
    const changes = item.files.map(file => {
      const prefix = `~/design-parts/${metadata.name}/`;
      if (file.type !== "registry:file" || !file.target?.startsWith(prefix) || !allowed.has(file.target.slice(prefix.length)) || typeof file.content !== "string" || seen.has(file.target)) throw new Error("Unexpected package target.");
      seen.add(file.target);
      const filename = file.target.slice(prefix.length);
      if (file.path !== `${metadata.name}/${filename}`) throw new Error("Package path and target do not match.");
      const sha256 = createHash("sha256").update(file.content).digest("hex");
      if (filename !== "metadata.json" && sha256 !== metadata.integrity?.[filename]) throw new Error(`Catalog checksum mismatch: ${filename}`);
      if (filename === "metadata.json") {
        const packaged = JSON.parse(file.content);
        const { registryPath, examplePath, ...expected } = metadata;
        if (JSON.stringify(packaged) !== JSON.stringify(expected)) throw new Error("Package metadata does not match the catalog.");
      }
      const relative = file.target.slice(2);
      const target = path.join(project, relative);
      let current = project;
      for (const segment of relative.split("/")) {
        current = path.join(current, segment);
        try {
          if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Refusing symlink target: ${relative}`);
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
      }
      const exists = fs.existsSync(target);
      const previous = exists ? fs.readFileSync(target, "utf8") : null;
      return { path: relative, action: !exists ? "create" : previous === file.content ? "unchanged" : "conflict", sha256 };
    });
    const conflict = changes.some(file => file.action === "conflict");
    const verified = changes.every(file => file.action === "unchanged");
    console.log(JSON.stringify({ readOnly: true, installAllowed: !conflict, ...(command === "verify" ? { verified } : {}), changes }, null, 2));
    if (conflict || (command === "verify" && !verified)) process.exitCode = 2;
  } else {
    console.log(JSON.stringify({ total: results.length, results }, null, 2));
  }
  if (!results.length) process.exitCode = 3;
} catch (error) {
  console.error(JSON.stringify({ error: error.message }));
  process.exitCode = 1;
}
