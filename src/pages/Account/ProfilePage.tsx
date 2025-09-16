import React from 'react';
import { Breadcrumb } from '../../components/UI';

const ProfilePage: React.FC = () => {
  // Auto-generated breadcrumbs will show: Home > Profile
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Auto-generated breadcrumb */}
        <Breadcrumb className="mb-6" />
        
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 mb-4">Profile information will be displayed here</div>
          <div className="mt-4">
            <a href="/account" className="text-primary hover:underline">
              → Go to Full Account Management Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;