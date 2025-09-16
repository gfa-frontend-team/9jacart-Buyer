import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockCategories } from '../../data/mockData';
import SectionHeader from '../UI/SectionHeader';

const CategoryShowcase: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <SectionHeader title="Browse by" text="Categories" />
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl mx-auto">
            Find exactly what you're looking for in our carefully organized product categories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {mockCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-[4/3] sm:aspect-[3/2] relative overflow-hidden">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl mb-2 group-hover:text-primary-foreground transition-colors">
                    {category.name}
                  </h3>
                  
                  <div className="flex items-center text-white/90 group-hover:text-white transition-colors">
                    <span className="text-sm sm:text-base font-medium">Shop Now</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm sm:text-base group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;