import React from 'react';

const FAQPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">How do I track my order?</h3>
            <p className="text-gray-600">You can track your order by visiting the Orders page in your account.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">What is your return policy?</h3>
            <p className="text-gray-600">We offer a 30-day return policy for most items.</p>
          </div>
          <div className="text-gray-500">More FAQ items will be added here</div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;