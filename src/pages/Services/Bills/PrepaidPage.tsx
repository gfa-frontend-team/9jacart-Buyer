import React, { useState } from 'react';
import { Zap, CreditCard, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Input';
import { Badge } from '../../../components/UI/Badge';

const PrepaidPage: React.FC = () => {
  const [formData, setFormData] = useState({
    meterNumber: '',
    provider: '',
    amount: '',
    customerName: '',
    customerAddress: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const providers = [
    { id: 'aedc', name: 'AEDC', fullName: 'Abuja Electricity Distribution Company', color: 'bg-blue-500' },
    { id: 'ekedc', name: 'EKEDC', fullName: 'Eko Electricity Distribution Company', color: 'bg-green-500' },
    { id: 'ikedc', name: 'IKEDC', fullName: 'Ikeja Electric Distribution Company', color: 'bg-yellow-500' },
    { id: 'phed', name: 'PHED', fullName: 'Port Harcourt Electricity Distribution', color: 'bg-red-500' },
  ];

  const quickAmounts = [1000, 2000, 5000, 10000, 15000, 20000];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderSelect = (providerId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      provider: providerId,
      meterNumber: '',
      customerName: '',
      customerAddress: '',
      amount: ''
    }));
  };

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleVerifyMeter = async () => {
    if (!formData.meterNumber || !formData.provider) return;
    
    setIsVerifying(true);
    
    // Simulate API call to verify meter
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock customer data
    const mockCustomerData: Record<string, {name: string, address: string}> = {
      aedc: { name: 'John Doe', address: 'No. 15 Wuse Zone 4, Abuja' },
      ekedc: { name: 'Jane Smith', address: 'No. 23 Victoria Island, Lagos' },
      ikedc: { name: 'Mike Johnson', address: 'No. 45 Ikeja GRA, Lagos' },
      phed: { name: 'Sarah Wilson', address: 'No. 12 Port Harcourt, Rivers' },
    };
    
    const customerData = mockCustomerData[formData.provider];
    setFormData(prev => ({
      ...prev,
      customerName: customerData.name,
      customerAddress: customerData.address,
    }));
    
    setIsVerifying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert('Electricity bill payment successful!');
  };

  const selectedProvider = providers.find(p => p.id === formData.provider);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
          <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">Prepaid Electricity</h1>
        <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
          Buy electricity units for your prepaid meter
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Prepaid Electricity Purchase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Provider Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Electricity Provider
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleProviderSelect(provider.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all ${
                      formData.provider === provider.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${provider.color} rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0`}>
                        {provider.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base">{provider.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground truncate">{provider.fullName}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meter Number */}
            {formData.provider && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Meter Number
                </label>
                <div className="flex gap-2">
                  <Input
                    name="meterNumber"
                    type="text"
                    placeholder="Enter your meter number"
                    value={formData.meterNumber}
                    onChange={handleInputChange}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyMeter}
                    disabled={!formData.meterNumber || isVerifying}
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
                  <span className="text-sm font-medium text-green-800">Meter Verified</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-700">{formData.customerName}</p>
                  <p className="text-xs text-green-600">{formData.customerAddress}</p>
                </div>
              </div>
            )}

            {/* Amount Selection */}
            {formData.customerName && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Amount (₦)
                </label>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={formData.amount === amount.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAmountSelect(amount)}
                      className="text-xs sm:text-sm py-2 px-1 sm:px-2"
                    >
                      ₦{amount.toLocaleString()}
                    </Button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <Input
                  name="amount"
                  type="number"
                  placeholder="Enter custom amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="500"
                  max="100000"
                  className="w-full"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum: ₦500, Maximum: ₦100,000
                </p>
              </div>
            )}

            {/* Summary */}
            {formData.customerName && formData.amount && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-foreground">Purchase Summary</h4>
                <div className="flex justify-between text-sm">
                  <span>Provider:</span>
                  <Badge variant="secondary">{selectedProvider?.name}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Meter Number:</span>
                  <span className="font-medium">{formData.meterNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customer:</span>
                  <span className="font-medium">{formData.customerName}</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t pt-2">
                  <span>Amount:</span>
                  <span>₦{parseInt(formData.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Units (approx):</span>
                  <span>{Math.floor(parseInt(formData.amount) / 50)} kWh</span>
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
                  Buy Electricity Units
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrepaidPage;