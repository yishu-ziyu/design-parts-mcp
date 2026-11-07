import { useEffect, useMemo, useState } from "react";
import catalog from "../../public/library/catalog.json";
import notes from "@/data/library.json";
import "../../public/library/site.css";
import { previewPathPrefix } from "@/lib/preview-path-prefix";

type Copy = { en: string; zh: string };
type Parameter = { key: string; label: Copy; unit?: string };
type Part = {
  name: string;
  version: string;
  title: Copy;
  description: Copy;
  technology: string;
  fit: Copy;
  avoid: Copy;
  previewHint: Copy;
  integration: Copy;
  accessibility: Copy;
  examplePath: string;
  entry: string;
  files: string[];
  registryPath: string;
  mechanism: {
    summary: Copy;
    parameters: Parameter[];
  } & Record<string, string | number | Parameter[] | Copy>;
  source: { summary: Copy };
};

type Lang = "zh" | "en";

const words = {
  en: {
    local: "Local preview",
    find: "Find a component",
    empty: "No matching component.",
    category: "Interaction",
    components: "Components",
    preview: "Preview",
    live: "Live example",
    reset: "Reset",
    fitTitle: "Where it fits",
    limitsTitle: "Usage & limitations",
    whenTitle: "Use it when",
    avoidTitle: "Limitations",
    zero: "No dependencies",
    agent: "Copy to agent",
    mechanismTitle: "Interaction details",
    copied: "Copied",
    search: "Search components…",
    switchLabel: "Switch to Chinese",
    switchText: "中文",
  },
  zh: {
    local: "本地预览",
    find: "查找组件",
    empty: "没有匹配的组件。",
    category: "交互",
    components: "组件",
    preview: "预览",
    live: "可交互示例",
    reset: "重置",
    fitTitle: "适用场景",
    limitsTitle: "使用范围与限制",
    whenTitle: "什么时候用",
    avoidTitle: "使用限制",
    zero: "零依赖",
    agent: "复制给 Agent",
    mechanismTitle: "交互机制",
    copied: "已复制",
    search: "搜索组件…",
    switchLabel: "切换为英文",
    switchText: "EN",
  },
} as const;

const specimen = {
  zh: {
    badge: "午后",
    title: "光落在桌面的方式",
    lead: "光从书页挪到木纹，杯子的影子跟着退开。房间没有变。",
    notes: [
      ["读了", "6 分钟"],
      ["停在", "第 12 页"],
      ["记下", "2 处"],
    ],
    primary: "继续读",
    secondary: "放到稍后",
    writing: "还在写",
    done: "写完了",
  },
  en: {
    badge: "Afternoon",
    title: "How the light sits on the desk",
    lead: "The light moves off the page and onto the wood. The cup's shadow pulls back. The room stays.",
    notes: [
      ["Read", "6 min"],
      ["Stopped", "page 12"],
      ["Noted", "2"],
    ],
    primary: "Keep reading",
    secondary: "Save for later",
    writing: "Writing",
    done: "Done",
  },
} as const;

function shown(value: unknown, lang: Lang): string {
  if (value && typeof value === "object" && "zh" in value && "en" in value) {
    return (value as Copy)[lang];
  }
  return String(value ?? "");
}
const parts = catalog.items as unknown as Part[];

type Note = {
  slug: string;
  title: Copy;
  see: Copy;
  when: Copy;
  href: string;
  search: string;
  rich?: boolean;
};

const library = notes as Note[];
const richBySlug = new Map(parts.map((item) => [item.name, item]));

function line(copy: Copy, lang: Lang): string {
  return (lang === "en" ? copy.en : copy.zh) || copy.zh || copy.en;
}
const STEP_MS = 700;
const HOLD_MS = 1800;

function assetPrefix(): string {
  if (typeof window === "undefined") return "";
  const path = window.location.pathname;
  return (
    previewPathPrefix(window.location.hostname, path) ??
    path.match(/^(\/hds-[a-z0-9]+-\d+-[a-z0-9]+)(?=\/|$)/i)?.[1] ??
    ""
  );
}

function PressSpecimen({ lang }: { lang: Lang }) {
  const [saved, setSaved] = useState(false);
  const zh = lang === "zh";
  return (
    <article className="pf-card">
      <p className="pf-eye">{zh ? "原生按钮" : "Native button"}</p>
      <h3>{zh ? "阅读列表" : "Reading list"}</h3>
      <p>{zh ? "把这篇文章留到稍后阅读。" : "Save this article for later."}</p>
      <div className="pf-actions">
        <button className="pf" type="button" aria-pressed={saved} onClick={() => setSaved((value) => !value)}>
          {zh ? (saved ? "已收藏" : "收藏文章") : saved ? "Saved" : "Save article"}
        </button>
        <button className="pf pf-quiet" type="button" disabled>
          {zh ? "不可用" : "Disabled"}
        </button>
      </div>
    </article>
  );
}

function NoteFrame({ href, title, lang }: { href: string; title: string; lang: Lang }) {
  const [srcDoc, setSrcDoc] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSrcDoc("");
    setFailed(false);
    const url = new URL(`${assetPrefix()}${href}`, window.location.href);
    const dir = url.href.replace(/[^/]*$/, "");
    fetch(url.href)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.text();
      })
      .then((html) => {
        if (cancelled) return;
        const base = `<base href="${dir}"><script>history.replaceState(null,"","?lang=${lang}")<\/script>`;
        const withBase = /<head[^>]*>/i.test(html)
          ? html.replace(/<head[^>]*>/i, (match) => `${match}${base}`)
          : `<!doctype html><html><head>${base}</head><body>${html}</body></html>`;
        setSrcDoc(withBase);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [href, lang]);

  if (failed) return <p className="note-fallback">这页没有打开。</p>;
  if (!srcDoc) return <p className="note-fallback">正在打开…</p>;
  return <iframe title={title} srcDoc={srcDoc} />;
}

function GrowingCard({ replayKey, lang }: { replayKey: number; lang: Lang }) {
  const [step, setStep] = useState(0);
  const copy = specimen[lang];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStep(4);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const cycle = () => {
      if (cancelled) return;
      setStep(0);
      for (const next of [1, 2, 3, 4]) {
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) setStep(next);
          }, STEP_MS * next),
        );
      }
      timers.push(window.setTimeout(cycle, STEP_MS * 4 + HOLD_MS));
    };
    cycle();
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [replayKey]);

  return (
    <div className="grow-demo">
      <p className="grow-status">
        <span>{step >= 4 ? copy.done : copy.writing}</span>
      </p>
      <article className="grow-card" aria-live="polite">
        {step >= 1 && (
          <div className="grow-in">
            <p className="grow-badge">{copy.badge}</p>
            <h3>{copy.title}</h3>
          </div>
        )}
        {step >= 2 && <p className="grow-lead grow-in">{copy.lead}</p>}
        {step >= 3 && (
          <div className="grow-metrics grow-in">
            {copy.notes.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </div>
            ))}
          </div>
        )}
        {step >= 4 && (
          <div className="grow-actions grow-in">
            <button type="button" className="primary">
              {copy.primary}
            </button>
            <button type="button">{copy.secondary}</button>
          </div>
        )}
      </article>
    </div>
  );
}

export function PartsPreview() {
  const [home, setHome] = useState(true);
  const [name, setName] = useState(library[0]?.slug ?? "growing-ui");
  const [query, setQuery] = useState("");
  const [replayKey, setReplayKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [lang, setLang] = useState<Lang>("zh");
  const [prefix, setPrefix] = useState("");
  const note = library.find((item) => item.slug === name) ?? library[0];
  const rich = note ? richBySlug.get(note.slug) : undefined;
  const text = words[lang];

  useEffect(() => {
    setPrefix(assetPrefix());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const visible = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return library.filter((item) => terms.every((term) => item.search.toLowerCase().includes(term)));
  }, [query]);

  async function copyToAgent() {
    if (!note) return;
    const message =
      lang === "zh"
        ? `打开 ${note.slug}。看见：${line(note.see, "zh")} 什么时候用：${line(note.when, "zh")}`
        : `Open ${note.slug}. You see: ${line(note.see, "en")} Use it when: ${line(note.when, "en")}`;
    try {
      await navigator.clipboard.writeText(message);
      setNotice(text.copied);
    } catch {
      setNotice(message);
    }
    window.setTimeout(() => setNotice(""), 4000);
  }

  if (!note) return null;

  function openPart(slug: string) {
    setName(slug);
    setHome(false);
    setReplayKey((value) => value + 1);
  }

  const homeCopy =
    lang === "zh"
      ? {
          title: "打开一条，看它正在转",
          lede: "零件就放在这页上。先看它怎么动，再复制给 Agent。",
          primary: "看回答卡片",
          secondary: "全部零件",
          live: "正在动的",
        }
      : {
          title: "Open one. Watch it move.",
          lede: "The parts are on this page. Watch one move, then copy it to an agent.",
          primary: "See the answer card",
          secondary: "All parts",
          live: "Moving now",
        };

  if (home) {
    return (
      <div className="foundation">
        <header className="found-nav">
          <a className="wordmark" href="#home">
            <span className="brand-mark" aria-hidden="true">dp</span>
            Design parts
          </a>
          <input
            type="search"
            placeholder={text.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={text.find}
          />
          <button id="language" type="button" aria-label={text.switchLabel} onClick={() => setLang((current) => (current === "zh" ? "en" : "zh"))}>
            {text.switchText}
          </button>
        </header>
        <section className="found-hero">
          <h1>{homeCopy.title}</h1>
          <p>{homeCopy.lede}</p>
          <div className="found-actions">
            <button className="primary pill" type="button" onClick={() => openPart("growing-ui")}>{homeCopy.primary}</button>
            <a href="#directory">{homeCopy.secondary}</a>
          </div>
        </section>
        <section className="bento" aria-label={homeCopy.live}>
          <div className="bento-card bento-press">
            <PressSpecimen lang={lang} />
            <button type="button" className="open-part" onClick={() => openPart("press-feedback")}>
              {lang === "zh" ? "打开" : "Open"}
            </button>
          </div>
          <div className="bento-card bento-grow">
            <GrowingCard replayKey={replayKey} lang={lang} />
            <button type="button" className="open-part" onClick={() => openPart("growing-ui")}>
              {lang === "zh" ? "打开" : "Open"}
            </button>
          </div>
          {library.filter((item) => !["growing-ui", "press-feedback"].includes(item.slug)).slice(0, 4).map((item) => (
            <button key={item.slug} type="button" className="bento-card bento-note" onClick={() => openPart(item.slug)}>
              <h3>{line(item.title, lang)}</h3>
              <p>{line(item.see, lang)}</p>
            </button>
          ))}
        </section>
        <section id="directory" className="directory">
          <h2>{homeCopy.secondary}</h2>
          <div className="directory-grid">
            {visible.map((item) => (
              <button key={item.slug} type="button" onClick={() => openPart(item.slug)}>
                {line(item.title, lang)}
              </button>
            ))}
          </div>
          <p hidden={visible.length > 0}>{text.empty}</p>
        </section>
        <div id="notice" role="status">{notice}</div>
      </div>
    );
  }

  const exampleSrc = note.href ? `${prefix}${note.href}` : "";

  return (
    <div className="layout">
      <header className="masthead">
        <div className="header-actions">
          <span className="local">{text.local}</span>
          <button
            id="language"
            type="button"
            aria-label={text.switchLabel}
            onClick={() => setLang((current) => (current === "zh" ? "en" : "zh"))}
          >
            {text.switchText}
          </button>
        </div>
      </header>
      <aside className="sidebar">
        <a className="wordmark" href="#component">
          <span className="brand-mark" aria-hidden="true">
            dp
          </span>
          Design parts
        </a>
        <div className="search-field">
          <label className="search-label" htmlFor="search">
            {text.find}
          </label>
          <input
            id="search"
            type="search"
            placeholder={text.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <p className="nav-label">{text.components}</p>
        <nav className="note-list" aria-label={text.components} hidden={visible.length === 0}>
          {visible.map((item) => (
            <a
              key={item.slug}
              className="part-link"
              href={`#${item.slug}`}
              aria-current={item.slug === note.slug ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                setName(item.slug);
                setReplayKey((value) => value + 1);
              }}
            >
              {line(item.title, lang)}
            </a>
          ))}
        </nav>
        <p hidden={visible.length > 0}>{text.empty}</p>
      </aside>
      <main id="component">
        <p className="breadcrumb">
          <button type="button" className="back" onClick={() => setHome(true)}>{lang === "zh" ? "全部零件" : "All parts"}</button>
          <span aria-hidden="true">/</span>
          <span>{line(note.title, lang)}</span>
        </p>
        <div className="part-heading">
          <h1>{line(note.title, lang)}</h1>
          <button className="primary" type="button" onClick={copyToAgent}>
            {text.agent}
          </button>
        </div>
        <p className="lede">{line(note.see, lang)}</p>
        <section className="demo-section" aria-label={text.preview}>
          <div className="section-label">
            <h2>{text.preview}</h2>
            <span className="preview-label">{text.live}</span>
          </div>
          <div className={note.slug === "growing-ui" ? "demo-frame" : "demo-frame note-frame"}>
            {note.slug === "growing-ui" ? (
              <GrowingCard key={`${replayKey}-${lang}`} replayKey={replayKey} lang={lang} />
            ) : (
              <NoteFrame key={`${note.href}-${lang}-${replayKey}`} href={note.href} title={line(note.title, lang)} lang={lang} />
            )}
          </div>
          <div className="demo-toolbar">
            <p className="caption">{rich ? line(rich.previewHint, lang) : line(note.when, lang)}</p>
            <div>
              <button type="button" onClick={() => setReplayKey((value) => value + 1)}>
                <span aria-hidden="true">↻</span> {text.reset}
              </button>
            </div>
          </div>
        </section>
        <details className="facts" open>
          <summary>{text.whenTitle}</summary>
          <p>{line(note.when, lang)}</p>
        </details>
        {rich ? (
          <details className="mechanism" open>
            <summary>{text.mechanismTitle}</summary>
            <p>{line(rich.mechanism.summary, lang)}</p>
            <dl className="parameters">
              {rich.mechanism.parameters.map((parameter) => (
                <div key={parameter.key}>
                  <dt>{line(parameter.label, lang)}</dt>
                  <dd>
                    {shown(rich.mechanism[parameter.key], lang)}
                    {parameter.unit ?? ""}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="fine">{line(rich.accessibility, lang)}</p>
          </details>
        ) : null}
      </main>
      <div id="notice" role="status">
        {notice}
      </div>
    </div>
  );
}
