// import React from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Layout from "../components/Layout/Layout";

// // Page imports
// import HomePage from "../pages/Home/HomePage";
// import ProductsPage from "../pages/Products/ProductsPage";
// import ProductDetailPage from "../pages/Products/ProductDetailPage";
// import CartPage from "../pages/Cart/CartPage";
// import CheckoutPage from "../pages/Checkout/CheckoutPage";
// import OrdersPage from "../pages/Orders/OrdersPage";
// import OrderDetailPage from "../pages/Orders/OrderDetailPage";
// import TrackOrderPage from "../pages/Orders/TrackOrderPage";

// // Account pages
// import AccountPage from "../pages/Account/AccountPage";
// import ProfilePage from "../pages/Account/ProfilePage";
// import SettingsPage from "../pages/Account/SettingsPage";
// import AddressesPage from "../pages/Account/AddressesPage";
// import PaymentMethodsPage from "../pages/Account/PaymentMethodsPage";
// import WishlistPage from "../pages/Account/WishlistPage";

// // Auth pages
// import LoginPage from "../pages/Auth/LoginPage";
// import RegisterPage from "../pages/Auth/RegisterPage";

// // Support pages
// import ContactPage from "../pages/Support/ContactPage";
// import FAQPage from "../pages/Support/FAQPage";

// // Additional pages
// import CategoryPage from "../pages/Categories/CategoryPage";
// import SearchResultsPage from "../pages/Search/SearchResultsPage";
// import NotFoundPage from "../pages/Error/NotFoundPage";
// import UIComponentsDemo from "../pages/Demo/UIComponentsDemo";

// // Layout components
// import AuthLayout from "../components/Layout/AuthLayout";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         index: true,
//         element: <HomePage />,
//       },
//       {
//         path: "products",
//         element: <ProductsPage />,
//       },
//       {
//         path: "products/:id",
//         element: <ProductDetailPage />,
//       },
//       {
//         path: "cart",
//         element: <CartPage />,
//       },
//       {
//         path: "checkout",
//         element: <CheckoutPage />,
//       },
//       {
//         path: "orders",
//         element: <OrdersPage />,
//       },
//       {
//         path: "orders/:id",
//         element: <OrderDetailPage />,
//       },
//       {
//         path: "track-order/:id",
//         element: <TrackOrderPage />,
//       },
//       // Account routes
//       {
//         path: "account",
//         element: <AccountPage />,
//       },
//       {
//         path: "profile",
//         element: <ProfilePage />,
//       },
//       {
//         path: "settings",
//         element: <SettingsPage />,
//       },
//       {
//         path: "addresses",
//         element: <AddressesPage />,
//       },
//       {
//         path: "payment-methods",
//         element: <PaymentMethodsPage />,
//       },
//       {
//         path: "wishlist",
//         element: <WishlistPage />,
//       },
//       // Support routes
//       {
//         path: "contact",
//         element: <ContactPage />,
//       },
//       {
//         path: "faq",
//         element: <FAQPage />,
//       },
//       // Category and search routes
//       {
//         path: "category/:category",
//         element: <CategoryPage />,
//       },
//       {
//         path: "search",
//         element: <SearchResultsPage />,
//       },
//       // Demo route (for development)
//       {
//         path: "demo",
//         element: <UIComponentsDemo />,
//       },
//       // 404 catch-all
//       {
//         path: "*",
//         element: <NotFoundPage />,
//       },
//     ],
//   },
//   // Auth routes (with AuthLayout)
//   {
//     path: "auth",
//     element: <AuthLayout />,
//     children: [
//       {
//         path: "login",
//         element: <LoginPage />,
//       },
//       {
//         path: "register",
//         element: <RegisterPage />,
//       },
//     ],
//   },
// ]);

// const AppRouter: React.FC = () => {
//   return <RouterProvider router={router} />;
// };

// export default AppRouter;



import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";

// Page imports
import HomePage from "../pages/Home/HomePage";
import ProductsPage from "../pages/Products/ProductsPage";
import ProductDetailPage from "../pages/Products/ProductDetailPage";
import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import OrdersPage from "../pages/Orders/OrdersPage";
import OrderDetailPage from "../pages/Orders/OrderDetailPage";
import TrackOrderPage from "../pages/Orders/TrackOrderPage";

// Account pages
import AccountPage from "../pages/Account/AccountPage";
import ProfilePage from "../pages/Account/ProfilePage";
import SettingsPage from "../pages/Account/SettingsPage";
import AddressesPage from "../pages/Account/AddressesPage";
import PaymentMethodsPage from "../pages/Account/PaymentMethodsPage";
import WishlistPage from "../pages/Account/WishlistPage";

// Auth pages
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

// Support pages
import ContactPage from "../pages/Support/ContactPage";
import FAQPage from "../pages/Support/FAQPage";

// Additional pages
import CategoryPage from "../pages/Categories/CategoryPage";
import SearchResultsPage from "../pages/Search/SearchResultsPage";
import NotFoundPage from "../pages/Error/NotFoundPage";
import UIComponentsDemo from "../pages/Demo/UIComponentsDemo";

// Layout components
import AuthLayout from "../components/Layout/AuthLayout";

// Scroll to Top Component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Use 'auto' for instant scrolling
    });
  }, [pathname]);

  return null;
};

// Layout Wrapper with ScrollToTop
const LayoutWithScrollToTop: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Layout />
    </>
  );
};

// Auth Layout Wrapper with ScrollToTop  
const AuthLayoutWithScrollToTop: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <AuthLayout />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWithScrollToTop />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "orders/:id",
        element: <OrderDetailPage />,
      },
      {
        path: "track-order/:id",
        element: <TrackOrderPage />,
      },
      // Account routes
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "addresses",
        element: <AddressesPage />,
      },
      {
        path: "payment-methods",
        element: <PaymentMethodsPage />,
      },
      {
        path: "wishlist",
        element: <WishlistPage />,
      },
      // Support routes
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "faq",
        element: <FAQPage />,
      },
      // Category and search routes
      {
        path: "category/:category",
        element: <CategoryPage />,
      },
      {
        path: "search",
        element: <SearchResultsPage />,
      },
      // Demo route (for development)
      {
        path: "demo",
        element: <UIComponentsDemo />,
      },
      // 404 catch-all
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  // Auth routes (with AuthLayout)
  {
    path: "auth",
    element: <AuthLayoutWithScrollToTop />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;