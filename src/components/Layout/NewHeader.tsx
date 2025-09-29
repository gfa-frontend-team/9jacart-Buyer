import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  Globe,
} from "lucide-react";
import { Button } from "../UI/Button";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import useClickOutside from "../../hooks/useClickOutside";
import logoImage from "../../assets/logo.png";

const NewHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { getTotalItems: getWishlistItems } = useWishlistStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Click outside handlers
  const accountMenuRef = useClickOutside<HTMLDivElement>(() =>
    setShowAccountMenu(false)
  );
  const mobileMenuRef = useClickOutside<HTMLDivElement>(() =>
    setShowMobileMenu(false)
  );

  const categories = [
    "All",
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive",
  ];

  const totalItems = getTotalItems();
  const wishlistItems = getWishlistItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set("q", searchQuery.trim());
      if (selectedCategory !== "All") {
        searchParams.set("category", selectedCategory.toLowerCase());
      }
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
    navigate("/");
  };

  return (
    <header className="bg-[#182F38] text-secondary-foreground shadow-sm border-b border-border">
      {/* Main Header */}
      <div className="px-2 sm:px-4 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto">
          {/* Top row for mobile - Logo and essential actions */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 lg:hidden mb-2">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-secondary-foreground hover:bg-secondary/80 flex-shrink-0"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Logo - Centered on mobile */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={logoImage} alt="9ja-cart" className="h-6 sm:h-8 w-auto" />
            </Link>

            {/* Mobile Right Actions */}
            <div className="flex items-center gap-1">
              {/* Account Section - Mobile */}
              <div className="relative" ref={accountMenuRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-secondary/80"
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                >
                  <User className="w-5 h-5" />
                </Button>

                {/* Account Dropdown */}
                {showAccountMenu && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-popover text-popover-foreground rounded-md shadow-lg border border-border z-50">
                    {isAuthenticated ? (
                      <div className="p-4">
                        <div className="border-b border-border pb-3 mb-3">
                          <p className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Link
                            to="/account"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Your Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Your Orders
                          </Link>
                          <Link
                            to="/wishlist"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Your Wishlist {wishlistItems > 0 && `(${wishlistItems})`}
                          </Link>
                          <Link
                            to="/account"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Account Settings
                          </Link>
                          <hr className="my-2 border-border" />
                          <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="space-y-3">
                          <Button
                            asChild
                            className="w-full"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            <Link to="/auth/login">Sign In</Link>
                          </Button>
                          <p className="text-sm text-muted-foreground text-center">
                            New customer?{" "}
                            <Link
                              to="/auth/register"
                              className="text-primary hover:underline"
                              onClick={() => setShowAccountMenu(false)}
                            >
                              Start here
                            </Link>
                          </p>
                        </div>
                        <hr className="my-3 border-border" />
                        <div className="space-y-1 text-sm">
                          <Link
                            to="/orders"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Your Orders
                          </Link>
                          <Link
                            to="/contact"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Customer Service
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-white hover:bg-none relative"
              >
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium text-[10px]">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={logoImage} alt="9ja-cart" className="h-8 w-auto" />
            </Link>

            {/* Delivery Location */}
            <div className="flex items-center text-sm hover:bg-[#182F38]/80 px-3 py-2 rounded-md cursor-pointer transition-colors flex-shrink-0">
              <MapPin className="w-6 h-6 mr-2 text-white" />
              <div className="text-white">
                <div className="text-xs">Deliver to</div>
                <div className="font-medium">Nigeria</div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl min-w-0">
              <div className="flex rounded-md overflow-hidden bg-background">
                {/* Category Dropdown */}
                <div className="relative flex-shrink-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={cn(
                      "bg-[#8DEB6E] text-foreground px-3 py-2",
                      "appearance-none pr-8 w-[100px]"
                    )}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className={cn(
                    "flex-1 px-4 py-2 bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring min-w-0"
                  )}
                />

                {/* Search Button */}
                <Button
                  type="submit"
                  className="rounded-none px-4 text-primary py-2 bg-[#8DEB6E] hover:bg-[#8DEB6E] flex-shrink-0"
                  size="default"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </form>

            {/* Right Side Items */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Language Selector */}
              <div className="flex text-white items-center text-sm hover:bg-none px-3 py-2 rounded-md cursor-pointer transition-colors">
                <Globe className="w-4 h-4 mr-2" />
                <span>EN</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </div>

              {/* Account Section */}
              <div className="relative" ref={accountMenuRef}>
                <Button
                  variant="ghost"
                  className="flex items-center text-sm text-white hover:text-primary hover:bg-white px-3 py-2"
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                >
                  {isAuthenticated ? (
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      <div className="text-left">
                        <div className="text-xs ">
                          Hello, {user?.firstName}
                        </div>
                        <div className="font-medium">Account & Lists</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      <div className="text-left">
                        <div className="text-xs ">Hello, Sign in</div>
                        <div className="font-medium">Account & Lists</div>
                      </div>
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>

                {/* Account Dropdown - Same as mobile */}
                {showAccountMenu && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-popover text-popover-foreground rounded-md shadow-lg border border-border z-50">
                    {isAuthenticated ? (
                      <div className="p-4">
                        <div className="border-b border-border pb-3 mb-3">
                          <p className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Link
                            to="/account"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Your Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Your Orders
                          </Link>
                          <Link
                            to="/wishlist"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Your Wishlist {wishlistItems > 0 && `(${wishlistItems})`}
                          </Link>
                          <Link
                            to="/account"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Account Settings
                          </Link>
                          <hr className="my-2 border-border" />
                          <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="space-y-3">
                          <Button
                            asChild
                            className="w-full"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            <Link to="/auth/login">Sign In</Link>
                          </Button>
                          <p className="text-sm text-muted-foreground text-center">
                            New customer?{" "}
                            <Link
                              to="/auth/register"
                              className="text-primary hover:underline"
                              onClick={() => setShowAccountMenu(false)}
                            >
                              Start here
                            </Link>
                          </p>
                        </div>
                        <hr className="my-3 border-border" />
                        <div className="space-y-1 text-sm">
                          <Link
                            to="/orders"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Your Orders
                          </Link>
                          <Link
                            to="/contact"
                            className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            Customer Service
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Orders */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  asChild
                  className="flex items-center text-sm text-white hover:bg-white px-3 py-2"
                >
                  <Link to="/orders">
                    <div className="text-left">
                      <div className="text-xs ">Returns</div>
                      <div className="font-medium">& Orders</div>
                    </div>
                  </Link>
                </Button>
              )}

              {/* Cart */}
              <Link to="/cart" className="flex items-center">
                <Button
                  variant="ghost"
                  asChild
                  className="flex items-center text-white hover:bg-none px-3 py-2 relative"
                >
                  <div>
                    <ShoppingCart className="w-6 h-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#8DEB6E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {totalItems > 99 ? "99+" : totalItems}
                      </span>
                    )}
                    <span className="ml-2 font-medium">Cart</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile/Tablet Search Bar */}
          <div className="lg:hidden">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex rounded-md overflow-hidden bg-background">
                {/* Category Dropdown - Mobile */}
                <div className="relative flex-shrink-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={cn(
                      "bg-[#8DEB6E] text-foreground px-2 sm:px-3 py-2 text-xs sm:text-sm",
                      "appearance-none pr-6 sm:pr-8"
                    )}
                  >
                    {categories.slice(0, 4).map((category) => (
                      <option key={category} value={category}>
                        {category === "Home & Garden" ? "Home" : category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Search Input - Mobile */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className={cn(
                    "flex-1 px-2 sm:px-4 py-2 bg-background text-foreground text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-ring min-w-0"
                  )}
                />

                {/* Search Button - Mobile */}
                <Button
                  type="submit"
                  className="rounded-none px-2 sm:px-4 text-primary py-2 bg-[#8DEB6E] hover:bg-[#8DEB6E] flex-shrink-0"
                  size="default"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          className="lg:hidden bg-secondary/80 border-t border-border"
          ref={mobileMenuRef}
        >
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Delivery Location */}
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Deliver to Nigeria</span>
            </div>

            {/* Mobile Language */}
            <div className="flex items-center text-sm">
              <Globe className="w-4 h-4 mr-2" />
              <span>English</span>
            </div>

            {/* Mobile Navigation Links */}
            <div className="border-t border-border pt-3 space-y-2">
              <Link
                to="/services"
                className="block py-2 hover:text-primary transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Services
              </Link>
              <Link
                to="/products"
                className="block py-2 hover:text-primary transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                All Products
              </Link>
              <Link
                to="/categories"
                className="block py-2 hover:text-primary transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Categories
              </Link>
              <Link
                to="/contact"
                className="block py-2 hover:text-primary transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Customer Service
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NewHeader;