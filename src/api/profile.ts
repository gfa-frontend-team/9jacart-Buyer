import { apiClient } from './client';

// Profile API request types
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

// Profile API response types
export interface ProfileData {
  buyerId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
  isActive: string;
  isEmailVerified: string;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddressData {
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

export interface ProfileResponse {
  status: number;
  error: boolean;
  data: {
    profile: ProfileData;
    addresses: AddressData[];
  };
}

export interface UpdateProfileResponse {
  status: number;
  error: boolean;
  message: string;
}

// Profile API endpoints
export const profileApi = {
  // Get user profile (requires Bearer token)
  getProfile: async (): Promise<ProfileResponse> => {
    return apiClient.get<ProfileResponse>('/buyer/profile', undefined, true);
  },

  // Update user profile (requires Bearer token)
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    return apiClient.put<UpdateProfileResponse>('/buyer/profile/edit', data, undefined, true);
  },
};