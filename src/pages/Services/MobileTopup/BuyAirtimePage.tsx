import React, { useState } from 'react';
import { Phone, CreditCard, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Input';
import { Badge } from '../../../components/UI/Badge';

const BuyAirtimePage: React.FC = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    amount: '',
    network: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const networks = [
    { id: 'mtn', name: 'MTN', color: 'bg-yellow-500' },
    { id: 'glo', name: 'Glo', color: 'bg-green-500' },
    { id: 'airtel', name: 'Airtel', color: 'bg-red-500' },
    { id: '9mobile', name: '9mobile', color: 'bg-emerald-500' },
  ];

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNetworkSelect = (networkId: string) => {
    setFormData(prev => ({ ...prev, network: networkId }));
  };

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert('Airtime purchase successful!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Buy Airtime</h1>
        <p className="text-muted-foreground">
          Recharge your phone or someone else's instantly
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Airtime Purchase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone Number
              </label>
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="08012345678"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Network Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Network
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {networks.map((network) => (
                  <button
                    key={network.id}
                    type="button"
                    onClick={() => handleNetworkSelect(network.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.network === network.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 ${network.color} rounded-full mx-auto mb-2`}></div>
                    <span className="text-sm font-medium">{network.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Amount (₦)
              </label>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={formData.amount === amount.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAmountSelect(amount)}
                    className="text-xs"
                  >
                    ₦{amount}
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
                min="50"
                max="50000"
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum: ₦50, Maximum: ₦50,000
              </p>
            </div>

            {/* Summary */}
            {formData.phoneNumber && formData.network && formData.amount && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-foreground">Purchase Summary</h4>
                <div className="flex justify-between text-sm">
                  <span>Phone Number:</span>
                  <span className="font-medium">{formData.phoneNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Network:</span>
                  <Badge variant="secondary">
                    {networks.find(n => n.id === formData.network)?.name}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span className="font-medium">₦{formData.amount}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.phoneNumber || !formData.network || !formData.amount}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Purchase Airtime
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyAirtimePage;