import { useCallback, useEffect, useRef, type RefObject } from "react";

interface AutoAdvanceOptions {
  /** Time between moves */
  intervalMs?: number;
  /** Only auto-advance while this media query matches (e.g. mobile only) */
  mediaQuery?: string;
  /** How long to wait after the user interacts before resuming */
  resumeDelayMs?: number;
  enabled?: boolean;
}

/**
 * Auto-scrolls a horizontal scroller one item at a time (first child's children are the items),
 * rewinding to the start at the end. Pauses while the user touches/hovers/focuses it.
 * Spread the returned handlers onto the scroll container.
 */
export function useAutoAdvance(
  ref: RefObject<HTMLElement | null>,
  {
    intervalMs = 3000,
    mediaQuery = "(max-width: 639px)",
    resumeDelayMs = 4000,
    enabled = true,
  }: AutoAdvanceOptions = {}
) {
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      const el = ref.current;
      if (!el || pausedRef.current || document.hidden) return;
      if (mediaQuery && !window.matchMedia(mediaQuery).matches) return;

      const track = el.firstElementChild as HTMLElement | null;
      const item = track?.firstElementChild as HTMLElement | null;
      if (!track || !item) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 2) return;

      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        el.scrollBy({ left: item.offsetWidth + gap, behavior: "smooth" });
      }
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(resumeTimerRef.current);
    };
  }, [ref, intervalMs, mediaQuery, enabled]);

  const pause = useCallback(() => {
    window.clearTimeout(resumeTimerRef.current);
    pausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, resumeDelayMs);
  }, [resumeDelayMs]);

  return {
    onTouchStart: pause,
    onTouchEnd: resume,
    onMouseEnter: pause,
    onMouseLeave: resume,
    onFocus: pause,
    onBlur: resume,
  };
}
