import CountdownTimer from "./CountdownTimer";

import SectionHeader from "../UI/SectionHeader";
import { mockProducts } from "@/data/mockData";
import { ProductCard } from "../Product";
import { Button } from "../UI";
import { Link } from "react-router-dom";

export default function FlashSales() {
  // Get products with discounts for flash sales
  const flashSaleProducts = mockProducts
    .filter((product) => product.price.discount)
    .slice(0, 4);

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-10 mb-8">
          <div className="flex-shrink-0">
            <SectionHeader title="Today's" text="Flash Sales" />
          </div>

          {/* Countdown Timer - Responsive positioning */}
          <div className="flex justify-center lg:justify-start">
            {/* <div className="bg-gray-100 rounded-xl p-3 sm:p-4"> */}
             
              <CountdownTimer targetDate={new Date("2025-12-31T23:59:59Z")} />
            {/* </div> */}
          </div>
        </div>

        {/* Product Grid - Improved responsive layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:grid-cols-4  sm:gap-4">
          {flashSaleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              // size="sm"
              className="w-full"
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <Link to="/products">
            <Button className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
