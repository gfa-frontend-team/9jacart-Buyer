import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, CardContent, Badge, Loading, Alert } from '../UI';
import { orderApi, transformApiOrderToOrder } from '../../api/order';
import type { Order } from '../../types';
import { formatPrice } from '../../lib/productUtils';
import { Link } from 'react-router-dom';

const ORDERS_PER_PAGE = 8;

const OrdersSection: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const ordersData = await orderApi.getOrders();
        
        // Transform API response to Order type
        const transformedOrders = ordersData.map(transformApiOrderToOrder);
        setOrders(transformedOrders);
      } catch (err: any) {
        console.error('Failed to fetch orders:', err);
        setError(err.message || 'Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // Reset to page 1 when orders change
  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">My Orders</h2>
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">My Orders</h2>
        <div className="text-sm text-muted-foreground">
          {orders.length > 0 && (
            <>
              Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length} order{orders.length !== 1 ? 's' : ''}
            </>
          )}
          {orders.length === 0 && 'No orders'}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" title="Error loading orders">
          {error}
        </Alert>
      )}

      {/* Orders List */}
      {!loading && !error && (
        <div className="space-y-6">
          {orders.length > 0 ? (
            <>
              {paginatedOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images.main}
                            alt={item.product.images.alt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(
                            typeof item.product.price === 'number' 
                              ? item.product.price 
                              : item.product.price.current
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                    <div className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                      Total: {formatPrice(order.total)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/orders/${order.id}`}>
                          View Details
                        </Link>
                      </Button>
                      {order.status === 'delivered' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`, { state: { openRating: true } })}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate Order
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/track-order/${order.id}`}>
                          Track Order
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={currentPage >= totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 mb-6">
                  When you place your first order, it will appear here.
                </p>
                <Button asChild>
                  <Link to="/products">
                    Start Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;