import { useState } from "react";
import {
  AppWindow,
  Bookmark,
  Check,
  Crop,
  Eye,
  Languages,
  PictureInPicture2,
  RefreshCw,
  Tv,
} from "lucide-react";
import type { Utility } from "@/components/home/content";
import { useLocale } from "@/components/home/locale";

const utilityIcon = {
  crop: Crop,
  pip: PictureInPicture2,
  eye: Eye,
  window: AppWindow,
  tv: Tv,
  sync: RefreshCw,
  pin: Bookmark,
  lang: Languages,
} as const;

export function UtilitySheet() {
  const { t } = useLocale();
  const [tools, setTools] = useState<Record<string, boolean>>({ switcher: true, lang: true });

  return (
    <ul className="cl-utils">
      {t.utilities.map((item, index) => (
        <UtilityRow
          key={item.id}
          item={item}
          on={Boolean(tools[item.id])}
          delay={index}
          toggle={() => setTools((current) => ({ ...current, [item.id]: !current[item.id] }))}
        />
      ))}
    </ul>
  );
}

function UtilityRow({
  item,
  on,
  toggle,
  delay,
}: {
  item: Utility;
  on: boolean;
  toggle: () => void;
  delay: number;
}) {
  const Icon = utilityIcon[item.icon];
  return (
    <li data-reveal style={{ ["--d" as string]: delay % 3 }}>
      <div className="cl-util-top">
        <span className="cl-util-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2} />
        </span>
        <div>
          <strong>{item.title}</strong>
          <p>{item.body}</p>
        </div>
        <button type="button" role="switch" aria-checked={on} className={on ? "cl-switch is-on" : "cl-switch"} onClick={toggle}>
          <span />
          <span className="cl-sr">{item.title}</span>
        </button>
      </div>
      <p className={on ? "cl-util-note is-on" : "cl-util-note"}>
        <Check size={14} strokeWidth={2} />
        {item.note}
      </p>
    </li>
  );
}
