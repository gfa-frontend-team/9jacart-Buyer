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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6">
            Our Services
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            Quick and secure payment solutions for all your daily needs. 
            From mobile top-ups to bill payments, we've got you covered.
          </p>
        </div>

        {/* Service Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          {serviceCategories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl">{category.title}</CardTitle>
                      <p className="text-muted-foreground text-sm sm:text-base mt-1 line-clamp-2">
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
                        <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center group-hover:bg-primary/10 flex-shrink-0">
                              <ServiceIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="font-medium text-foreground text-sm sm:text-base truncate">
                                  {service.name}
                                </span>
                                {service.popular && (
                                  <Badge variant="secondary" className="text-xs w-fit">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">
                                {service.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
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
        <div className="bg-secondary/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-foreground mb-6 sm:mb-8 lg:mb-10">
            Why Choose Our Services?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base lg:text-lg">Instant Processing</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                All transactions are processed instantly with real-time confirmation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base lg:text-lg">Secure Payments</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                Bank-level security with encrypted transactions for your safety
              </p>
            </div>
            
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Receipt className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base lg:text-lg">24/7 Support</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                Round-the-clock customer support for all your service needs
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8">
            Quick Actions
          </h2>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            <Button asChild size="lg" className="w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px]">
              <Link to="/services/mobile-topup?type=buy-airtime" className="flex flex-row items-center justify-center">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Buy Airtime
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px]">
              <Link to="/services/mobile-topup?type=buy-mobile-data" className="flex flex-row items-center justify-center">
                <Wifi className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Buy Data
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px]">
              <Link to="/services/bills?type=prepaid" className="flex flex-row items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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