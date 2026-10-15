import type { CSSProperties, ReactNode } from "react";
import ScrambleText from "./ScrambleText";

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
};

/** Section heading styled like an editor panel: track index, label and a timeline ruler. */
export default function SectionHeader({ index, label, title, description, align = "left" }: Props) {
  const centered = align === "center";
  return (
    <div className={`mb-10 md:mb-14 ${centered ? "text-center" : ""}`}>
      <div data-reveal data-ascii-mask className={`mb-5 flex items-center gap-4 ${centered ? "justify-center" : ""}`}>
        <span className="mono-label flex shrink-0 items-center gap-2">
          <span className="text-accent">[{index}]</span>
          <ScrambleText text={label} className="text-foreground/80" delay={150} />
        </span>
        {!centered && <span className="ruler hidden flex-1 opacity-70 sm:block" />}
      </div>
      <h2 className="font-heading text-[2.1rem] font-semibold leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
        <span className="line-mask">
          <span>{title}</span>
        </span>
      </h2>
      {description && (
        <p
          data-reveal
          style={{ "--d": "120ms" } as CSSProperties}
          className={`mt-5 max-w-2xl text-base text-muted md:text-lg ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
