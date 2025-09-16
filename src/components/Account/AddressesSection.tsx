import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../UI';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const AddressesSection: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      street: 'No2 Kobape Road Apt. along Lagos',
      city: 'Abeokuta',
      state: 'Ogun',
      zipCode: '234810565869',
      country: 'Nigeria',
      isDefault: true
    }
  ]);
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    isDefault: false
  });

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
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria',
      isDefault: false
    });
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
  };

  const handleSave = () => {
    if (isAddingNew) {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData
      };
      
      // If this is set as default, remove default from others
      if (formData.isDefault) {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
      }
      
      setAddresses(prev => [...prev, newAddress]);
      setIsAddingNew(false);
    } else if (editingId) {
      // If this is set as default, remove default from others
      if (formData.isDefault) {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
      }
      
      setAddresses(prev => prev.map(addr => 
        addr.id === editingId ? { ...addr, ...formData } : addr
      ));
      setEditingId(null);
    }
    
    setFormData({
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria',
      isDefault: false
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria',
      isDefault: false
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Street Address</label>
          <Input
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            placeholder="Street Address"
          />
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
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isAddingNew ? 'Add Address' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">My Addresses</h2>
        {!isAddingNew && !editingId && (
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Address
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id} className="relative">
            <CardContent className="p-6">
              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Default
                  </span>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.country}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(address)}
                  disabled={editingId === address.id}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(isAddingNew || editingId) && renderAddressForm()}
      </div>
    </div>
  );
};

export default AddressesSection;