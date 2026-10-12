import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Menu, Zap } from "lucide-react";
import { useAllRealCategories } from "@/hooks";
import type { Category } from "@/types";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";

const VENDOR_SELL_URL = "http://vendors.9jacart.ng";

const linkClass =
  "whitespace-nowrap rounded-md px-2 py-1 text-sm text-white/90 transition-colors hover:bg-[#8DEB6E]/15 hover:text-white relative";
const activeUnderline =
  "text-[#8DEB6E] font-medium after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-[#8DEB6E]";

/** Pixels per frame (~60fps) for the mobile category auto-scroll */
const AUTO_SCROLL_SPEED = 0.5;
/** Resume auto-scroll this long after the user stops touching the strip */
const AUTO_SCROLL_RESUME_MS = 2500;

/**
 * Mobile-only category strip that scrolls continuously on its own (looping),
 * pauses while the user touches/hovers it, and stays swipeable.
 */
const MobileCategoryStrip: React.FC<{
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (category: Category) => void;
}> = ({ categories, selectedCategoryId, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || categories.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    // Browsers round scrollLeft, so keep the fractional position ourselves
    let position = el.scrollLeft;

    const tick = () => {
      const half = el.scrollWidth / 2;
      // Skip when hidden (desktop) or when there is nothing to scroll
      if (!pausedRef.current && el.clientWidth > 0 && half > el.clientWidth) {
        if (Math.abs(el.scrollLeft - position) > 2) position = el.scrollLeft; // user swiped
        position += AUTO_SCROLL_SPEED;
        if (position >= half) position -= half; // seamless loop onto the duplicate set
        el.scrollLeft = position;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimerRef.current);
    };
  }, [categories.length]);

  const pause = () => {
    window.clearTimeout(resumeTimerRef.current);
    pausedRef.current = true;
  };
  const resumeLater = () => {
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, AUTO_SCROLL_RESUME_MS);
  };

  const renderPill = (category: Category, duplicate: boolean) => {
    const Icon = getCategoryIcon(category.name, category.id);
    const active = selectedCategoryId === category.id;
    return (
      <button
        key={`${duplicate ? "dup" : "cat"}-${category.id}`}
        type="button"
        onClick={() => onSelect(category)}
        aria-hidden={duplicate || undefined}
        tabIndex={duplicate ? -1 : undefined}
        className={cn(
          "flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          active
            ? "border-[#8DEB6E] bg-[#8DEB6E] text-primary"
            : "border-white/15 bg-white/10 text-white hover:border-[#8DEB6E]/60 hover:bg-[#8DEB6E]/15"
        )}
      >
        <Icon
          className={cn("h-3.5 w-3.5 shrink-0", active ? "text-primary" : "text-[#8DEB6E]")}
          aria-hidden
        />
        {category.name}
      </button>
    );
  };

  if (categories.length === 0) {
    return (
      <div className="flex gap-2 overflow-hidden py-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="h-7 w-24 flex-shrink-0 animate-pulse rounded-full bg-white/10"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 scrollbar-hide"
      onTouchStart={pause}
      onTouchEnd={resumeLater}
      onMouseEnter={pause}
      onMouseLeave={resumeLater}
      onFocus={pause}
      onBlur={resumeLater}
    >
      {categories.map((category) => renderPill(category, false))}
      {categories.map((category) => renderPill(category, true))}
    </div>
  );
};

const HomeSubNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId: selectedCategoryId } = useParams<{ categoryId?: string }>();

  const { categories } = useAllRealCategories();
  const mainCategories = categories.filter(
    (cat) => cat.level === 1 && !cat.archived,
  );

  const handleCategoryClick = (category: Category) => {
    navigate(`/category/${category.id}`, {
      state: { categoryName: category.name },
    });
  };

  const isActive = (path: string) => {
    if (path === "/products") return location.pathname === "/products";
    if (path === "/deals") return location.pathname === "/deals";
    if (path === "/new-arrivals") return location.pathname === "/new-arrivals";
    if (path === "/bestsellers") return location.pathname === "/bestsellers";
    if (path === "/orders")
      return (
        location.pathname.startsWith("/orders") ||
        location.pathname.startsWith("/track-order")
      );
    return false;
  };

  return (
    <nav
      className="w-full border-b border-gray-200 border-t border-t-[#8DEB6E]/40 bg-[#182F38]/95 backdrop-blur-md text-white"
      aria-label="Home quick links"
    >
      <div className="mx-auto max-w-[960px] px-4 sm:px-6 lg:max-w-7xl lg:px-8 2xl:max-w-[1550px]">
        {/* Mobile/tablet: categories only (menu + quick links live in the hamburger menu) */}
        <div className="py-2 lg:hidden">
          <MobileCategoryStrip
            categories={mainCategories}
            selectedCategoryId={selectedCategoryId}
            onSelect={handleCategoryClick}
          />
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-6 lg:items-stretch lg:gap-x-6 lg:min-h-[40px]">
          {/* Same width as categories column; All Categories fills cell top→bottom */}
          <div className="relative flex w-full lg:col-span-1 lg:h-full">
            <Link
              to="/products"
              className={`flex w-full flex-1 items-center gap-2 bg-[#8DEB6E]/20 px-3 text-sm font-semibold text-white transition-colors hover:bg-[#8DEB6E]/25 lg:h-full lg:min-h-[40px] ${
                isActive("/products") ? "bg-[#8DEB6E]/25" : ""
              }`}
            >
              <Menu className="h-4 w-4 shrink-0" aria-hidden />
              All Categories
            </Link>
          </div>

          <div className="flex overflow-x-auto scrollbar-hide items-center justify-start gap-x-10 lg:col-span-3 lg:h-full xl:col-span-4 lg:px-1">
            <Link
              to="/deals"
              className={`${linkClass} ${isActive("/deals") ? activeUnderline : ""}`}
            >
              Today&apos;s Deals
            </Link>
            <Link
              to="/new-arrivals"
              className={`${linkClass} ${
                isActive("/new-arrivals") ? activeUnderline : ""
              }`}
            >
              New Arrivals
            </Link>
            <Link
              to="/bestsellers"
              className={`${linkClass} ${
                isActive("/bestsellers") ? activeUnderline : ""
              }`}
            >
              Best Sellers
            </Link>
            <Link
              to="/orders"
              className={`${linkClass} ${
                isActive("/orders") ? activeUnderline : ""
              }`}
            >
              Track Order
            </Link>
            <a
              href={VENDOR_SELL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} after:hidden`}
            >
              Sell on 9ja Cart
            </a>
          </div>

          <div className="flex lg:col-span-1 lg:h-full lg:items-center lg:justify-end">
            <Link
              to="/#flash-deals"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#8DEB6E]/20 px-3 py-1.5 text-sm font-semibold text-[#FACC15] transition-colors hover:bg-[#8DEB6E]/25"
            >
              <Zap className="h-4 w-4 shrink-0 fill-[#FACC15]" aria-hidden />
              Flash Deals
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeSubNav;
