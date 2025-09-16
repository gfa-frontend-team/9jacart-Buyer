import React, { useState } from 'react';
import { Button, Input } from '../UI';
import { useAuthStore } from '../../store/useAuthStore';

const ProfileSection: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: 'Kobape, Ogun, Abeokuta',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    // Validate passwords if they're being changed
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    // Update user profile
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
    });
    
    setIsEditing(false);
    
    // Clear password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      address: 'Kobape, Ogun, Abeokuta',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Edit Your Profile</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">First Name</label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Dorime"
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Last Name</label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Lamire"
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="rimere@gmail.com"
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Address</label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Kobape, Ogun, Abeokuta"
            className="bg-muted"
          />
        </div>
      </div>

      {isEditing && (
        <div className="space-y-6 pt-6 border-t border-border">
          <h3 className="text-lg font-medium text-foreground">Password Changes</h3>
          
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <Input
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Current Password"
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <Input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm New Password"
                className="bg-muted"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;