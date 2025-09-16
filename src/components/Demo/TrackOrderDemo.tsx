import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink } from 'lucide-react';
import { Button, Card, CardContent, Badge } from '../UI';

const TrackOrderDemo: React.FC = () => {
  const demoOrders = [
    {
      id: '3354654654526',
      status: 'Out for Delivery',
      statusColor: 'bg-blue-100 text-blue-800',
      description: 'MacBook Pro 14" - Awaiting Pickup'
    },
    {
      id: 'ORD-001',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-800',
      description: 'Gaming Headphones & Keyboard'
    },
    {
      id: 'ORD-002',
      status: 'Shipped',
      statusColor: 'bg-yellow-100 text-yellow-800',
      description: 'Gaming Controller'
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Demo Orders to Track</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Click on any order ID below to see the track order page in action:
        </p>
        
        <div className="space-y-3">
          {demoOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-medium">#{order.id}</span>
                  <Badge className={order.statusColor}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{order.description}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/track-order/${order.id}`} className="flex items-center gap-1">
                  Track
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> You can also use the track order input above with any of these order IDs
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackOrderDemo;