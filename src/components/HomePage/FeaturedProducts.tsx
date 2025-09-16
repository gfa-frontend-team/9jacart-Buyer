import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../UI/Button';

import { mockProducts } from '../../data/mockData';
import { ProductCard } from '../Product';
import SectionHeader from '../UI/SectionHeader';

const FeaturedProducts: React.FC = () => {
  // Get featured products
  const featuredProducts = mockProducts
    .filter(product => product.flags.featured)
    .slice(0, 8);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <SectionHeader title="Our Products" text="Featured Products" />
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
              Discover our handpicked selection of premium products, carefully chosen for their quality and value.
            </p>
          </div>
          
          <Link to="/products">
            <Button variant="outline" className="flex items-center gap-2 group">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              className="w-full"
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <Link to="/products">
            <Button size="lg" className="px-6 sm:px-8">
              Explore All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;