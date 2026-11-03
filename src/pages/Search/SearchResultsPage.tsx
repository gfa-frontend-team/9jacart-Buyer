import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumb, Loading, ErrorState } from "../../components/UI";
import ProductCard from "../../components/Product/ProductCard";
import CategoriesSidebar from "../../components/HomePage/CategoriesSidebar";
import DiscoverMore from "../../components/Product/DiscoverMore";
import { useRealProductsList } from "../../hooks/api/useRealProducts";
import { addRecentSearch } from "@/lib/recentSearches";
import { useAllRealCategories } from "../../hooks/api/useRealCategories";
import { normalizeProductImages } from "@/lib/utils";
import Container from "@/components/Layout/Container";

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  // The search endpoint (/product/items?search=) ignores category filters and the
  // category endpoint ignores search, so with a category we fetch the search
  // results in one batch and keep only that category's products.
  const CATEGORY_SEARCH_BATCH = 100;
  const fetchParams = category
    ? { page: 1, perPage: CATEGORY_SEARCH_BATCH, ...(query && { search: query }) }
    : { page: currentPage, perPage, ...(query && { search: query }) };

  const {
    products: fetchedProducts,
    loading,
    error,
    pagination: serverPagination,
    refetch,
  } = useRealProductsList(fetchParams);

  const { categories, loading: categoriesLoading, error: categoriesError } = useAllRealCategories();

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, category]);

  useEffect(() => {
    if (query) addRecentSearch(query);
  }, [query]);

  useEffect(() => {
    refetch(fetchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, category ? 1 : currentPage]);

  const categoryMatches = useMemo(() => {
    if (!category) return [];
    const allowed = new Set([
      category,
      ...categories.filter((c) => c.parentId === category).map((c) => c.id),
    ]);
    return fetchedProducts.filter((p) => allowed.has(p.categoryId));
  }, [category, categories, fetchedProducts]);

  const products = category
    ? categoryMatches.slice((currentPage - 1) * perPage, currentPage * perPage)
    : fetchedProducts;
  const totalResults = category ? categoryMatches.length : serverPagination.totalItems || products.length;
  const pagination = category
    ? {
        currentPage,
        totalPages: Math.max(1, Math.ceil(categoryMatches.length / perPage)),
      }
    : serverPagination;

  const isInitialLoad = loading && products.length === 0;

  if (error) {
    return (
      <Container className="min-h-screen p-6">
        <div className=" mx-auto">
          <ErrorState error={error} />
        </div>
      </Container>
    );
  }

  const categoryName = category
    ? categories.find((c) => c.id === category)?.name
    : undefined;

  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    { label: `Search: "${query}"`, isCurrentPage: true },
  ];

  return (
    <Container className="min-h-screen p-6">
      <div className=" mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Search Results
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2">
              {query ? (
                <>
                  Results for "<span className="font-medium">{query}</span>" -{" "}
                  {totalResults} active product
                  {totalResults !== 1 ? "s" : ""}
                  {categoryName && (
                    <>
                      {" "}in <span className="font-medium">{categoryName}</span>
                    </>
                  )}
                </>
              ) : (
                "Enter a search term to find products"
              )}
            </p>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-start">
          {/* Categories Sidebar */}
          {categoriesLoading ? (
            <div className="hidden lg:block lg:col-span-1 pr-4 lg:pr-6">
              <div className="sticky top-4 flex items-center justify-center py-8">
                <Loading size="sm" />
              </div>
            </div>
          ) : categoriesError ? (
            <div className="hidden lg:block lg:col-span-1 pr-4 lg:pr-6">
              <div className="sticky top-4 text-center py-8">
                <p className="text-sm text-gray-500">Categories unavailable</p>
              </div>
            </div>
          ) : (
            <CategoriesSidebar categories={categories} />
          )}

          {/* Products Content */}
          <div className="lg:col-span-3 xl:col-span-4">
            {isInitialLoad ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loading size="lg" />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={normalizeProductImages(product)}
                      showQuickAdd={true}
                      className="w-full"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      disabled={currentPage <= 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <button
                      onClick={() => {
                        if (currentPage < pagination.totalPages) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      disabled={currentPage >= pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <p className="text-gray-500 text-lg">
                      {query
                        ? `No products found for "${query}"${categoryName ? ` in ${categoryName}` : ""}`
                        : "Enter a search term to find products"}
                    </p>
                  </div>
                </div>
                <DiscoverMore title="You might like these" />
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SearchResultsPage;
