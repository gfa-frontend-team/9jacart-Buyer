import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package } from 'lucide-react';
import { Button, Input, Card, CardContent } from '../UI';

interface TrackOrderInputProps {
  className?: string;
  placeholder?: string;
  showTitle?: boolean;
}

const TrackOrderInput: React.FC<TrackOrderInputProps> = ({ 
  className = '',
  placeholder = 'Enter your order ID',
  showTitle = true
}) => {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/track-order/${orderId.trim()}`);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        {showTitle && (
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Track Your Order</h3>
          </div>
        )}
        
        <form onSubmit={handleTrackOrder} className="flex gap-2">
          <Input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button type="submit" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Track
          </Button>
        </form>
        
        <p className="text-sm text-gray-500 mt-2">
          Enter your order ID to track your package in real-time
        </p>
      </CardContent>
    </Card>
  );
};

export default TrackOrderInput;