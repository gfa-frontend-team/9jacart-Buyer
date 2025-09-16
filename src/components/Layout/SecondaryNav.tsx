import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SecondaryNav: React.FC = () => {
  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Garden', slug: 'home-garden' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Books', slug: 'books' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Automotive', slug: 'automotive' },
  ];

  return (
    <nav className="bg-muted text-muted-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-6 py-2 overflow-x-auto">
          {/* All Categories */}
          <Link
            to="/products"
            className="flex items-center whitespace-nowrap text-sm hover:text-primary transition-colors py-1"
          >
            <span className="font-medium">All</span>
          </Link>

          {/* Category Links */}
          {categories.map((category, index) => (
            <React.Fragment key={category.slug}>
              <Link
                to={`/category/${category.slug}`}
                className="whitespace-nowrap text-sm hover:text-primary transition-colors py-1"
              >
                {category.name}
              </Link>
              {index < categories.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}

          {/* Special Links */}
          <div className="flex items-center space-x-6 ml-auto">
            <Link
              to="/deals"
              className="whitespace-nowrap text-sm text-primary hover:text-primary/80 transition-colors py-1 font-medium"
            >
              Today's Deals
            </Link>
            <Link
              to="/new-arrivals"
              className="whitespace-nowrap text-sm hover:text-primary transition-colors py-1"
            >
              New Arrivals
            </Link>
            <Link
              to="/bestsellers"
              className="whitespace-nowrap text-sm hover:text-primary transition-colors py-1"
            >
              Best Sellers
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SecondaryNav;