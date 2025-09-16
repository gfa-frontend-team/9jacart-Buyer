import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <p className="text-gray-600">Order ID: {id}</p>
      <div className="mt-8">
        <div className="text-gray-500">Order details will be displayed here</div>
      </div>
    </div>
  );
};

export default OrderDetailPage;