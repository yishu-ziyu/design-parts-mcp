import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const repo = path.resolve(import.meta.dirname, "..");
const output = path.join(repo, "distribution");
const sources = process.env.DESIGN_NOTES_PATH
  ? path.join(path.resolve(process.env.DESIGN_NOTES_PATH), "living")
  : path.join(output, "parts");
const generated = new Map();
const digest = value => createHash("sha256").update(value).digest("hex");
const write = (relative, content) => {
  if (generated.has(relative)) throw new Error(`Duplicate output: ${relative}`);
  assertPublic(content, relative);
  generated.set(relative, content);
};
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const read = (root, file) => {
  if (path.basename(file) !== file || file.startsWith(".")) throw new Error(`Invalid package file: ${file}`);
  const absolute = path.join(root, file);
  if (!fs.lstatSync(absolute).isFile()) throw new Error(`Only regular package files are allowed: ${file}`);
  return fs.readFileSync(absolute, "utf8");
};
const assertPublic = (text, name) => {
  if (/\/Users\/|C:\\Users\\|source-assets\/|_source\/|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/.test(text)) {
    throw new Error(`Distribution boundary check failed: ${name}`);
  }
};

try {
  const selection = JSON.parse(read(path.join(repo, ".devin"), "distribution.json"));
  const versionPattern = /^\d+\.\d+\.\d+$/;
  if (selection.schemaVersion !== 1 || selection.status !== "local-preview" || !versionPattern.test(selection.skillVersion) || !Array.isArray(selection.parts) || !selection.parts.length) throw new Error("Invalid distribution selection.");
  const names = new Set(["registry", "design-parts-skill"]);
  const packages = selection.parts.map(approved => {
    const { name, files: allowedFiles } = approved;
    if (!/^[a-z][a-z0-9-]*$/.test(name) || names.has(name) || !versionPattern.test(approved.version) || !approved.sourceReview?.trim()) throw new Error(`Invalid or duplicate selection: ${name}`);
    names.add(name);
    if (!Array.isArray(allowedFiles) || new Set(allowedFiles).size !== allowedFiles.length || !allowedFiles.includes("LICENSE") || allowedFiles.some(file => !/^(?:[a-z0-9][a-z0-9-]*\.(?:js|css|html|md)|LICENSE)$/.test(file))) throw new Error(`Invalid approved files: ${name}`);
    const source = path.join(sources, name);
    if (!fs.existsSync(source) || !fs.lstatSync(source).isDirectory()) throw new Error(`Missing regular source directory: ${name}. Set DESIGN_NOTES_PATH for new parts.`);
    const meta = JSON.parse(read(source, "distribution.json"));
    if (meta.name !== name || meta.version !== approved.version || meta.license !== approved.license || meta.license !== "MIT" || meta.status !== selection.status || meta.framework !== "vanilla") throw new Error(`Identity, version, license or status differs from the approved selection: ${name}`);
    if (JSON.stringify(meta.files) !== JSON.stringify(allowedFiles) || !allowedFiles.includes(meta.entry) || !allowedFiles.includes(meta.example)) throw new Error(`Source manifest differs from approved files: ${name}`);
    if ([meta.dependencies, meta.registryDependencies].some(value => value !== undefined && (!Array.isArray(value) || value.length))) throw new Error(`Runtime dependencies have not been approved: ${name}`);
    const bilingual = [meta.title, meta.description, meta.fit, meta.avoid, meta.integration, meta.accessibility, meta.previewHint, meta.source?.summary, meta.mechanism?.summary];
    if (typeof meta.technology !== "string" || !meta.technology.trim() || bilingual.some(value => typeof value?.en !== "string" || typeof value?.zh !== "string" || !value.en.trim() || !value.zh.trim()) || !Array.isArray(meta.mechanism?.parameters) || meta.mechanism.parameters.some(parameter => typeof parameter.label?.en !== "string" || typeof parameter.label?.zh !== "string" || !Object.hasOwn(meta.mechanism, parameter.key))) throw new Error(`Incomplete display metadata: ${name}`);
    const files = allowedFiles.map(file => ({ path: `${name}/${file}`, type: "registry:file", target: `~/design-parts/${name}/${file}`, content: read(source, file) }));
    const integrity = Object.fromEntries(files.map(file => [path.basename(file.path), digest(file.content)]));
    const revision = digest(json({ meta, integrity }));
    const packageMeta = { ...meta, revision, integrity };
    const item = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name, type: "registry:item", title: meta.title.en,
      description: `${meta.description.en} ${meta.description.zh}`,
      dependencies: [], registryDependencies: [],
      files: [...files, { path: `${name}/metadata.json`, type: "registry:file", target: `~/design-parts/${name}/metadata.json`, content: json(packageMeta) }],
      meta: { version: meta.version, revision, license: meta.license, framework: meta.framework, status: meta.status },
    };
    for (const file of files) write(`parts/${file.path}`, file.content);
    write(`parts/${name}/distribution.json`, json(meta));
    write(`parts/${name}/metadata.json`, json(packageMeta));
    write(`r/${name}.json`, json(item));
    write(`r/${name}-${meta.version}.json`, json(item));
    return { item, catalog: { ...packageMeta, registryPath: `r/${name}-${meta.version}.json`, examplePath: `parts/${name}/${meta.example}` } };
  });
  const skillName = "design-parts-distribution";
  const skillRoot = path.join(repo, ".devin", "skills", skillName);
  const skillFiles = ["SKILL.md", "scripts/catalog.mjs"].map(file => {
    const content = fs.readFileSync(path.join(skillRoot, file), "utf8");
    assertPublic(content, file);
    return {
      path: `${skillName}/${file}`,
      type: "registry:file",
      target: `~/.devin/skills/${skillName}/${file}`,
      content,
    };
  });
  const skill = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "design-parts-skill",
    type: "registry:item",
    title: "Design parts skill",
    description: "Find, inspect and integrate Design parts using a portable Agent Skill and the shadcn CLI.",
    files: skillFiles,
    dependencies: [],
    meta: { version: selection.skillVersion, status: selection.status, license: "MIT" },
  };
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "design-parts",
    homepage: "https://github.com/yishu-ziyu/design-parts-mcp",
    items: [...packages.map(part => part.item), skill],
  };
  const catalog = {
    schemaVersion: 1,
    status: "local-preview",
    cli: "shadcn@4.23.0",
    items: packages.map(part => part.catalog),
    skillPath: "r/design-parts-skill.json",
  };
  write("r/design-parts-skill.json", json(skill));
  write("registry.json", json(registry));
  write("r/registry.json", json(registry));
  write("catalog.json", json(catalog));
  for (const file of skillFiles) write(`skills/${file.path}`, file.content);
  for (const file of ["index.html", "site.css", "site.js"]) {
    const content = fs.readFileSync(path.join(repo, "site", file), "utf8");
    assertPublic(content, file);
    write(file, content);
  }
  const inspectOutput = (directory, prefix = "") => {
    if (!fs.lstatSync(directory).isDirectory()) throw new Error(`Output must be a regular directory: ${prefix || "distribution"}`);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relative = `${prefix}${entry.name}`;
      if (entry.isDirectory()) inspectOutput(path.join(directory, entry.name), `${relative}/`);
      else if (!entry.isFile() || !generated.has(relative)) throw new Error(`Unapproved output remains: ${relative}. Nothing was written; inspect it before any cleanup.`);
    }
  };
  if (fs.existsSync(output)) inspectOutput(output);
  for (const [relative, content] of generated) {
    const target = path.join(output, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  for (const { catalog: part } of packages) console.log(`Built ${part.name}@${part.version}: ${part.files.length} source files. Revision: ${part.revision}`);
  console.log("Boundary check passed. Output: distribution/ (local preview, not published).");
} catch (error) {
  console.error(`Distribution build failed: ${error.message}`);
  process.exitCode = 1;
}
