import React, { useState } from 'react';
import { Wifi, CreditCard, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Input';
import { Badge } from '../../../components/UI/Badge';

const BuyDataPage: React.FC = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    network: '',
    dataPlan: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const networks = [
    { id: 'mtn', name: 'MTN', color: 'bg-yellow-500' },
    { id: 'glo', name: 'Glo', color: 'bg-green-500' },
    { id: 'airtel', name: 'Airtel', color: 'bg-red-500' },
    { id: '9mobile', name: '9mobile', color: 'bg-emerald-500' },
  ];

  const dataPlans: Record<string, Array<{id: string, name: string, price: number, validity: string}>> = {
    mtn: [
      { id: 'mtn-1gb', name: '1GB', price: 350, validity: '30 days' },
      { id: 'mtn-2gb', name: '2GB', price: 700, validity: '30 days' },
      { id: 'mtn-5gb', name: '5GB', price: 1500, validity: '30 days' },
      { id: 'mtn-10gb', name: '10GB', price: 2500, validity: '30 days' },
    ],
    glo: [
      { id: 'glo-1gb', name: '1GB', price: 400, validity: '30 days' },
      { id: 'glo-2gb', name: '2GB', price: 800, validity: '30 days' },
      { id: 'glo-5gb', name: '5GB', price: 1600, validity: '30 days' },
      { id: 'glo-10gb', name: '10GB', price: 2700, validity: '30 days' },
    ],
    airtel: [
      { id: 'airtel-1gb', name: '1GB', price: 380, validity: '30 days' },
      { id: 'airtel-2gb', name: '2GB', price: 750, validity: '30 days' },
      { id: 'airtel-5gb', name: '5GB', price: 1550, validity: '30 days' },
      { id: 'airtel-10gb', name: '10GB', price: 2600, validity: '30 days' },
    ],
    '9mobile': [
      { id: '9mobile-1gb', name: '1GB', price: 420, validity: '30 days' },
      { id: '9mobile-2gb', name: '2GB', price: 820, validity: '30 days' },
      { id: '9mobile-5gb', name: '5GB', price: 1650, validity: '30 days' },
      { id: '9mobile-10gb', name: '10GB', price: 2800, validity: '30 days' },
    ],
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNetworkSelect = (networkId: string) => {
    setFormData(prev => ({ ...prev, network: networkId, dataPlan: '' }));
  };

  const handleDataPlanSelect = (planId: string) => {
    setFormData(prev => ({ ...prev, dataPlan: planId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert('Data purchase successful!');
  };

  const selectedPlan = formData.network && formData.dataPlan 
    ? dataPlans[formData.network]?.find(plan => plan.id === formData.dataPlan)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
          <Wifi className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">Buy Mobile Data</h1>
        <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
          Purchase data bundles for your mobile device
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Data Bundle Purchase
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {networks.map((network) => (
                  <button
                    key={network.id}
                    type="button"
                    onClick={() => handleNetworkSelect(network.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      formData.network === network.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 ${network.color} rounded-full mx-auto mb-1 sm:mb-2`}></div>
                    <span className="text-xs sm:text-sm font-medium">{network.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Data Plan Selection */}
            {formData.network && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Select Data Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {dataPlans[formData.network]?.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handleDataPlanSelect(plan.id)}
                      className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all ${
                        formData.dataPlan === plan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <span className="font-medium text-base sm:text-lg">{plan.name}</span>
                        <Badge variant="secondary" className="w-fit">₦{plan.price}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Valid for {plan.validity}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {formData.phoneNumber && formData.network && selectedPlan && (
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
                  <span>Data Plan:</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Validity:</span>
                  <span className="font-medium">{selectedPlan.validity}</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t pt-2">
                  <span>Total Amount:</span>
                  <span>₦{selectedPlan.price}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.phoneNumber || !formData.network || !formData.dataPlan}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Purchase Data Bundle
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyDataPage;