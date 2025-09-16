import React from 'react';

const PaymentMethodsPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>
      <div className="max-w-2xl mx-auto">
        <div className="text-gray-500">Saved payment methods will be displayed here</div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;