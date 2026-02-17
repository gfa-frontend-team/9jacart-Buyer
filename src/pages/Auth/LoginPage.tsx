import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Input, Button, Alert } from '../../components/UI';
import { GoogleSignInButton } from '../../components/Auth';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../api/auth';
import { config } from '../../lib/config';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, googleLogin, isLoading } = useAuthStore();

  const resetSuccess = (location.state as { resetSuccess?: boolean } | null)?.resetSuccess ?? false;

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(config.auth.rememberMeKey) !== 'false';
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password, rememberMe);
      
      // Redirect to the intended page or home
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setError('');
    try {
      await googleLogin(idToken, rememberMe);
      
      // Redirect to the intended page or home
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.');
    }
  };

  const handleGoogleError = (error: Error) => {
    setError(error.message);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    const email = forgotPasswordEmail.trim() || formData.email.trim();
    if (!email) {
      setForgotPasswordError('Please enter your email address.');
      return;
    }
    setForgotPasswordLoading(true);
    try {
      const response = await authApi.forgotPassword({ emailAddress: email });
      setForgotPasswordSuccess(response.message || 'Password reset OTP sent successfully. Please check your email.');
      setForgotPasswordEmail('');
      // Navigate to reset-password with identifier and verificationId so user can enter OTP and new password
      const identifier = response.data?.identifier ?? email;
      const verificationId = response.data?.verificationId;
      navigate('/auth/reset-password', {
        state: { identifier, verificationId },
        replace: false,
      });
    } catch (err) {
      setForgotPasswordError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordSuccess('');
    setForgotPasswordError('');
  };

  return (
    <div className="border border-[#C8E6C8] rounded-lg p-8 bg-[#F8FEF8] shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {showForgotPassword ? 'Forgot your password?' : 'Sign in to your account'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {showForgotPassword ? (
            <>Enter your email and we&apos;ll send you reset instructions.</>
          ) : (
            <>
              Don't have an account?{' '}
              <Link to="/auth/register" className="font-medium text-[#1E4700] hover:text-[#1E4700]/80">
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>

      {resetSuccess && (
        <Alert variant="success" className="mb-6">
          Your password has been reset. You can sign in with your new password.
        </Alert>
      )}

      {showForgotPassword ? (
        <>
          {forgotPasswordSuccess && (
            <Alert variant="success" className="mb-6">
              {forgotPasswordSuccess}
            </Alert>
          )}
          {forgotPasswordError && (
            <Alert variant="destructive" className="mb-6">
              {forgotPasswordError}
            </Alert>
          )}
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={forgotPasswordEmail || formData.email}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full !border-gray-400"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleBackToSignIn}
                disabled={forgotPasswordLoading}
              >
                Back to sign in
              </Button>
              <Button
                type="submit"
                className="flex-1 !text-[#1E4700]"
                disabled={forgotPasswordLoading}
              >
                {forgotPasswordLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <>
          {error && (
            <Alert variant="destructive" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full !border-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pr-10 border-gray-400"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordEmail(formData.email);
                    setShowForgotPassword(true);
                    setForgotPasswordSuccess('');
                    setForgotPasswordError('');
                  }}
                  className="font-medium text-[#1E4700] hover:text-[#1E4700]/80"
                >
                  Forgot your password?
                </button>
              </div>
              
            </div>

            <Button
              type="submit"
              className="w-full !text-[#1E4700]"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </>
      )}

      {!showForgotPassword && (
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#F8FEF8] text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isLoading}
          />
        </div>
      </div>
      )}

    </div>
  );
};

export default LoginPage;