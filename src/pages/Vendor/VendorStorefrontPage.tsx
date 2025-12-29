import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, Loading, Alert, Image, Button, Input } from "../../components/UI";
import { ProductCard } from "@/components/Product";
import { useRealProductsList } from "../../hooks/api/useRealProducts";
import { useAllRealCategories } from "../../hooks/api/useRealCategories";
import { normalizeProductImages } from "../../lib/utils";
import { useNotificationContext } from "../../providers/NotificationProvider";
import { 
  Star, 
  Search, 
  ChevronDown, 
  ArrowUpDown, 
  Copy, 
  CheckCircle2
} from "lucide-react";

const VendorStorefrontPage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("default");
  const { showNotification } = useNotificationContext();
  
  // Fetch all products (we'll filter by vendorId client-side)
  const { products, loading, error } = useRealProductsList({ 
    page: 1, 
    perPage: 1000, // Fetch a large number to get all vendor products
  });

  // Fetch categories from API
  const { getMainCategories, loading: categoriesLoading } = useAllRealCategories();
  const mainCategories = getMainCategories();

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

  // Filter and sort products based on search, category, and sort options
  const filteredProducts = useMemo(() => {
    let filtered = [...vendorProducts];

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All Categories") {
      const selectedCat = mainCategories.find(cat => cat.name === selectedCategory);
      if (selectedCat) {
        filtered = filtered.filter((product) => 
          product.categoryId === selectedCat.id
        );
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => (a.price?.current || 0) - (b.price?.current || 0));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => (b.price?.current || 0) - (a.price?.current || 0));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [vendorProducts, searchQuery, selectedCategory, sortBy, mainCategories]);

  // Copy storefront link to clipboard
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showNotification("Storefront link copied to clipboard!", "success", 3000);
    }).catch(() => {
      showNotification("Failed to copy link. Please try again.", "error", 3000);
    });
  };


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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left Side: Vendor Info */}
            <div className="flex items-start gap-4 flex-1">
              {/* Vendor Avatar */}
              {vendorInfo?.logo ? (
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
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
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
                  <span className="text-gray-400 text-2xl font-bold">
                    {vendorInfo?.name ? vendorInfo.name.charAt(0).toUpperCase() : 'V'}
                  </span>
                </div>
              )}

              {/* Vendor Details */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {vendorInfo?.name || 'Vendor Store'}
                </h1>
                
                {/* Rating and Reviews */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0</span>
                  <span className="text-sm text-gray-500">(144 Reviews)</span>
                </div>

                {/* Verified Badge */}
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Verified</span>
                </div>
              </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="flex items-center gap-2 border-2"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy Storefront Link</span>
                <span className="sm:hidden">Copy Link</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Products ({filteredProducts.length})
          </h2>
        </div>

        {/* Navigation Bar: Categories, Search, Sort */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Categories Dropdown */}
            <div className="relative flex-shrink-0 z-20">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto min-w-[160px] px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10 z-20"
                disabled={categoriesLoading}
              >
                <option>All Categories</option>
                {mainCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 border border-gray-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Sort Button */}
            <Button
              variant="outline"
              onClick={() => {
                // Toggle sort options or open sort menu
                const options = ["default", "price-low", "price-high", "name"];
                const currentIndex = options.indexOf(sortBy);
                setSortBy(options[(currentIndex + 1) % options.length]);
              }}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort by</span>
            </Button>
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <h2 className="text-xl font-bold text-gray-900">Best Sellers</h2>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={normalizeProductImages(product)}
                  className="group cursor-pointer hover:shadow-lg transition-shadow"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery ? "No products found matching your search" : "No products available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorStorefrontPage;

