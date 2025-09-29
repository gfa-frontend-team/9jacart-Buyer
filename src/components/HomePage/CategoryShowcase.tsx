import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Baby,
  Smartphone,
  ShoppingCart,
  Heart,
  Shirt,
  Wrench,
  Phone,
  Receipt,
  Home,
} from "lucide-react";

import { Button } from "../UI/Button";
import { mockCategories } from "../../data/mockData";
import type { Category } from "../../types";

// Icon mapping for categories
const getCategoryIcon = (categoryId: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'appliances': Zap,
    'baby-products': Baby,
    'devices-accessories': Smartphone,
    'groceries': ShoppingCart,
    'health': Heart,
    'laundry': Shirt,
    'fashion': Shirt,
    'services': Wrench,
    'mobile-topup': Phone,
    'bills': Receipt,
  };

  return iconMap[categoryId] || Home;
};

// Transform mock categories to include icons and featured status
const transformCategories = (categories: Category[]) => {
  return categories
    .filter(cat => cat.level === 1) // Only show top-level categories
    .map((category, index) => ({
      ...category,
      icon: getCategoryIcon(category.id),
      featured: index === 2, // Make the 3rd category (Devices & Accessories) featured
    }));
};

// Get transformed categories
const categories = transformCategories(mockCategories);

const CategoryShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 6; // Show 6 items at a time on desktop
  const maxIndex = Math.max(0, categories.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-8 bg-primary rounded-sm"></div>
            <div>
              <p className="text-primary font-semibold text-sm mb-1">Categories</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Browse By Category</h2>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="rounded-full w-10 h-10 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className="rounded-full w-10 h-10 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Categories Container */}
        <div className="relative overflow-hidden">
          {/* Desktop View - Sliding Grid */}
          <div className="hidden sm:block">
            <div
              className="flex transition-transform duration-300 ease-in-out gap-4"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className={`flex-shrink-0 w-[calc(100%/6-1rem)] group ${
                      category.featured ? 'order-first' : ''
                    }`}
                  >
                    <div
                      className={`
                        relative p-6 rounded-lg border-2 transition-all duration-300 h-32 flex flex-col items-center justify-center
                        ${category.featured 
                          ? 'bg-primary border-primary text-white shadow-lg' 
                          : 'bg-white border-gray-200 hover:border-primary hover:shadow-md group-hover:bg-gray-50'
                        }
                      `}
                    >
                      <IconComponent
                        className={`
                          w-8 h-8 mb-3 transition-transform duration-300 group-hover:scale-110
                          ${category.featured ? 'text-white' : 'text-gray-600 group-hover:text-primary'}
                        `}
                      />
                      <span
                        className={`
                          text-sm font-medium text-center
                          ${category.featured ? 'text-white' : 'text-gray-900 group-hover:text-primary'}
                        `}
                      >
                        {category.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile View - Horizontal Scroll */}
          <div className="sm:hidden">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="flex-shrink-0 group"
                  >
                    <div
                      className={`
                        relative p-4 rounded-lg border-2 transition-all duration-300 w-24 h-24 flex flex-col items-center justify-center
                        ${category.featured 
                          ? 'bg-primary border-primary text-white shadow-lg' 
                          : 'bg-white border-gray-200 hover:border-primary hover:shadow-md'
                        }
                      `}
                    >
                      <IconComponent
                        className={`
                          w-6 h-6 mb-1 transition-transform duration-300 group-hover:scale-110
                          ${category.featured ? 'text-white' : 'text-gray-600 group-hover:text-primary'}
                        `}
                      />
                      <span
                        className={`
                          text-xs font-medium text-center leading-tight
                          ${category.featured ? 'text-white' : 'text-gray-900 group-hover:text-primary'}
                        `}
                      >
                        {category.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="sm:hidden flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(categories.length / 4) }).map(
            (_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / 4) === index
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index * 4)}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;