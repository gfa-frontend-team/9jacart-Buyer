import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface SearchCategorySelectProps {
  categories: Category[];
  /** "" = all categories */
  value: string;
  onChange: (categoryId: string) => void;
  /** Extra classes for the trigger (width / text size per breakpoint) */
  triggerClassName?: string;
}

/**
 * Category picker for the header search. Replaces the native <select>, whose option list
 * can't be styled: long names now truncate with equal left/right padding in a fixed-width list.
 * The list is positioned against the nearest `relative` ancestor (the search form), so the
 * trigger itself stays unpositioned and is not clipped by the input's overflow-hidden wrapper.
 */
const SearchCategorySelect: React.FC<SearchCategorySelectProps> = ({
  categories,
  value,
  onChange,
  triggerClassName,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selected = categories.find((c) => c.id === value);
  const options = [{ id: "", name: "All" }, ...categories.map((c) => ({ id: c.id, name: c.name }))];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    // Bring the selected option into view
    listRef.current?.querySelector<HTMLElement>("[aria-selected='true']")?.scrollIntoView({ block: "nearest" });
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="flex flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Search category: ${selected?.name ?? "All"}`}
        className={cn(
          "flex h-full items-center gap-1 bg-primary px-3 text-primary-foreground transition-colors hover:bg-primary/90",
          triggerClassName
        )}
      >
        <span className="min-w-0 flex-1 truncate text-left">{selected?.name ?? "All"}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 flex-shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Search category"
          className="absolute left-0 top-full z-[75] mt-1 max-h-[60vh] w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 text-gray-900 shadow-2xl"
        >
          {options.map((option) => {
            const isSelected = option.id === value;
            return (
              <li key={option.id || "all"} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                  title={option.name}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-[#8DEB6E]/20 font-medium text-primary"
                      : "hover:bg-gray-50"
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{option.name}</span>
                  {isSelected && <Check className="h-4 w-4 flex-shrink-0" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchCategorySelect;
