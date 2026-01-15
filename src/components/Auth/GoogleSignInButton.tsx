import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { config } from '../../lib/config';

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string, accessToken: string) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  text?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
  text = 'Continue with Google',
}) => {
  const handleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      // Get the access token from config (set in .env file)
      const accessToken = config.auth.google.accessToken;
      
      if (!accessToken) {
        if (onError) {
          onError(new Error('Google access token is not configured. Please add VITE_GOOGLE_ACCESS_TOKEN to your .env file.'));
        }
        return;
      }
      
      // Pass both the ID Token (JWT from Google) and Access Token to parent component
      onSuccess(credentialResponse.credential, accessToken);
    } else {
      if (onError) {
        onError(new Error('No credential received from Google'));
      }
    }
  };

  const handleError = () => {
    if (onError) {
      onError(new Error('Google sign-in was cancelled or failed'));
    }
  };

  return (
    <div className={`w-full ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={text === 'Sign up with Google' ? 'signup_with' : 'continue_with'}
        shape="rectangular"
        theme="outline"
        size="large"
        width="100%"
        logo_alignment="left"
      />
    </div>
  );
};
