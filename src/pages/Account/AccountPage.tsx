import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/UI';
import { useAuthStore } from '../../store/useAuthStore';
import AccountSidebar from '../../components/Account/AccountSidebar';
import ProfileSection from '../../components/Account/ProfileSection';
import AddressesSection from '../../components/Account/AddressesSection';
import OrdersSection from '../../components/Account/OrdersSection';
import ContactAdminPage from './ContactAdminPage';
import Container from '@/components/Layout/Container';

const AccountPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');

  const renderPlaceholderSection = (title: string, description: string) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'payment':
        return renderPlaceholderSection('Payment Methods', 'Manage your payment methods here');
      case 'orders':
        return <OrdersSection />;
      case 'returns':
        return renderPlaceholderSection('My Returns', 'Track your returns and refunds here');
      case 'cancellations':
        return renderPlaceholderSection('My Cancellations', 'View your cancelled orders here');
      case 'notifications':
        return renderPlaceholderSection('Notifications', 'Manage your notification preferences here');
      case 'contact-support':
        return <ContactAdminPage />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <Container className="min-h-screen bg-background">
      <div className=" mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-muted-foreground space-x-2">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">My Account</span>
          </div>
        </div>

        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">
              Welcome! {user?.firstName || 'Dorime'}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <AccountSidebar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AccountPage;