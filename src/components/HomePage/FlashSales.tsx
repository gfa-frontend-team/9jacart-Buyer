import { useRef } from "react";
import SectionHeader from "../UI/SectionHeader";
import { useBuyerActiveProductsList } from "../../hooks/api/useRealProducts";
import { ProductCard } from "../Product";
import { Button, ErrorState } from "../UI";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Zap } from "lucide-react";
import { normalizeProductImages } from "@/lib/utils";
import { isDiscountedProduct } from "@/lib/productUtils";

export default function FlashSales() {
  // Fetch all products across pages so we can show every discounted product
  const { allProducts, loading, error, refetch } = useBuyerActiveProductsList(
    {},
  );

  // Filter products with discounts for flash sales — include both discount object and price comparison
  const flashSaleProducts = allProducts.filter(isDiscountedProduct);

  // Ensure we don't show the same product twice, even if it appears multiple times in allProducts
  const uniqueFlashSaleProducts = Array.from(
    new Map(flashSaleProducts.map((product) => [product.id, product])).values(),
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Arrows only where the products overflow the visible slots (2 / 3 / 4 / 5 per breakpoint)
  const productCount = uniqueFlashSaleProducts.length;
  const arrowVisibilityClass =
    productCount > 5
      ? "flex"
      : productCount > 4
        ? "flex lg:hidden"
        : productCount > 3
          ? "flex md:hidden"
          : productCount > 2
            ? "flex sm:hidden"
            : "hidden";

  // Move exactly one card per click so cards never stop half-visible
  const scrollFlashDeals = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    const track = container?.firstElementChild as HTMLElement | null;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!container || !track || !card) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <SectionHeader
              text="Today's deal"
              subtitle="Explore products with remarkable discounts"
            />
          </div>

          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Loading today's deals...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <SectionHeader
              text="Today's deal"
              subtitle="Explore products with remarkable discounts"
            />
          </div>

          <ErrorState error={error} variant="inline" showHomeButton={false} onRetry={() => refetch()} />
        </div>
      </section>
    );
  }

  // Only show the section when there are discounted products (flash sales)
  if (flashSaleProducts.length === 0) {
    return null;
  }

  const viewAllButtonClass =
    "bg-white border-[#2ac12a] text-gray-900 hover:bg-[#8DEB6E] hover:text-[#1E4700] hover:border-[#2ac12a]";

  return (
    <section id="flash-deals" className="py-8 sm:py-12 bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <SectionHeader
            text="Today's deal"
            subtitle="Explore products with remarkable discounts"
            titleAddon={
              <Link
                to="/deals"
                className="md:hidden inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-[#8DEB6E] shadow-sm transition-colors hover:bg-primary/90"
              >
                <Zap className="h-3.5 w-3.5 shrink-0 fill-[#8DEB6E]" aria-hidden />
                Flash Deals
              </Link>
            }
          />

          <Link to="/deals" className="shrink-0">
            <Button
              variant="outline"
              className={`hidden items-center gap-2 sm:flex ${viewAllButtonClass}`}
            >
              View All Deals
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          {productCount > 2 && (
            <>
              <button
                type="button"
                aria-label="Scroll today's deals left"
                onClick={() => scrollFlashDeals("left")}
                className={`absolute left-2 top-1/2 z-10 ${arrowVisibilityClass} h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#2ac12a]/40 bg-white/95 text-primary shadow-md transition-colors hover:bg-[#8DEB6E]/20`}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Scroll today's deals right"
                onClick={() => scrollFlashDeals("right")}
                className={`absolute right-2 top-1/2 z-10 ${arrowVisibilityClass} h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#2ac12a]/40 bg-white/95 text-primary shadow-md transition-colors hover:bg-[#8DEB6E]/20`}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </>
          )}
          <div
            ref={scrollContainerRef}
            className="@container pb-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          >
            <div
              className="flex w-max min-w-full gap-3 sm:gap-4 lg:gap-6"
            >
              {uniqueFlashSaleProducts.map((product) => (
                <div
                  key={product.id}
                  className="snap-start w-[calc((100cqw-0.75rem)/2)] shrink-0 sm:w-[calc((100cqw-2rem)/3)] md:w-[calc((100cqw-3rem)/4)] lg:w-[calc((100cqw-6rem)/5)]"
                >
                  <ProductCard
                    product={normalizeProductImages(product)}
                    eagerImages
                    highlightAsFlashSale
                    className="h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link to="/deals">
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${viewAllButtonClass}`}
            >
              View All Deals
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
