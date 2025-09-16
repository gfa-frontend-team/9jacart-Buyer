import React from 'react';

interface CartBadgeProps {
  count: number;
  className?: string;
}

const CartBadge: React.FC<CartBadgeProps> = ({ count, className = '' }) => {
  if (count === 0) return null;

  return (
    <span className={`absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default CartBadge;