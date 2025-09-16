import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import {
  Star,
  Heart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  
  ShoppingCart,
} from "lucide-react";
import {
  Breadcrumb,
  Button,
  Badge,
  Card,
  CardContent,
  Loading,
  Alert,
  Image,
} from "../../components/UI";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import { mockProducts, mockApi } from "../../data/mockData";
import type { Product } from "../../types";
import { cn } from "../../lib/utils";
import { ProductCard } from "@/components/Product";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isItemInWishlist } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  
  const isWishlisted = product ? isItemInWishlist(product.id) : false;

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const productData = await mockApi.getProduct(id);
        setProduct(productData);

        // Set default selections
        if (productData.variants) {
          const colorVariant = productData.variants.find(
            (v) => v.type === "color"
          );
          if (colorVariant && colorVariant.options.length > 0) {
            setSelectedColor(colorVariant.options[0].id);
          }

          const sizeVariant = productData.variants.find(
            (v) => v.type === "size"
          );
          if (sizeVariant && sizeVariant.options.length > 0) {
            setSelectedSize(sizeVariant.options[0].id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        )}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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

  if (error || !product) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" title="Error">
            {error || "Product not found"}
          </Alert>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Categories", href: "/products" },
    { label: "Gaming", href: "/category/electronics" },
    { label: product.name, isCurrentPage: true },
  ];

  const colorVariant = product.variants?.find((v) => v.type === "color");
  const sizeVariant = product.variants?.find((v) => v.type === "size");
  const currentPrice =
    typeof product.price === "number" ? product.price : product.price.current;
  const originalPrice =
    typeof product.price === "object" ? product.price.original : undefined;
  const discount =
    typeof product.price === "object" ? product.price.discount : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg border overflow-hidden">
              <Image
                src={
                  product.images.gallery[selectedImage] || product.images.main
                }
                alt={product.images.alt}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {product.images.gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 bg-white rounded-lg border-2 overflow-hidden",
                    selectedImage === index
                      ? "border-primary"
                      : "border-gray-200"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Seller */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">LP</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">La Porsh Footies</p>
                  <p className="text-sm text-gray-500">Lagos, Nigeria</p>
                </div>
                <Badge variant="success" className="ml-2">
                  Verified
                </Badge>
              </div>
            </div>

            {/* Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(product.reviews.average)}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews.total} Reviews)
              </span>
              <Badge variant="success" className="ml-2">
                In Stock
              </Badge>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(currentPrice)}
                </span>
                {originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {discount && (
                  <Badge variant="destructive">-{discount.percentage}%</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {product.shortDescription ||
                  product.description.substring(0, 100) + "..."}
              </p>
            </div>

            {/* Colors */}
            {colorVariant && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Colours:</h3>
                <div className="flex gap-2">
                  {colorVariant.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedColor(option.id)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        selectedColor === option.id
                          ? "border-gray-900 scale-110"
                          : "border-gray-300"
                      )}
                      style={{ backgroundColor: option.hex }}
                      title={option.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizeVariant && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Size:</h3>
                <div className="flex gap-2">
                  {sizeVariant.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedSize(option.id)}
                      className={cn(
                        "px-4 py-2 border rounded-md text-sm font-medium transition-colors",
                        selectedSize === option.id
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      )}
                    >
                      {option.value.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    if (product) {
                      if (isWishlisted) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist(product);
                      }
                    }
                  }}
                  className={cn(
                    "px-4",
                    isWishlisted && "text-red-500 border-red-500"
                  )}
                >
                  <Heart
                    className={cn("w-5 h-5", isWishlisted && "fill-current")}
                  />
                </Button>
              </div>
            </div>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-sm text-gray-600">
                      Enter your postal code for Delivery Availability.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Return Delivery</p>
                    <p className="text-sm text-gray-600">
                      Free 30 Days Delivery Returns. Details
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Items */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-4 h-8 bg-primary rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Related Item</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockProducts.slice(0, 4).map((relatedProduct) => {
              return (
                // <Card key={relatedProduct.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                //   <CardContent className="p-0">
                //     <div className="relative">
                //       {relatedDiscount && (
                //         <Badge
                //           variant="destructive"
                //           className="absolute top-2 left-2 z-10"
                //         >
                //           -{relatedDiscount.percentage}%
                //         </Badge>
                //       )}

                //       <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                //         <Button size="icon" variant="outline" className="w-8 h-8 bg-white">
                //           <Heart className="w-4 h-4" />
                //         </Button>
                //         <Button size="icon" variant="outline" className="w-8 h-8 bg-white">
                //           <Eye className="w-4 h-4" />
                //         </Button>
                //       </div>

                //       <div className="aspect-square bg-gray-100 overflow-hidden">
                //         <Image
                //           src={relatedProduct.images.main}
                //           alt={relatedProduct.images.alt}
                //           className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                //         />
                //       </div>

                //       <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                //         <Button
                //           variant="ghost"
                //           className="w-full text-white hover:bg-white hover:text-black"
                //           onClick={() => addItem(relatedProduct, 1)}
                //         >
                //           <ShoppingCart className="w-4 h-4 mr-2" />
                //           Add To Cart
                //         </Button>
                //       </div>
                //     </div>

                //     <div className="p-4 space-y-2">
                //       <Link
                //         to={`/products/${relatedProduct.id}`}
                //         className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2"
                //       >
                //         {relatedProduct.name}
                //       </Link>

                //       <div className="flex items-center gap-2">
                //         <span className="font-bold text-red-500">
                //           {formatPrice(relatedPrice)}
                //         </span>
                //         {relatedOriginal && (
                //           <span className="text-gray-500 line-through text-sm">
                //             {formatPrice(relatedOriginal)}
                //           </span>
                //         )}
                //       </div>

                //       <div className="flex items-center gap-1">
                //         {renderStars(relatedProduct.reviews.average)}
                //         <span className="text-sm text-gray-600 ml-1">
                //           ({relatedProduct.reviews.total})
                //         </span>
                //       </div>
                //     </div>
                //   </CardContent>
                // </Card>
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  className="group cursor-pointer hover:shadow-lg transition-shadow"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
