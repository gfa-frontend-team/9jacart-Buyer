import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { productsApi } from "@/api/products";
import { mapApiProductsToProductSummaries } from "@/utils/product-mappers";
import { formatPrice } from "@/lib/productUtils";
import type { ProductSummary } from "@/types";

const DEBOUNCE_MS = 300;
const MAX_SUGGESTIONS = 6;

interface SearchSuggestionsProps {
  query: string;
  /** Restrict suggestions to this category id ("" = all categories) */
  categoryId: string;
  open: boolean;
  onClose: () => void;
  onSeeAll: () => void;
}

/** Live product preview shown under the header search box while typing. */
const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  categoryId,
  open,
  onClose,
  onSeeAll,
}) => {
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const term = query.trim();

  useEffect(() => {
    if (!open || term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const params = { page: 1, perPage: MAX_SUGGESTIONS, search: term, isActive: "1" };
        const response = categoryId
          ? await productsApi.getProductsByCategory(categoryId, params)
          : await productsApi.getProducts(params);
        if (cancelled) return;
        setResults(mapApiProductsToProductSummaries(response.data).slice(0, MAX_SUGGESTIONS));
        setFailed(false);
      } catch {
        if (!cancelled) {
          setResults([]);
          setFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [term, categoryId, open]);

  if (!open || term.length < 2) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full z-[70] mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-2xl"
      onMouseDown={(e) => e.preventDefault()} // keep input focus while clicking inside
    >
      {loading && results.length === 0 ? (
        <div className="flex items-center gap-2 px-4 py-4 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Searching…
        </div>
      ) : results.length === 0 ? (
        <div className="px-4 py-4 text-sm text-gray-500">
          {failed ? "Couldn't load suggestions right now." : `No matches for "${term}"`}
        </div>
      ) : (
        <ul className="max-h-[60vh] divide-y divide-gray-100 overflow-y-auto">
          {results.map((product) => (
            <li key={product.id}>
              <Link
                to={`/products/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[#8DEB6E]/10"
              >
                <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                  {product.images?.main && (
                    <img
                      src={product.images.main}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-sm font-semibold text-primary">
                    {formatPrice(product.price.current)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onSeeAll}
        className="flex w-full items-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-primary transition-colors hover:bg-[#8DEB6E]/15"
      >
        <Search className="h-4 w-4" aria-hidden />
        See all results for "{term}"
      </button>
    </div>
  );
};

export default SearchSuggestions;
