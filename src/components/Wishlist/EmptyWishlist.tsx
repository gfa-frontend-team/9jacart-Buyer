import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card, CardContent } from '../UI/Card';

const EmptyWishlist: React.FC = () => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-muted-foreground">
            Save items you love to your wishlist and never lose track of them.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Start Shopping
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link to="/">
              Browse Categories
            </Link>
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Click the heart icon on any product to add it to your wishlist
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyWishlist;