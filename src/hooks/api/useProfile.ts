import { useState, useCallback } from 'react';
import { profileApi, type UpdateProfileRequest } from '../../api/profile';
import { apiErrorUtils } from '../../utils/api-errors';
import type { UserProfile, ProfileUpdateData, PasswordUpdateData } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';

// Hook for managing user profile
export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateProfile: updateAuthProfile } = useAuthStore();

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await profileApi.getProfile();
      
      // Map API response to UserProfile
      const userProfile: UserProfile = {
        id: response.data.profile.buyerId,
        email: response.data.profile.emailAddress,
        firstName: response.data.profile.firstName,
        lastName: response.data.profile.lastName,
        phone: response.data.profile.phoneNumber || undefined,
        isActive: response.data.profile.isActive === '1',
        isEmailVerified: response.data.profile.isEmailVerified === '1',
        verifiedAt: response.data.profile.verifiedAt,
        createdAt: response.data.profile.createdAt,
        updatedAt: response.data.profile.updatedAt,
        addresses: response.data.addresses.map(addr => ({
          id: addr.id,
          streetAddress: addr.streetAddress,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          country: addr.country,
          isDefault: addr.isDefault,
          createdAt: addr.createdAt,
          updatedAt: addr.updatedAt,
        })),
      };

      setProfile(userProfile);
      
      // Update auth store with latest profile data
      updateAuthProfile({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
      });

    } catch (err) {
      const errorMessage = apiErrorUtils.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [updateAuthProfile]);

  // Update profile information
  const updateProfile = useCallback(async (data: ProfileUpdateData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData: UpdateProfileRequest = {};
      
      if (data.firstName !== undefined) {
        updateData.firstName = data.firstName;
      }
      if (data.lastName !== undefined) {
        updateData.lastName = data.lastName;
      }

      await profileApi.updateProfile(updateData);
      
      // Refresh profile data after successful update
      await fetchProfile();

    } catch (err) {
      const errorMessage = apiErrorUtils.getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  // Update password
  const updatePassword = useCallback(async (data: PasswordUpdateData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData: UpdateProfileRequest = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      };

      await profileApi.updateProfile(updateData);

    } catch (err) {
      const errorMessage = apiErrorUtils.getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    updatePassword,
  };
};