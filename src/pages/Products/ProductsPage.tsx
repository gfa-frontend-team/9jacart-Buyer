import React from 'react';
import { Breadcrumb, Loading, Alert } from '../../components/UI';
import ProductCard from '../../components/Product/ProductCard';
import { useProductList } from '../../hooks/useProducts';

const ProductsPage: React.FC = () => {
  const { 
    products, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery,
    totalCount 
  } = useProductList();

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-600 mt-1 sm:mt-2">
              Showing {totalCount} product{totalCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Search */}
          <div className="w-full sm:w-auto sm:max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                showQuickAdd={true}
                className="w-full"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
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

export default ProductsPage;