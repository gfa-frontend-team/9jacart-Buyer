import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Store
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/wishlist" className="p-2 text-gray-600 hover:text-gray-900">
              <Heart className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="p-2 text-gray-600 hover:text-gray-900 relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link to="/auth/login" className="p-2 text-gray-600 hover:text-gray-900">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-4">
          <div className="flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link to="/orders" className="text-gray-600 hover:text-gray-900">
              Orders
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;