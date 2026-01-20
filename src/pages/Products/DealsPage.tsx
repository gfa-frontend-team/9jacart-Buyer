import React, { useState, useMemo } from 'react';
import { Breadcrumb, Loading, Alert } from '../../components/UI';
import ProductCard from '../../components/Product/ProductCard';
import { useRealProductsList } from '../../hooks/api/useRealProducts';
import { normalizeProductImages } from '@/lib/utils';

const DealsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 50; // Fetch more to filter for deals

  const { 
    products: allProducts, 
    loading, 
    error, 
    refetch 
  } = useRealProductsList({ 
    page: currentPage, 
    perPage,
    ...(searchQuery && { search: searchQuery })
  });

  // Filter products that have discounts
  const dealsProducts = useMemo(() => {
    return allProducts.filter(product => product.price.discount !== undefined);
  }, [allProducts]);

  // Paginate filtered deals
  const paginatedDeals = useMemo(() => {
    const startIndex = (currentPage - 1) * 12;
    const endIndex = startIndex + 12;
    return dealsProducts.slice(startIndex, endIndex);
  }, [dealsProducts, currentPage]);

  const totalDealsPages = Math.ceil(dealsProducts.length / 12);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loading size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" title="Error">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6" />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Today's Deals</h1>
            <p className="text-gray-600 mt-1 sm:mt-2">
              {dealsProducts.length > 0 
                ? `Showing ${paginatedDeals.length} of ${dealsProducts.length} deal${dealsProducts.length !== 1 ? 's' : ''}`
                : 'No deals available at the moment'
              }
            </p>
          </div>
          
          {/* Search */}
          <div className="w-full sm:w-auto sm:max-w-md">
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  refetch({ page: 1, perPage, search: searchQuery });
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products Grid */}
        {paginatedDeals.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {paginatedDeals.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={normalizeProductImages(product)}
                  showQuickAdd={true}
                  className="w-full"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalDealsPages > 1 && (
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
                  Page {currentPage} of {totalDealsPages}
                </span>
                
                <button
                  onClick={() => {
                    if (currentPage < totalDealsPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  disabled={currentPage >= totalDealsPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No deals found</p>
            {searchQuery && (
              <p className="text-gray-400 mt-2">
                Try adjusting your search terms
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;



