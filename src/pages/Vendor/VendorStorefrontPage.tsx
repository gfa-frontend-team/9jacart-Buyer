import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, Loading, Alert, Image, Badge } from "../../components/UI";
import { ProductCard } from "@/components/Product";
import { useRealProductsList } from "../../hooks/api/useRealProducts";
import { normalizeProductImages } from "../../lib/utils";

const VendorStorefrontPage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  
  // Fetch all products (we'll filter by vendorId client-side)
  const { products, loading, error } = useRealProductsList({ 
    page: 1, 
    perPage: 1000, // Fetch a large number to get all vendor products
  });

  // Filter products by vendorId and get vendor info from first product
  const { vendorProducts, vendorInfo } = useMemo(() => {
    if (!vendorId || !products.length) {
      return { vendorProducts: [], vendorInfo: null };
    }

    const filtered = products.filter((product) => product.vendorId === vendorId);
    
    if (filtered.length === 0) {
      return { vendorProducts: [], vendorInfo: null };
    }

    // Get vendor info from the first product
    const firstProduct = filtered[0];
    const vendorInfo = {
      name: firstProduct.storeName || 'Unknown Vendor',
      logo: firstProduct.vendorLogo,
    };

    return { vendorProducts: filtered, vendorInfo };
  }, [vendorId, products]);

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

  if (!vendorId) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" title="Error">
            Vendor ID is required
          </Alert>
        </div>
      </div>
    );
  }

  if (vendorProducts.length === 0) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb className="mb-6" />
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found for this vendor</p>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Vendor", href: "#" },
    { label: vendorInfo?.name || "Store", isCurrentPage: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Vendor Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Vendor Logo */}
            {vendorInfo?.logo ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                <Image
                  src={vendorInfo.logo}
                  alt={vendorInfo.name}
                  className="w-full h-full object-cover"
                  onError={() => {
                    console.warn('Vendor logo failed to load:', vendorInfo.logo);
                  }}
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  {vendorInfo?.name ? vendorInfo.name.charAt(0).toUpperCase() : 'V'}
                </span>
              </div>
            )}

            {/* Vendor Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {vendorInfo?.name || 'Vendor Store'}
              </h1>
              <p className="text-gray-600 mb-3">
                {vendorProducts.length} product{vendorProducts.length !== 1 ? 's' : ''} available
              </p>
              <Badge variant="success" className="inline-flex">
                Verified Vendor
              </Badge>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-4 h-8 bg-primary rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {vendorProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={normalizeProductImages(product)}
                className="group cursor-pointer hover:shadow-lg transition-shadow"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorStorefrontPage;

