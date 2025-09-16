import React from 'react';
import { Plus } from 'lucide-react';
import { Button, Card, CardContent } from '../UI';
import { useCartStore } from '../../store/useCartStore';
import { mockProducts } from '../../data/mockData';

const QuickCartDemo: React.FC = () => {
  const { addItem, getTotalItems } = useCartStore();

  const addDemoItems = () => {
    // Add a few demo products to cart
    addItem(mockProducts[0], 1); // Havic Gamepad
    addItem(mockProducts[3], 1); // IPS LCD Gaming Monitor
  };

  const totalItems = getTotalItems();

  if (totalItems > 0) {
    return null; // Don't show if cart already has items
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900 mb-1">
              Demo Mode
            </h3>
            <p className="text-sm text-blue-700">
              Add demo items to your cart to test the checkout flow
            </p>
          </div>
          <Button
            onClick={addDemoItems}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Demo Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickCartDemo;