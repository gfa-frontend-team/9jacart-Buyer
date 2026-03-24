import { apiClient } from './client';

// Address API request types
export interface AddAddressRequest {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: number; // 1 for true, 0 for false
  guestCheckout?: number; // 0 for authenticated (required by backend)
}

export interface EditAddressRequest {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: number; // 1 for true, 0 for false
  guestCheckout?: number; // 0 for authenticated (required by backend)
}

// Address API response types
export interface AddressApiResponse {
  id: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AddAddressResponse {
  status: number;
  error: boolean;
  message: string;
  data?: {
    address: AddressApiResponse;
  };
}

export interface EditAddressResponse {
  status: number;
  error: boolean;
  message: string;
  data?: {
    address: AddressApiResponse;
  };
}

export interface DeleteAddressResponse {
  status: number;
  error: boolean;
  message: string;
}

// Address API endpoints
export const addressApi = {
  // Add new address (requires Bearer token)
  addAddress: async (data: AddAddressRequest): Promise<AddAddressResponse> => {
    const payload = { ...data, guestCheckout: 0 };
    return apiClient.post<AddAddressResponse>('/buyer/address', payload, undefined, true);
  },

  // Edit existing address (requires Bearer token) - Uses POST per API docs
  editAddress: async (id: string, data: EditAddressRequest): Promise<EditAddressResponse> => {
    const payload = { ...data, guestCheckout: 0 };
    return apiClient.post<EditAddressResponse>(`/buyer/address/edit/${id}`, payload, undefined, true);
  },

  // Delete address (requires Bearer token)
  deleteAddress: async (id: string): Promise<DeleteAddressResponse> => {
    return apiClient.delete<DeleteAddressResponse>(`/buyer/address/delete/${id}`, undefined, true);
  },
};

// Helper functions for data transformation
export const transformAddressToApi = (
  streetAddress: string,
  city: string,
  state: string,
  zipCode: string,
  country: string,
  isDefault: boolean
): AddAddressRequest => ({
  streetAddress,
  city,
  state,
  zipCode,
  country,
  isDefault: isDefault ? 1 : 0,
});

export const parseAddressFromApi = (apiAddress: AddressApiResponse) => {
  return {
    id: apiAddress.id,
    streetAddress: apiAddress.streetAddress,
    city: apiAddress.city,
    state: apiAddress.state,
    zipCode: apiAddress.zipCode,
    country: apiAddress.country,
    isDefault: apiAddress.isDefault,
    createdAt: apiAddress.createdAt,
    updatedAt: apiAddress.updatedAt,
  };
};