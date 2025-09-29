import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Zap, 
  Receipt, 
  CreditCard,
  ArrowRight,
  Phone,
  Wifi
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';

const ServicesLandingPage: React.FC = () => {
  const serviceCategories = [
    {
      id: 'mobile-topup',
      title: 'Mobile Top Up',
      description: 'Recharge airtime and buy data bundles for all networks',
      icon: Smartphone,
      color: 'bg-blue-500',
      services: [
        {
          id: 'buy-airtime',
          name: 'Buy Airtime',
          description: 'Instant airtime recharge',
          icon: Phone,
          popular: true
        },
        {
          id: 'buy-mobile-data',
          name: 'Buy Data',
          description: 'Data bundles for all networks',
          icon: Wifi,
          popular: true
        }
      ]
    },
    {
      id: 'bills',
      title: 'Bills Payment',
      description: 'Pay your electricity bills and other utilities',
      icon: Receipt,
      color: 'bg-green-500',
      services: [
        {
          id: 'prepaid',
          name: 'Prepaid Electricity',
          description: 'Buy electricity units',
          icon: Zap,
          popular: true
        },
        {
          id: 'postpaid',
          name: 'Postpaid Bills',
          description: 'Pay monthly bills',
          icon: CreditCard,
          popular: false
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quick and secure payment solutions for all your daily needs. 
            From mobile top-ups to bill payments, we've got you covered.
          </p>
        </div>

        {/* Service Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {serviceCategories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {category.services.map((service) => {
                    const ServiceIcon = service.icon;
                    
                    return (
                      <Link
                        key={service.id}
                        to={`/services/${category.id}?type=${service.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center group-hover:bg-primary/10">
                              <ServiceIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  {service.name}
                                </span>
                                {service.popular && (
                                  <Badge variant="secondary" className="text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {service.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-secondary/30 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Why Choose Our Services?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Processing</h3>
              <p className="text-sm text-muted-foreground">
                All transactions are processed instantly with real-time confirmation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Bank-level security with encrypted transactions for your safety
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Round-the-clock customer support for all your service needs
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Quick Actions
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link to="/services/mobile-topup?type=buy-airtime">
                <Phone className="w-5 h-5 mr-2" />
                Buy Airtime
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="min-w-[200px]">
              <Link to="/services/mobile-topup?type=buy-mobile-data">
                <Wifi className="w-5 h-5 mr-2" />
                Buy Data
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="min-w-[200px]">
              <Link to="/services/bills?type=prepaid">
                <Zap className="w-5 h-5 mr-2" />
                Pay Electricity
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesLandingPage;