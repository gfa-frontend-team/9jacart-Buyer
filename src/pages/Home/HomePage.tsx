import FlashSales from "@/components/HomePage/FlashSales";
import HeroSection from "@/components/HomePage/HeroSection";
import FeaturedProducts from "@/components/HomePage/FeaturedProducts";
import LiveProducts from "@/components/HomePage/LiveProducts";
import CategoryShowcase from "@/components/HomePage/CategoryShowcase";
import FastSelling from "@/components/HomePage/FastSelling";
import RecentlyViewedProductsSection from "@/components/HomePage/RecentlyViewedProductsSection";
import { useAuthStore } from "@/store/useAuthStore";
// import Newsletter from "@/components/HomePage/Newsletter";
import React from "react";
import { Helmet } from "react-helmet-async";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-white min-h-screen max-w-[960px] lg:max-w-7xl 2xl:max-w-[1550px] mx-auto">
      <Helmet>
        <title>9ja-cart - Buy and Sell Online in Nigeria</title>
        <meta name="description" content="Welcome to 9ja-cart. Shop the best headsets, keyboards, and electronics with fast delivery." />
        <link rel="icon" type="image/svg+xml" href="/9Jacart Icon SVG.svg" />
      </Helmet>
      {/* Hero Section */}
      <HeroSection />

      {/* 1. Flash Sales */}
      <FlashSales />

      {/* 2. Featured Picks */}
      <FeaturedProducts />

      {/* 3. All Products */}
      <LiveProducts />

      {/* 4. Shop by Category */}
      <CategoryShowcase />

      {/* 5. Fast Selling */}
      <FastSelling />

      {/* 6. Recently Viewed - only when signed in */}
      {isAuthenticated && (
        <RecentlyViewedProductsSection variant="section" />
      )}

      {/* Newsletter Subscription */}
      {/* <Newsletter /> */}
    </div>
  );
};

export default HomePage;
