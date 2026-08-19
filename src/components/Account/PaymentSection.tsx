import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, ShoppingBag } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Alert } from "../UI";
import {
  BNPL_MIN_ORDER_NAIRA,
  clearBnplProfileSetup,
  getBnplProfileSetup,
} from "../../lib/bnplWidget";

const PaymentSection: React.FC = () => {
  const [legacySetupCleared, setLegacySetupCleared] = useState(false);
  const legacySetup = legacySetupCleared ? null : getBnplProfileSetup();

  const handleClearLegacySetup = () => {
    clearBnplProfileSetup();
    setLegacySetupCleared(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">My Payment Options</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage how you pay on 9jaCart, including Buy Now, Pay Later (Pay Small Small).
        </p>
      </div>

      {legacySetup && (
        <Alert variant="default">
          <div className="space-y-2">
            <p className="text-sm">
              An older device-only Pay Small Small note was saved here (
              {new Date(legacySetup.completedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              ). That is <strong>not</strong> NeoCash approval — identity and credit checks
              happen at checkout when you choose Pay Small Small on an eligible order.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={handleClearLegacySetup}>
              Clear saved note on this device
            </Button>
          </div>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
          <span className="rounded-lg bg-primary/10 p-2 text-primary">
            <CreditCard className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <CardTitle className="text-lg">Buy Now, Pay Later (Pay Small Small)</CardTitle>
            <p className="mt-1 text-sm font-normal text-muted-foreground">
              Pay Small Small is set up at checkout when your cart meets the minimum order
              amount. The NeoCash widget walks you through BVN verification, selfie
              liveness, and employment details when needed.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-[#2ac12a]/40 bg-[#f0fde8] px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#1E4700]/80">
              Minimum merchandise to use BNPL
            </p>
            <p className="mt-0.5 text-2xl font-semibold text-[#1E4700]">
              ₦{BNPL_MIN_ORDER_NAIRA.toLocaleString("en-NG")}
            </p>
            <p className="mt-1 text-xs text-[#1E4700]/75">
              Add items to your cart, then choose Pay Small Small at checkout.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild type="button">
              <Link to="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop eligible items
              </Link>
            </Button>
            <Button asChild type="button" variant="outline">
              <Link to="/checkout">Go to checkout</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Powered by NeoCash. Final approval and Pay Today deposit are handled in the
            checkout widget — not on this page.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Card and bank transfer options are selected during checkout. Saved cards will
            appear here when available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSection;
