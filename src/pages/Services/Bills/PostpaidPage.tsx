import React, { useState } from 'react';
import { Receipt, CreditCard, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Input';
import { Badge } from '../../../components/UI/Badge';

const PostpaidPage: React.FC = () => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    provider: '',
    amount: '',
    customerName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const providers = [
    { id: 'nepa', name: 'NEPA/PHCN', icon: '⚡', color: 'bg-yellow-500' },
    { id: 'dstv', name: 'DSTV', icon: '📺', color: 'bg-blue-500' },
    { id: 'gotv', name: 'GOTV', icon: '📡', color: 'bg-green-500' },
    { id: 'startimes', name: 'StarTimes', icon: '🌟', color: 'bg-purple-500' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderSelect = (providerId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      provider: providerId,
      accountNumber: '',
      customerName: '',
      amount: ''
    }));
  };

  const handleVerifyAccount = async () => {
    if (!formData.accountNumber || !formData.provider) return;
    
    setIsVerifying(true);
    
    // Simulate API call to verify account
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock customer data
    const mockCustomerNames: Record<string, string> = {
      nepa: 'John Doe - Lagos Distribution',
      dstv: 'Jane Smith - Premium Bouquet',
      gotv: 'Mike Johnson - Max Package',
      startimes: 'Sarah Wilson - Classic Bouquet',
    };
    
    setFormData(prev => ({
      ...prev,
      customerName: mockCustomerNames[prev.provider] || 'Customer Name',
      amount: prev.provider === 'nepa' ? '' : '5000' // Electricity bills vary, others have fixed amounts
    }));
    
    setIsVerifying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert('Bill payment successful!');
  };

  const selectedProvider = providers.find(p => p.id === formData.provider);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
          <Receipt className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">Postpaid Bills</h1>
        <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
          Pay your postpaid bills quickly and securely
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Postpaid Bill Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Provider Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Service Provider
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleProviderSelect(provider.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      formData.provider === provider.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{provider.icon}</div>
                    <span className="text-xs sm:text-sm font-medium">{provider.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Number */}
            {formData.provider && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {formData.provider === 'nepa' ? 'Meter Number' : 'Account Number'}
                </label>
                <div className="flex gap-2">
                  <Input
                    name="accountNumber"
                    type="text"
                    placeholder={formData.provider === 'nepa' ? 'Enter meter number' : 'Enter account number'}
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyAccount}
                    disabled={!formData.accountNumber || isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </div>
            )}

            {/* Customer Information */}
            {formData.customerName && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Account Verified</span>
                </div>
                <p className="text-sm text-green-700">{formData.customerName}</p>
              </div>
            )}

            {/* Amount */}
            {formData.customerName && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Amount (₦)
                </label>
                {formData.provider === 'nepa' ? (
                  <Input
                    name="amount"
                    type="number"
                    placeholder="Enter amount to pay"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="100"
                    max="100000"
                    className="w-full"
                    required
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <Input
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full"
                      readOnly
                    />
                    <Badge variant="secondary">Fixed Amount</Badge>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.provider === 'nepa' 
                    ? 'Minimum: ₦100, Maximum: ₦100,000'
                    : 'This is the current outstanding amount'
                  }
                </p>
              </div>
            )}

            {/* Summary */}
            {formData.customerName && formData.amount && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-foreground">Payment Summary</h4>
                <div className="flex justify-between text-sm">
                  <span>Service Provider:</span>
                  <Badge variant="secondary">{selectedProvider?.name}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Account:</span>
                  <span className="font-medium">{formData.accountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customer:</span>
                  <span className="font-medium">{formData.customerName.split(' - ')[0]}</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t pt-2">
                  <span>Amount to Pay:</span>
                  <span>₦{formData.amount}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.customerName || !formData.amount}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pay Bill
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostpaidPage;