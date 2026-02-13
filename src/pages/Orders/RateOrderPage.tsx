import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, AlertCircle, Loader2, Package } from 'lucide-react';
import { Loading, Alert, Button, Card } from '../../components/UI';
import { orderApi } from '../../api/order';
import type { ApiOrderItem } from '../../api/order';
import { cn } from '../../lib/utils';
import Container from '@/components/Layout/Container';

interface ItemRating {
  productId: string;
  vendorId: string;
  rating: number;
  comment: string;
}

const RateOrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [orderItems, setOrderItems] = useState<ApiOrderItem[]>([]);
  const [orderNo, setOrderNo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, ItemRating>>({});
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch order items
  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!orderId) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const items = await orderApi.getOrderItems(orderId);
        
        if (!items || items.length === 0) {
          setError('No items found for this order');
          setLoading(false);
          return;
        }

        setOrderItems(items);
        
        // Extract orderNo from first item or use orderId
        const firstItem = items[0];
        setOrderNo(firstItem.orderNo || orderId);

        // Initialize ratings state
        const initialRatings: Record<string, ItemRating> = {};
        items.forEach((item) => {
          if (item.productId) {
            // Use vendor if available, otherwise use a default or skip
            const vendorId = item.vendor || 'unknown';
            initialRatings[item.productId] = {
              productId: item.productId,
              vendorId: vendorId,
              rating: 0,
              comment: '',
            };
          }
        });
        setRatings(initialRatings);
      } catch (err: any) {
        console.error('Failed to fetch order items:', err);
        setError(err.message || 'Failed to load order items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [orderId]);

  const handleRatingChange = (productId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating,
      },
    }));
  };

  const handleCommentChange = (productId: string, comment: string) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        comment,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      // Validate that all items have ratings
      const unratedItems = Object.values(ratings).filter((r) => r.rating === 0);
      if (unratedItems.length > 0) {
        setSubmitError('Please rate all items before submitting');
        setSubmitting(false);
        return;
      }

      // Prepare rating data
      const ratingData = Object.values(ratings).map((r) => ({
        productId: r.productId,
        vendorId: r.vendorId,
        rating: r.rating,
        comment: r.comment || '',
      }));

      // Submit ratings
      await orderApi.rateOrderItems(orderNo, ratingData);

      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to submit rating:', err);
      setSubmitError(err.message || 'Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (productId: string, currentRating: number) => {
    const hovered = hoveredRating[productId] || 0;
    const displayRating = hovered || currentRating;

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(productId, star)}
            onMouseEnter={() => setHoveredRating((prev) => ({ ...prev, [productId]: star }))}
            onMouseLeave={() => setHoveredRating((prev) => ({ ...prev, [productId]: 0 }))}
            className="transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting || success}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                'w-8 h-8 transition-colors',
                star <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-gray-600">Loading order items...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className=" w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/orders')} variant="outline">
              Go to Orders
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className=" w-full">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thank you for your feedback!
            </h2>
            <p className="text-gray-600 mb-6">
              Your ratings have been submitted successfully.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to orders page...
            </p>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Order</h1>
          <p className="text-gray-600">
            Order: <span className="font-medium">{orderNo}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {orderItems.map((item) => {
            const productId = item.productId;
            const rating = ratings[productId];
            
            if (!rating) {
              return null;
            }

            const productName = item.productName || 'Product';
            const productImage = Array.isArray(item.productImages) && item.productImages.length > 0
              ? item.productImages[0]
              : item.productImage || '';

            return (
              <Card key={productId} className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {productImage ? (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details and Rating */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {productName}
                      </h3>
                      {(item.vendorName || item.vendor) && (
                        <p className="text-sm text-gray-600">
                          Vendor: <span className="font-medium">{item.vendorName || item.vendor}</span>
                        </p>
                      )}
                      {item.quantity && (
                        <p className="text-sm text-gray-600">
                          Quantity: <span className="font-medium">{item.quantity}</span>
                        </p>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        {renderStars(productId, rating.rating)}
                        {rating.rating > 0 && (
                          <span className="text-sm text-gray-600">
                            {rating.rating} star{rating.rating > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label
                        htmlFor={`comment-${productId}`}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Comment (optional)
                      </label>
                      <textarea
                        id={`comment-${productId}`}
                        value={rating.comment}
                        onChange={(e) => handleCommentChange(productId, e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {submitError && (
            <Alert variant="destructive">
              {submitError}
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/orders')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="min-w-[120px]"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Ratings'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default RateOrderPage;

