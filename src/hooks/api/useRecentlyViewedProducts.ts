import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { recommendationsApi, type RecentlyViewedParams } from "../../api/recommendations";
import { productsApi } from "../../api/products";
import {
  mapApiProductToProductSummary,
  mapRecentlyViewedItemToProductSummary,
  type RecentlyViewedApiItem,
} from "../../utils/product-mappers";
import { apiErrorUtils } from "../../utils/api-errors";
import type { ProductSummary } from "../../types";

const DEFAULT_LIMIT = 4;

export interface UseRecentlyViewedParams {
  limit?: number;
  vendorId?: string | null;
  categoryId?: string | null;
}

/**
 * Fetches recently viewed products from the recommendations API, then enriches
 * each item with full product details (including totalPrice) from the products API.
 * This ensures the price shown on the card matches the product details page.
 * Requires authentication; returns empty list when not logged in or on API error.
 */
export function useRecentlyViewedProducts(params: UseRecentlyViewedParams = {}) {
  const { isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = params.limit ?? DEFAULT_LIMIT;
  const vendorId = params.vendorId || undefined;
  const categoryId = params.categoryId || undefined;

  const fetchRecentlyViewed = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiParams: RecentlyViewedParams = { limit };
      if (vendorId) apiParams.vendorId = vendorId;
      if (categoryId) apiParams.categoryId = categoryId;

      const response = await recommendationsApi.getRecentlyViewedProducts(apiParams);
      const raw = Array.isArray(response?.data?.products) ? response.data.products : [];
      const recentItems = raw as RecentlyViewedApiItem[];

      if (recentItems.length === 0) {
        setProducts([]);
        return;
      }

      // Fetch full product details in parallel so we get the correct totalPrice
      // (the recently viewed endpoint does not include totalPrice).
      // Promise.allSettled ensures a failed fetch for one item doesn't block the rest.
      const productIds = recentItems.map((item) =>
        String(item.productId ?? (item as Record<string, unknown>).id ?? "")
      );
      const fullProductResults = await Promise.allSettled(
        productIds.map((id) => (id ? productsApi.getProduct(id) : Promise.reject()))
      );

      const mapped: ProductSummary[] = recentItems.map((recentItem, idx) => {
        const result = fullProductResults[idx];
        if (result.status === "fulfilled" && result.value?.data) {
          // Use the full product data — includes totalPrice, giving the same
          // price as the product details page.
          return mapApiProductToProductSummary(result.value.data);
        }
        // Graceful fallback: use whatever the recently viewed endpoint returned.
        return mapRecentlyViewedItemToProductSummary(recentItem);
      });

      setProducts(mapped.filter((p) => Boolean(p.id)));
    } catch (err) {
      const msg = apiErrorUtils.getErrorMessage(err);
      setError(msg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, limit, vendorId, categoryId]);

  useEffect(() => {
    fetchRecentlyViewed();
  }, [fetchRecentlyViewed]);

  return {
    products,
    loading,
    error,
    isAuthenticated,
    refetch: fetchRecentlyViewed,
  };
}
