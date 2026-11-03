import { useMemo } from "react";
import { useAllRealCategories } from "./useRealCategories";
import { useBuyerActiveProductsList } from "./useRealProducts";
import type { Category } from "../../types";

/**
 * Top-level categories (from GET /product/category) that actually have active products,
 * so buyers never tap into an empty category from the menus. Counts come from the
 * shared, session-cached active-products list. Until that list loads (or if it fails),
 * every category is returned unchanged.
 */
export function useShoppableCategories() {
  const { categories, loading, error } = useAllRealCategories();
  const { allProducts, loading: productsLoading } = useBuyerActiveProductsList({});

  const productCountByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of allProducts) {
      if (!product.categoryId) continue;
      counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
    }
    return counts;
  }, [allProducts]);

  const mainCategories = useMemo(() => {
    const main = categories.filter((cat) => cat.level === 1 && !cat.archived);
    if (allProducts.length === 0) return main; // counts unknown yet: don't hide anything

    const hasProducts = (cat: Category) =>
      (productCountByCategory.get(cat.id) ?? 0) > 0 ||
      categories.some(
        (child) => child.parentId === cat.id && (productCountByCategory.get(child.id) ?? 0) > 0
      );
    return main.filter(hasProducts);
  }, [categories, allProducts.length, productCountByCategory]);

  return {
    categories,
    mainCategories,
    productCountByCategory,
    loading: loading || (productsLoading && allProducts.length === 0),
    error,
  };
}
