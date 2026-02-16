import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumb, Loading, Alert } from "../../components/UI";
import ProductCard from "../../components/Product/ProductCard";
import CategoriesSidebar from "../../components/HomePage/CategoriesSidebar";
import RecentlyViewedProductsSection from "../../components/HomePage/RecentlyViewedProductsSection";
import { useRealProductsList } from "../../hooks/api/useRealProducts";
import { useAllRealCategories } from "../../hooks/api/useRealCategories";
import { normalizeProductImages } from "@/lib/utils";
import Container from "@/components/Layout/Container";

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const { products, loading, error, pagination, refetch } = useRealProductsList(
    {
      page: currentPage,
      perPage,
      search: query,
    }
  );

  const { categories, loading: categoriesLoading, error: categoriesError } = useAllRealCategories();

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    refetch({
      page: currentPage,
      perPage,
      ...(query && { search: query }),
    });
  }, [query, currentPage]);

  const isInitialLoad = loading && products.length === 0;

  if (error) {
    return (
      <Container className="min-h-screen p-6">
        <div className=" mx-auto">
          <Alert variant="destructive" title="Error">
            {error}
          </Alert>
        </div>
      </Container>
    );
  }

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
                  {products.length} active product
                  {products.length !== 1 ? "s" : ""}
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
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <p className="text-gray-500 text-lg">
                      {query
                        ? `No products found for "${query}"`
                        : "Enter a search term to find products"}
                    </p>
                    {query && (
                      <p className="text-gray-400 mt-2">
                        Try different keywords or browse all products
                      </p>
                    )}
                  </div>
                </div>
                {/* Recently Viewed when search has no results (no category = global) */}
                <RecentlyViewedProductsSection variant="inline" />
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SearchResultsPage;
