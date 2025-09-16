import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../UI/Button';
import { useWishlistStore } from '../../store/useWishlistStore';
import { cn } from '../../lib/utils';
import type { Product } from '../../types';

interface WishlistButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  variant = 'outline',
  size = 'icon',
  className,
  showText = false,
}) => {
  const { addItem, removeItem, isItemInWishlist } = useWishlistStore();
  const isWishlisted = isItemInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={cn(
        "transition-colors",
        isWishlisted && "text-red-500 border-red-500",
        className
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4",
          isWishlisted && "fill-current"
        )}
      />
      {showText && (
        <span className="ml-2">
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
};

export default WishlistButton;