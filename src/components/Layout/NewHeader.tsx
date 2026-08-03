import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  MapPin,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  HelpCircle,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useCart } from "../../hooks/useCart";
import { useWishlistStore } from "../../store/useWishlistStore";
import logoImage from "../../assets/logo.png";

const NewHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems: cartTotalItems } = useCart();
  const { getTotalItems: getWishlistItems } = useWishlistStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Refs for click outside detection
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Categories data with icons and subcategories
  const categories = [
    {
      id: "all",
      name: "All Categories",
      icon: "📦",
      subcategories: [],
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: "📱",
      subcategories: ["Phones", "Laptops", "Accessories", "Gaming"],
    },
    {
      id: "clothing",
      name: "Clothing",
      icon: "👕",
      subcategories: ["Men", "Women", "Kids", "Accessories"],
    },
    {
      id: "home-garden",
      name: "Home & Garden",
      icon: "🏠",
      subcategories: ["Furniture", "Decor", "Kitchen", "Garden"],
    },
    {
      id: "sports",
      name: "Sports",
      icon: "⚽",
      subcategories: ["Fitness", "Outdoor", "Team Sports", "Cycling"],
    },
    {
      id: "books",
      name: "Books",
      icon: "📚",
      subcategories: ["Fiction", "Non-Fiction", "Academic", "Children"],
    },
    {
      id: "beauty",
      name: "Beauty",
      icon: "💄",
      subcategories: ["Makeup", "Skincare", "Hair", "Fragrance"],
    },
    {
      id: "automotive",
      name: "Automotive",
      icon: "🚗",
      subcategories: ["Parts", "Accessories", "Tools", "Maintenance"],
    },
  ];

  // Search categories for dropdown
  const searchCategories = [
    "All",
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive",
  ];

  const totalItems = cartTotalItems;
  const wishlistItems = getWishlistItems();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);

  // Mobile-friendly click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Account menu
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        // Add delay on mobile to prevent immediate closing
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setTimeout(() => setShowAccountMenu(false), 100);
        } else {
          setShowAccountMenu(false);
        }
      }

      // Mobile menu - only close if clicking outside the menu
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        showMobileMenu
      ) {
        // Don't close if clicking the hamburger button
        const hamburgerButton = document.getElementById("mobile-menu-button");
        if (hamburgerButton && hamburgerButton.contains(event.target as Node)) {
          return;
        }
        setShowMobileMenu(false);
      }
    };

    if (showAccountMenu || showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showAccountMenu, showMobileMenu]);

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

  const handleAccountMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAccountMenu(!showAccountMenu);
  };

  const handleMenuItemClick = (e: React.MouseEvent, callback?: () => void) => {
    e.stopPropagation();
    setShowAccountMenu(false);
    callback?.();
  };

  const handleMobileLogout = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAccountMenu(false);
    // Small delay to ensure menu closes before logout
    setTimeout(() => {
      handleLogout();
    }, 50);
  };

  // Clear search query when navigating to homepage
  useEffect(() => {
    if (location.pathname === "/") {
      setSearchQuery("");
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        document
          .querySelector("header")
          ?.classList.add("shadow-2xl", "bg-[#182F38]/98");
      } else {
        document
          .querySelector("header")
          ?.classList.remove("shadow-2xl", "bg-[#182F38]/98");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#182F38]/95 backdrop-blur-md text-white shadow-lg border-b border-gray-700">
        {/* Main Header */}
        <div className="px-2 sm:px-4 py-2 sm:py-3">
          <div className="max-w-[960px] lg:max-w-7xl 2xl:max-w-[1550px] mx-auto">
            {/* Top row for mobile - Logo and essential actions */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 lg:hidden mb-2">
              {/* Mobile Menu Button */}
              <button
                id="mobile-menu-button"
                className="p-2 text-white hover:bg-white/10 rounded-md transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileMenu(!showMobileMenu);
                }}
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* Logo - Centered on mobile */}
              <Link to="/" className="flex items-center flex-shrink-0">
                <img src={logoImage} alt="9ja-cart" className="h-6 sm:h-8 w-auto" />
              </Link>

              {/* Mobile Right Actions */}
              <div className="flex items-center gap-1">
                {/* Account Section - Mobile */}
                {isAuthenticated ? (
                  <div className="relative" ref={accountMenuRef}>
                    <button
                      className="p-2 text-white hover:bg-white/10 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      onClick={handleAccountMenuClick}
                    >
                      <User className="w-5 h-5" />
                    </button>

                    {/* Account Dropdown */}
                    {showAccountMenu && (
                      <div
                        className="absolute right-0 top-full mt-1 w-72 bg-white text-gray-900 rounded-md shadow-xl border border-gray-200 z-[60]"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        <div className="p-4">
                          <div className="border-b border-gray-200 pb-3 mb-3">
                            <p className="font-medium text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                          <div className="space-y-1">
                            <Link
                              to="/account"
                              className="block px-3 py-3 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors min-h-[44px] flex items-center"
                              onClick={(e) => handleMenuItemClick(e)}
                            >
                              Your Profile
                            </Link>
                            <Link
                              to="/orders"
                              className="block px-3 py-3 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors min-h-[44px] flex items-center"
                              onClick={(e) => handleMenuItemClick(e)}
                            >
                              Your Orders
                            </Link>
                            <Link
                              to="/wishlist"
                              className="block px-3 py-3 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors min-h-[44px] flex items-center"
                              onClick={(e) => handleMenuItemClick(e)}
                            >
                              Your Wishlist{" "}
                              {wishlistItems > 0 && `(${wishlistItems})`}
                            </Link>
                            <Link
                              to="/contact-admin"
                              className="block px-3 py-3 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors min-h-[44px] flex items-center"
                              onClick={(e) => handleMenuItemClick(e)}
                            >
                              Contact Support
                            </Link>
                            <hr className="my-2 border-gray-200" />
                            <button
                              onClick={handleMobileLogout}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                handleMobileLogout(e);
                              }}
                              className="w-full text-left px-3 py-3 text-red-600 hover:text-red-700 active:text-red-700 hover:bg-red-50 active:bg-red-50 rounded-md transition-colors min-h-[44px] flex items-center"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/auth/login"
                    className="p-2 text-white hover:bg-white/10 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}

                {/* Cart - Mobile */}
                <Link
                  to="/cart"
                  className="p-2 text-white hover:bg-white/10 rounded-md transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between gap-4">
              {/* Logo */}
              <Link to="/" className="flex items-center flex-shrink-0">
                <img src={logoImage} alt="9ja-cart" className="h-8 w-auto" />
              </Link>

              {/* Delivery Location */}
              <button className="flex items-center text-sm hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer transition-colors flex-shrink-0">
                <MapPin className="w-6 h-6 mr-2 text-white" />
                <div className="text-white">
                  <div className="text-xs">Deliver to</div>
                  <div className="font-medium">Nigeria</div>
                </div>
              </button>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl min-w-0">
                <div className="flex rounded-md overflow-hidden bg-white">
                  {/* Category Dropdown */}
                  <div className="relative flex-shrink-0 bg-primary">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-primary text-primary-foreground px-3 py-2 appearance-none pr-8 min-w-[100px] w-auto max-w-[140px] font-normal h-full border-0 outline-none"
                    >
                      {searchCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-foreground pointer-events-none" />
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8DEB6E] min-w-0"
                  />

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="px-4 text-primary-foreground py-2 bg-primary hover:bg-primary/90 flex-shrink-0 transition-colors font-medium"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Right Side Items */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Help - Direct Link */}
                <Link
                  to="/contact-admin"
                  className="flex text-white items-center text-sm hover:bg-white/10 px-3 py-2 rounded-md cursor-pointer transition-colors"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>Help</span>
                </Link>

                {/* Account Section */}
                {isAuthenticated ? (
                  <div className="relative" ref={accountMenuRef}>
                    <button
                      className="flex items-center text-sm text-white hover:text-white/80 hover:bg-white/5 px-3 py-2 rounded-md transition-colors"
                      onClick={handleAccountMenuClick}
                    >
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        <div className="text-left">
                          <div className="text-xs">Hello, {user?.firstName}</div>
                          <div className="font-medium">Account & Lists</div>
                        </div>
                      </div>
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>

                    {/* Desktop Account Dropdown */}
                    {showAccountMenu && (
                      <div
                        className="absolute right-0 top-full mt-1 w-80 bg-white text-gray-900 rounded-md shadow-xl border border-gray-200 z-[60]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-4">
                          <div className="border-b border-gray-200 pb-3 mb-3">
                            <p className="font-medium text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                          <div className="space-y-1">
                            <Link
                              to="/account"
                              className="block px-3 py-2 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
                              onClick={(e) => handleMenuItemClick(e)}
                            >
                              Your Profile
                            </Link>
                            <Link
                              to="/orders"
                              className="block px-3 py-2 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
                              onClick={(e) => handleMenuItemClick(e)}
                            >
                              Your Orders
                            </Link>
                            <Link
                              to="/wishlist"
                              className="block px-3 py-2 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
                              onClick={(e) => handleMenuItemClick(e)}
                            >
                              Your Wishlist{" "}
                              {wishlistItems > 0 && `(${wishlistItems})`}
                            </Link>
                            <Link
                              to="/contact-admin"
                              className="block px-3 py-2 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
                              onClick={(e) => handleMenuItemClick(e)}
                            >
                              Contact Support
                            </Link>
                            <hr className="my-2 border-gray-200" />
                            <button
                              onClick={(e) =>
                                handleMenuItemClick(e, handleLogout)
                              }
                              className="w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/auth/login"
                    className="flex items-center text-sm text-white hover:text-white/80 hover:bg-white/5 px-3 py-2 rounded-md transition-colors"
                  >
                    <User className="w-5 h-5 mr-2" />
                    <span>Hello, Sign in</span>
                  </Link>
                )}

                {/* Orders */}
                {isAuthenticated && (
                  <Link
                    to="/orders"
                    className="flex items-center text-sm text-white hover:bg-white/10 hover:text-white px-3 py-2 rounded-md transition-colors"
                  >
                    <div className="text-left">
                      <div className="text-xs">Returns</div>
                      <div className="font-medium">& Orders</div>
                    </div>
                  </Link>
                )}

                {/* Cart */}
                <Link
                  to="/cart"
                  className="flex items-center text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                  <span className="ml-2 font-medium">Cart</span>
                </Link>
              </div>
            </div>

            {/* Mobile/Tablet Search Bar */}
            <div className="lg:hidden">
              <form onSubmit={handleSearch} className="w-full">
                <div className="flex rounded-md overflow-hidden bg-white">
                  {/* Category Dropdown - Mobile */}
                  <div className="relative flex-shrink-0 bg-primary">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-primary text-primary-foreground px-2 sm:px-3 py-2 text-xs sm:text-sm appearance-none pr-6 sm:pr-8 min-w-[80px] w-auto font-normal h-full border-0 outline-none"
                    >
                      {searchCategories.slice(0, 6).map((category) => (
                        <option key={category} value={category}>
                          {category.length > 8
                            ? category.substring(0, 8) + "..."
                            : category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground pointer-events-none" />
                  </div>

                  {/* Search Input - Mobile */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 px-2 sm:px-4 py-2 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DEB6E] min-w-0"
                  />

                  {/* Search Button - Mobile */}
                  <button
                    type="submit"
                    className="px-2 sm:px-4 text-primary-foreground py-2 bg-primary hover:bg-primary/90 flex-shrink-0 transition-colors font-medium"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Rendered outside header for proper z-index */}
      {showMobileMenu && (
        <>
          {/* Backdrop Overlay - High z-index */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] lg:hidden"
            onClick={() => setShowMobileMenu(false)}
            style={{ 
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: 'fixed'
            }}
          />

          {/* Mobile Menu Panel - Highest z-index */}
          <div
            className="fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-[#182F38] z-[9999] lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl"
            ref={mobileMenuRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: showMobileMenu ? "translateX(0)" : "translateX(-100%)",
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              overflowY: 'auto'
            }}
          >
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-600 sticky top-0 bg-[#182F38] z-10">
                <div className="flex items-center gap-2">
                  <img src={logoImage} alt="9ja-cart" className="h-8 w-auto" />
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info - Mobile */}
              {isAuthenticated && (
                <div className="p-4 border-b border-gray-600">
                  <p className="font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
              )}

              {/* Categories Section */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-3">
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Shop by Category
                  </h3>
                </div>

                <div className="space-y-1">
                  {categories.map((category) => (
                    <div key={category.id} className="px-2">
                      <button
                        onClick={() => {
                          if (category.id === "all") {
                            navigate("/products");
                          } else {
                            navigate(
                              `/search?category=${category.id.toLowerCase()}`
                            );
                          }
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 text-white hover:bg-white/10 rounded-md transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        {category.subcategories.length > 0 && (
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        )}
                      </button>

                      {/* Subcategories - shown inline */}
                      {category.subcategories.length > 0 && (
                        <div className="ml-12 space-y-1 border-l border-gray-600 pl-4">
                          {category.subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => {
                                navigate(
                                  `/search?category=${category.id}&subcategory=${sub.toLowerCase()}`
                                );
                                setShowMobileMenu(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Links */}
                <div className="mt-6 px-4 border-t border-gray-600 pt-4">
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    <Link
                      to="/products"
                      className="block px-3 py-3 text-white hover:bg-white/10 rounded-md transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      All Products
                    </Link>
                    <Link
                      to="/contact"
                      className="block px-3 py-3 text-white hover:bg-white/10 rounded-md transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Customer Service
                    </Link>
                    <Link
                      to="/contact-admin"
                      className="block px-3 py-3 text-white hover:bg-white/10 rounded-md transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Help & Support
                    </Link>
                  </div>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="p-4 border-t border-gray-600 bg-[#182F38] sticky bottom-0">
                <div className="flex items-center text-sm text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Deliver to Nigeria</span>
                </div>

                {isAuthenticated && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowMobileMenu(false);
                      setTimeout(() => handleLogout(), 300);
                    }}
                    className="w-full mt-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors text-left font-medium"
                  >
                    Sign Out
                  </button>
                )}

                {!isAuthenticated && (
                  <Link
                    to="/auth/login"
                    className="block mt-3 px-4 py-3 bg-primary text-primary-foreground rounded-md text-center font-medium hover:bg-primary/90 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NewHeader;