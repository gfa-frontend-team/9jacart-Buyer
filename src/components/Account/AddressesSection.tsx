import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Loading } from '../UI';
import { useProfile } from '../../hooks/api/useProfile';
import { useNotificationContext } from '../../providers/NotificationProvider';
import type { UserAddress } from '../../types';

const AddressesSection: React.FC = () => {
  const { 
    profile, 
    isLoading, 
    error, 
    successMessage,
    fetchProfile, 
    addAddress, 
    updateAddress,
    deleteAddress,
    getAddresses 
  } = useProfile();
  
  const { showNotification } = useNotificationContext();
  
  const addresses = getAddresses();
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    isDefault: false
  });

  // Load profile data on component mount
  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  // Show success notification when API returns success message
  useEffect(() => {
    if (successMessage) {
      showNotification(successMessage, 'success', 5000);
    }
  }, [successMessage, showNotification]);

  // Show error notification when API returns error
  useEffect(() => {
    if (error) {
      showNotification(error, 'error', 5000);
    }
  }, [error, showNotification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria',
      isDefault: false
    });
  };

  const handleEdit = (address: UserAddress) => {
    setEditingId(address.id);
    setFormData({
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      if (isAddingNew) {
        await addAddress(formData);
        setIsAddingNew(false);
      } else if (editingId) {
        await updateAddress(editingId, formData);
        setEditingId(null);
      }
      
      // Reset form
      setFormData({
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Nigeria',
        isDefault: false
      });
    } catch (error) {
      // Error is handled by the hook and displayed in the UI
      console.error('Failed to save address:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria',
      isDefault: false
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
      } catch (error) {
        // Error is handled by the hook and displayed in the UI
        console.error('Failed to delete address:', error);
      }
    }
  };

  const renderAddressForm = () => (
    <Card className="border-dashed border-2">
      <CardHeader>
        <CardTitle className="text-lg">
          {isAddingNew ? 'Add New Address' : 'Edit Address'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Street Address</label>
          <Input
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            placeholder="e.g., 54, John Doe Street"
          />
          <p className="text-xs text-muted-foreground">
            Include house number and street name
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <Input
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">ZIP Code</label>
            <Input
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="ZIP Code"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Input
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Country"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="rounded border-gray-300"
          />
          <label htmlFor="isDefault" className="text-sm font-medium">
            Set as default address
          </label>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loading className="w-4 h-4 mr-2" />
                {isAddingNew ? 'Adding...' : 'Saving...'}
              </>
            ) : (
              isAddingNew ? 'Add Address' : 'Save Changes'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading className="w-6 h-6 mr-2" />
        <span>Loading addresses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">My Addresses</h2>
        {!isAddingNew && !editingId && (
          <Button onClick={handleAddNew} className="flex items-center gap-2" disabled={isLoading}>
            <Plus className="w-4 h-4" />
            Add New Address
          </Button>
        )}
      </div>


      {addresses.length === 0 && !isAddingNew ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No addresses yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first address to make checkout faster and easier.
            </p>
            <Button onClick={handleAddNew} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Street Address</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">City</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">State</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">ZIP Code</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Country</th>
                  <th className="text-center py-3 px-4 font-medium text-foreground">Default</th>
                  <th className="text-center py-3 px-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {addresses.map((address) => (
                  <tr 
                    key={address.id} 
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <span className="font-medium">{address.streetAddress}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{address.city}</td>
                    <td className="py-4 px-4 text-muted-foreground">{address.state}</td>
                    <td className="py-4 px-4 text-muted-foreground">{address.zipCode}</td>
                    <td className="py-4 px-4 text-muted-foreground">{address.country}</td>
                    <td className="py-4 px-4 text-center">
                      {address.isDefault && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(address)}
                          disabled={editingId === address.id || isSubmitting}
                          title="Edit address"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(address.id)}
                          disabled={isSubmitting}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {(isAddingNew || editingId) && (
            <div className="mt-6">
              {renderAddressForm()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddressesSection;