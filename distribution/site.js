const words = {
  en: {
    local:"Local preview",find:"Find a component",empty:"No matching component.",machine:"JSON catalog ↗",category:"Interaction",components:"Components",onPage:"On this page",skillNav:"Agent Skill",
    preview:"Preview",live:"Live example",standalone:"Open preview ↗",reset:"Reset",
    fitTitle:"Where it fits",limitsTitle:"Usage & limitations",avoidTitle:"Limitations",zero:"No dependencies",
    installTitle:"Installation",agent:"Copy to agent",installHelp:"Inspect the files, then add them to your project. No framework setup required.",inspect:"Inspect",install:"Install",copy:"Copy",
    skillTitle:"Install the Agent Skill",skillHelp:"Adds the reusable skill to this project's .devin/skills directory. Compatible agent clients can import the same files.",readSkill:"Read Skill instructions ↗",
    mechanismTitle:"Interaction details",
    sourceTitle:"Source files",metadata:"Version & checksums ↗",readCode:"View source",
    loading:"Loading…",missing:"Component not found. Choose one from the list.",sourceError:"Source unavailable",
    footer:"Local preview · Not published",copied:"Copied",copyFailed:"Clipboard unavailable. Select and copy the displayed text.",search:"Search components…",
  },
  zh: {
    local:"本地预览",find:"查找组件",empty:"没有匹配的组件。",machine:"JSON 目录 ↗",category:"交互",components:"组件",onPage:"本页内容",skillNav:"Agent Skill",
    preview:"预览",live:"可交互示例",standalone:"独立预览 ↗",reset:"重置",
    fitTitle:"适用场景",limitsTitle:"使用范围与限制",avoidTitle:"使用限制",zero:"零依赖",
    installTitle:"安装",agent:"复制给 Agent",installHelp:"先查看文件，再添加到项目。无需初始化框架。",inspect:"检查",install:"安装",copy:"复制",
    skillTitle:"安装 Agent Skill",skillHelp:"添加到当前项目的 .devin/skills 目录。兼容的 Agent 客户端可以导入同一份文件。",readSkill:"阅读 Skill 指令 ↗",
    mechanismTitle:"交互机制",
    sourceTitle:"源码",metadata:"版本与校验值 ↗",readCode:"查看源码",
    loading:"正在读取…",missing:"找不到这个组件，请从列表选择。",sourceError:"源码暂时不可用",
    footer:"本地预览 · 尚未发布",copied:"已复制",copyFailed:"剪贴板不可用，请选择页面上的文字复制。",search:"搜索组件…",
  },
};
const $ = id => document.getElementById(id);
let language = new URL(location.href).searchParams.get("lang") === "zh" ? "zh" : "en";
let catalog;
let part;
let noticeTimer;
let sourceRevision = 0;
let sourceLoaded = false;
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    $("notice").textContent = words[language].copied;
  } catch {
    $("notice").textContent = words[language].copyFailed;
  }
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { $("notice").textContent = ""; }, 5000);
}
function partURL(name) {
  const url = new URL(location.href);
  url.searchParams.set("part", name);
  url.hash = "";
  return url;
}
function replacePreview(url, title) {
  const frame = $("demo").cloneNode(false);
  if (url) frame.src = url;
  else frame.removeAttribute("src");
  frame.title = title;
  $("demo").replaceWith(frame);
}
function filter() {
  if (!catalog) return;
  const query = $("search").value.trim().toLowerCase();
  const matches = catalog.items.filter(item => {
    const text = JSON.stringify([item.name,item.title,item.description,item.keywords]).toLowerCase();
    return query.split(/\s+/).every(term => text.includes(term));
  });
  $("parts").replaceChildren(...matches.map(item => {
    const link = document.createElement("a");
    link.className = "part-link";
    link.href = partURL(item.name).href;
    link.dataset.part = item.name;
    link.textContent = item.title[language];
    if (item.name === part?.name) link.setAttribute("aria-current", "page");
    const detail = document.createElement("span");
    detail.textContent = `${item.technology} · ${words[language].zero}`;
    link.append(detail);
    return link;
  }));
  $("parts").hidden = !matches.length;
  $("empty").hidden = !!matches.length;
}
function render() {
  language = new URL(location.href).searchParams.get("lang") === "zh" ? "zh" : "en";
  const selected = new URL(location.href).searchParams.get("part");
  part = selected === null ? catalog.items[0] : catalog.items.find(item => item.name === selected);
  sourceRevision++;
  sourceLoaded = false;
  $("source-code").textContent = "";
  $("source-details").open = false;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-copy]").forEach(element => { element.textContent = words[language][element.dataset.copy]; });
  $("language").textContent = language === "en" ? "中文" : "EN";
  $("language").setAttribute("aria-label",language === "en" ? "Switch to Chinese" : "切换为英文");
  $("search").placeholder = words[language].search;
  $("parts").setAttribute("aria-label",words[language].components);
  document.querySelector(".page-nav").setAttribute("aria-label",words[language].onPage);
  document.querySelector(".page-nav").hidden = !part;
  const home = new URL("./",location.href);
  home.searchParams.set("lang",language);
  document.querySelector(".wordmark").href = home.href;
  $("part-content").hidden = !part;
  $("error").hidden = !!part;
  filter();
  if (!part) {
    $("error").textContent = words[language].missing;
    replacePreview(null,words[language].preview);
    document.title = "Design parts";
    return;
  }
  $("title").textContent = part.title[language];
  $("description").textContent = part.description[language];
  $("fit").textContent = part.fit[language];
  $("avoid").textContent = part.avoid[language];
  $("version").textContent = `v${part.version}`;
  $("technology").textContent = part.technology;
  $("demo-hint").textContent = part.previewHint[language];
  $("mechanism-body").textContent = part.mechanism.summary[language];
  $("accessibility").textContent = part.accessibility[language];
  $("integration").textContent = part.integration[language];
  $("source-summary").textContent = `${words[language].readCode} · ${part.entry}`;
  $("parameters").replaceChildren(...part.mechanism.parameters.map(parameter => {
    const group = document.createElement("div");
    const label = document.createElement("dt"), value = document.createElement("dd");
    label.textContent = parameter.label[language];
    value.textContent = `${part.mechanism[parameter.key]}${parameter.unit || ""}`;
    group.append(label,value);
    return group;
  }));
  $("protection").textContent = language === "zh"
    ? `文件放入 design-parts/${part.name}/。保留本地修改，更新前先比较差异。`
    : `Installs to design-parts/${part.name}/. Keep local edits; compare changes before updating.`;
  const example = new URL(part.examplePath, location.href);
  if(language === "zh") example.searchParams.set("lang","zh");
  replacePreview(example.href,`${part.title[language]} · ${words[language].preview}`);
  $("standalone").href = example.href;
  const base = new URL(`parts/${part.name}/`,location.href);
  $("license").href = new URL("LICENSE",base).href;
  $("metadata").href = new URL("metadata.json",base).href;
  $("provenance").textContent = part.source.summary[language];
  const itemURL = new URL(part.registryPath,location.href).href;
  const command = `npx --yes ${catalog.cli} add "${itemURL}"`;
  $("dry-command").textContent = `npx --yes ${catalog.cli} view "${itemURL}"`;
  $("install-command").textContent = `${command} --yes`;
  $("skill-command").textContent = `npx --yes ${catalog.cli} add "${new URL(catalog.skillPath,location.href).href}" --yes`;
  $("files").replaceChildren(...part.files.map(name=>{const a=document.createElement("a");a.href=new URL(name,base).href;a.textContent=name;return a;}));
  document.title=`${part.title[language]} · Design parts`;
}
$("language").addEventListener("click",()=>{if(!catalog)return;const url=new URL(location.href);url.searchParams.set("lang",language==="en"?"zh":"en");history.replaceState(null,"",url);render();});
$("parts").addEventListener("click",event=>{
  const link=event.target.closest("a[data-part]");
  if(!link || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if(link.dataset.part!==part?.name) {
    history.pushState(null,"",link.href);
    render();
  }
  window.scrollTo({top:0,behavior:"instant"});
});
window.addEventListener("popstate",()=>{if(catalog)render();});
$("search").addEventListener("input",filter);
$("reset-demo").addEventListener("click",()=>{if(part)$("demo").contentWindow.location.reload();});
document.querySelector('a[href="#skill-install"]').addEventListener("click",()=>{$("skill-install").open=true;});
document.querySelectorAll("[data-copy-target]").forEach(button=>button.addEventListener("click",()=>copy($(button.dataset.copyTarget).textContent)));
$("agent").addEventListener("click",()=> {
  if(!part)return;
  const url=new URL("catalog.json",location.href).href;
  const skill=new URL("skills/design-parts-distribution/SKILL.md",location.href).href;
  copy(language==="zh"
    ? `请从 Design parts 目录 ${url} 查找 ${part.name}。使用 Skill ${skill} 的 search、show、只读 plan 和安装后 verify 流程。先阅读 fit、avoid、来源、许可与 examplePath。确认适合当前项目后，用 shadcn@4.23.0 view 查看 registryPath 指向的源码，比较目标文件；有差异就停止，不覆盖已有修改。不要在原生项目中使用会触发框架初始化的 add --dry-run。按 metadata.json 中的 integration、usage 和 accessibility 接入并验收，不假设每个零件都有 JavaScript 控制器。这是本机预览地址，其他电脑需要可访问的目录地址。`
    : `Use the Design parts catalog at ${url} to find ${part.name}. Follow the Skill at ${skill}: search, show, read-only plan and post-install verify. Read fit, avoid, source, license and examplePath. Inspect registryPath with shadcn@4.23.0 view and compare target files; stop on conflicting local edits. Do not use add --dry-run in an uninitialized native project. Integrate and verify using metadata.json integration, usage and accessibility. Do not assume every part has a JavaScript controller. This is a local preview URL; another machine needs an accessible catalog URL.`);
});
$("source-details").addEventListener("toggle",async()=>{
  if(!part || !$("source-details").open || sourceLoaded) return;
  const request=++sourceRevision;
  $("source-code").textContent=words[language].loading;
  try{
    const response=await fetch(new URL(`parts/${part.name}/${part.entry}`,location.href));
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const source=await response.text();
    if(request!==sourceRevision)return;
    $("source-code").textContent=source;
    sourceLoaded=true;
  }catch(error){if(request===sourceRevision)$("source-code").textContent=`${words[language].sourceError}: ${error.message}`;}
});
$("loading").textContent=words[language].loading;
try {
  const response=await fetch(new URL("catalog.json",location.href));
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  catalog=await response.json();
  if(!Array.isArray(catalog.items) || !catalog.items.length) throw new Error("No installable part.");
  render();
} catch(error) {
  $("error").hidden=false;
  $("error").textContent=`Catalog unavailable: ${error.message}`;
  $("agent").disabled=true;
  $("language").disabled=true;
} finally {
  $("loading").hidden=true;
}
