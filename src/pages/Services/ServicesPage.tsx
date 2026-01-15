import React from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { Breadcrumb } from "../../components/UI/Breadcrumb";
import BuyAirtimePage from "./MobileTopup/BuyAirtimePage";
import PostpaidPage from "./Bills/PostpaidPage";
import BuyDataPage from "./MobileTopup/BuyDataPage";
import PrepaidPage from "./Bills/PrepaidPage";

const ServicesPage: React.FC = () => {
  const { subcategory } = useParams<{ subcategory: string }>();
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get("type");

  // Define service type mappings
  const serviceComponents: Record<
    string,
    Record<string, React.ComponentType>
  > = {
    "mobile-topup": {
      "buy-airtime": BuyAirtimePage,
      "buy-mobile-data": BuyDataPage,
    },
    bills: {
      postpaid: PostpaidPage,
      prepaid: PrepaidPage,
    },
  };

  // Get the appropriate component
  const ServiceComponent =
    subcategory && serviceType
      ? serviceComponents[subcategory]?.[serviceType]
      : null;

  // If no valid service found, redirect to home
  if (!ServiceComponent) {
    return <Navigate to="/" replace />;
  }

  // Generate breadcrumb items
  const breadcrumbItems = [
    // ARCHIVED: Services breadcrumb - commented out
    // { label: "Services", href: "/services" },

    {
      label:
        serviceType
          ?.split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") || "",
      isCurrentPage: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Service Component */}
        <ServiceComponent />
      </div>
    </div>
  );
};

export default ServicesPage;
