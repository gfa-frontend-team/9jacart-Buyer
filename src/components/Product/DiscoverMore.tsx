import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import ProductCard from "./ProductCard";
import RecentlyViewedProductsSection from "@/components/HomePage/RecentlyViewedProductsSection";
import { useBuyerActiveProductsList } from "@/hooks/api/useRealProducts";
import { productsApi } from "@/api/products";
import { isDiscountedProduct } from "@/lib/productUtils";
import { normalizeProductImages, cn } from "@/lib/utils";
import { clearRecentSearches, getRecentSearches } from "@/lib/recentSearches";
import type { ProductSummary } from "@/types";

type SectionKey = "recent-searches" | "related" | "deals" | "new-arrivals" | "best-sellers" | "recently-viewed";

interface DiscoverMoreProps {
  /** Sections to leave out (e.g. "deals" on the deals page) */
  exclude?: SectionKey[];
  /** Show "Related items" from this category first (when it has products) */
  relatedCategoryId?: string;
  /** Product ids already on screen, never repeated here */
  excludeProductIds?: string[];
  title?: string;
  className?: string;
}

const ROW_LIMIT = 10;

/** Horizontal, snap-scrolling product row with one-card arrow steps. */
const ProductRow: React.FC<{
  title: string;
  viewAllTo?: string;
  products: ProductSummary[];
}> = ({ title, viewAllTo, products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  if (products.length === 0) return null;

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollRef.current;
    const track = el?.firstElementChild as HTMLElement | null;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!el || !track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
        <div className="flex items-center gap-2">
          {viewAllTo && (
            <Link to={viewAllTo} className="text-sm font-medium text-[#28a745] hover:underline">
              View all
            </Link>
          )}
          {products.length > 2 && (
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                aria-label={`Scroll ${title} left`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                aria-label={`Scroll ${title} right`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div ref={scrollRef} className="@container -mx-1 overflow-x-auto px-1 pb-2 scrollbar-hide snap-x snap-mandatory">
        <div className="flex w-max min-w-full gap-3 sm:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start w-[calc((100cqw-0.75rem)/2)] shrink-0 sm:w-[calc((100cqw-2rem)/3)] md:w-[calc((100cqw-3rem)/4)] lg:w-[calc((100cqw-4rem)/5)]"
            >
              <ProductCard product={normalizeProductImages(product)} showQuickAdd className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * "Keep exploring" block shown under empty results and at the end of listing pages:
 * recent searches, related items, today's deals, new arrivals, best sellers, recently viewed.
 */
const DiscoverMore: React.FC<DiscoverMoreProps> = ({
  exclude = [],
  relatedCategoryId,
  excludeProductIds = [],
  title = "Keep exploring",
  className,
}) => {
  const navigate = useNavigate();
  const { allProducts } = useBuyerActiveProductsList({});
  const [bestSellerIds, setBestSellerIds] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());
  const skip = (key: SectionKey) => exclude.includes(key);

  useEffect(() => {
    if (exclude.includes("best-sellers")) return;
    let cancelled = false;
    productsApi
      .getBestSellerIds({ limit: 20, period: "year" })
      .then((ids) => {
        if (!cancelled) setBestSellerIds(ids);
      })
      .catch(() => undefined); // section simply stays hidden
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => {
    const hidden = new Set(excludeProductIds);
    const unique = Array.from(new Map(allProducts.map((p) => [p.id, p])).values()).filter(
      (p) => !hidden.has(p.id) && p.inventory?.inStock !== false
    );
    const byId = new Map(unique.map((p) => [p.id, p]));

    const related = relatedCategoryId
      ? unique.filter((p) => p.categoryId === relatedCategoryId).slice(0, ROW_LIMIT)
      : [];
    const deals = unique.filter(isDiscountedProduct).slice(0, ROW_LIMIT);
    const newArrivals = [...unique]
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
      .slice(0, ROW_LIMIT);
    const bestSellers = bestSellerIds
      .map((id) => byId.get(id))
      .filter((p): p is ProductSummary => Boolean(p))
      .slice(0, ROW_LIMIT);

    return { related, deals, newArrivals, bestSellers };
  }, [allProducts, bestSellerIds, relatedCategoryId, excludeProductIds]);

  return (
    <div className={cn("space-y-8", className)}>
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>

      {!skip("recent-searches") && recentSearches.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Your recent searches</h3>
            <button
              type="button"
              onClick={() => {
                clearRecentSearches();
                setRecentSearches([]);
              }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                className="flex max-w-full items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-primary hover:text-primary"
              >
                <Clock className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" aria-hidden />
                <span className="truncate">{term}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!skip("related") && relatedCategoryId && (
        <ProductRow
          title="Related items"
          viewAllTo={`/category/${relatedCategoryId}`}
          products={rows.related}
        />
      )}
      {!skip("deals") && <ProductRow title="Today's deals" viewAllTo="/deals" products={rows.deals} />}
      {!skip("new-arrivals") && (
        <ProductRow title="New arrivals" viewAllTo="/new-arrivals" products={rows.newArrivals} />
      )}
      {!skip("best-sellers") && (
        <ProductRow title="Best sellers" viewAllTo="/bestsellers" products={rows.bestSellers} />
      )}
      {!skip("recently-viewed") && <RecentlyViewedProductsSection variant="inline" limit={5} showQuickAdd />}
    </div>
  );
};

export default DiscoverMore;
