import React from "react";
import { Link, useLocation } from "react-router-dom";

const policyNavItems = [
  { path: "/shipping-return-policy", label: "Shipping and Return Policy" },
  { path: "/refund-policy", label: "Refund Policy" },
  { path: "/dispute-policy", label: "Dispute Policy" },
  { path: "/terms", label: "Terms and Conditions" },
];

const PolicySidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="md:w-56 shrink-0">
      <nav className="sticky top-24 space-y-1" aria-label="Policy pages">
        {policyNavItems.map(({ path, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#182F38] text-white"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default PolicySidebar;
