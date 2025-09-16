import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowLeft
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardContent, 
  Badge, 
  Modal
} from '../../components/UI';
import { CartItem, CartSummary } from '../../components/Cart';
import { useCartStore } from '../../store/useCartStore';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    clearCart, 
    getTotalItems 
  } = useCartStore();

  const [showClearModal, setShowClearModal] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const totalItems = getTotalItems();

  const handleRemoveItem = (productId: string) => {
    setRemovingItemId(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemovingItemId(null);
    }, 300);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          {/* Empty Cart */}
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button asChild className="w-full">
                <Link to="/products">
                  Continue Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Badge variant="secondary" className="ml-2">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowClearModal(true)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-0">
                  <CartItem
                    item={item}
                    onRemove={handleRemoveItem}
                    isRemoving={removingItemId === item.product.id}
                  />
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Continue Shopping
                    </h3>
                    <p className="text-sm text-gray-600">
                      Discover more products you might like
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/products">
                      Browse Products
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <CartSummary />
        </div>
      </div>

      {/* Clear Cart Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear Cart"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowClearModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;