import type { ReactNode } from "react";

/** Uniform heading size: text-2xl sm:text-3xl. Uniform heading-to-tagline gap: mt-2. */
export default function SectionHeader({
  text,
  subtitle,
  titleAddon,
}: {
  text: string;
  subtitle?: string;
  /** Rendered on the same line, right after the heading (e.g. a badge). */
  titleAddon?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center">
        <div className="w-4 h-10 rounded bg-primary mr-2 flex-shrink-0"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{text}</h2>
        {titleAddon && <div className="ml-3 flex-shrink-0">{titleAddon}</div>}
      </div>
      {subtitle && (
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      )}
    </div>
  );
}
