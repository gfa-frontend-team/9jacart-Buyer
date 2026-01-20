import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
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
      // Pass only the ID Token (JWT from Google) to parent component
      onSuccess(credentialResponse.credential);
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
