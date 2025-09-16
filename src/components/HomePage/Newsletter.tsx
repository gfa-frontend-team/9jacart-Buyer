import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '../UI/Button';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary to-primary/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full mb-6">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Subscribe to our newsletter and be the first to know about exclusive deals, 
              new arrivals, and special offers.
            </p>
          </div>

          {/* Subscription Form */}
          <div className="max-w-md mx-auto">
            {isSubscribed ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 sm:p-8">
                <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Thank you for subscribing!
                </h3>
                <p className="text-white/90">
                  You'll receive our latest updates and exclusive offers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 sm:py-4 rounded-lg border-0 bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="bg-white text-primary hover:bg-white/90 px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        Subscribing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Subscribe
                        <Send className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
                
                <p className="text-xs sm:text-sm text-white/80">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            )}
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Exclusive Deals</h4>
              <p className="text-sm text-white/80">
                Get access to subscriber-only discounts and flash sales
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">🚀</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Early Access</h4>
              <p className="text-sm text-white/80">
                Be the first to shop new arrivals and limited editions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">💎</span>
              </div>
              <h4 className="font-semibold text-white mb-2">VIP Treatment</h4>
              <p className="text-sm text-white/80">
                Enjoy personalized recommendations and priority support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;