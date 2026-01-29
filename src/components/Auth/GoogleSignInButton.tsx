import React, { useEffect } from 'react';
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

  useEffect(() => {
    // Force Google button to maintain full width
    const styleId = 'google-signin-full-width-style';
    let style = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .google-signin-wrapper,
        .google-signin-wrapper > div,
        .google-signin-wrapper iframe,
        div[id*="google-signin"],
        div[id*="google-signin"] > div,
        iframe[id*="google-signin"],
        div[data-testid*="google-signin"],
        div[data-testid*="google-signin"] > div {
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Also use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      const googleElements = document.querySelectorAll('.google-signin-wrapper div[id*="google-signin"], .google-signin-wrapper iframe[id*="google-signin"], .google-signin-wrapper iframe');
      googleElements.forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.width = '100%';
        htmlEl.style.minWidth = '100%';
        htmlEl.style.maxWidth = '100%';
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      // Don't remove the style element as it might be used by other instances
    };
  }, []);

  return (
    <div className={`w-full min-w-full google-signin-wrapper ${disabled ? 'pointer-events-none opacity-50' : ''}`} style={{ width: '100%', minWidth: '100%' }}>
      <div className="w-full min-w-full" style={{ width: '100%', minWidth: '100%' }}>
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
    </div>
  );
};
