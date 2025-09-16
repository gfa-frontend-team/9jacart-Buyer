import React from "react";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Package,
  RotateCcw,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../UI";
import { cn } from "../../lib/utils";

interface AccountSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      description: "Edit your profile information",
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: MapPin,
      description: "Manage your delivery addresses",
    },
    {
      id: "payment",
      label: "My Payment Options",
      icon: CreditCard,
      description: "Manage payment methods",
    },
  ];

  const orderItems = [
    {
      id: "orders",
      label: "My Orders",
      icon: Package,
      description: "View your order history",
    },
    {
      id: "returns",
      label: "My Returns",
      icon: RotateCcw,
      description: "Track returns and refunds",
    },
    {
      id: "cancellations",
      label: "My Cancellations",
      icon: X,
      description: "View cancelled orders",
    },
  ];

  const otherItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Manage your notifications",
    },
  ];

  const renderMenuSection = (items: typeof menuItems, title?: string) => (
    <div className={title ? "px-4 py-3 border-t border-border" : ""}>
      {title && (
        <h3 className="text-sm font-medium text-foreground mb-2">{title}</h3>
      )}
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center px-3 py-3 text-left text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground rounded-md",
                activeSection === item.id
                  ? "bg-accent text-accent-foreground border-r-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Manage My Account</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {renderMenuSection(menuItems)}
        {renderMenuSection(orderItems, "My Orders")}
        {renderMenuSection(otherItems)}
      </CardContent>
    </Card>
  );
};

export default AccountSidebar;
