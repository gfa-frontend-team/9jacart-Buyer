import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Alert } from '../../components/UI';
import { useAuthStore } from '../../store/useAuthStore';
import { Mail, CheckCircle } from 'lucide-react';

const RegistrationSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { pendingVerification } = useAuthStore();

  // Redirect if no pending verification
  React.useEffect(() => {
    if (!pendingVerification) {
      navigate('/auth/register');
    }
  }, [pendingVerification, navigate]);

  if (!pendingVerification) {
    return null;
  }

  return (
    <div className="text-center">
      <div className="border border-[#C8E6C8] rounded-lg p-8 bg-[#F8FEF8] shadow-sm">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-gray-600">
            We've sent a verification code to your email address.
          </p>
        </div>

        <Alert variant="default" className="mb-6 border-green-200 bg-green-50 text-green-800" showIcon={false}>
          <div className="text-center">
            <p className="font-medium flex items-center justify-center gap-2 mb-1">
              <Mail className="w-4 h-4" />
              Check your email
            </p>
            <p className="text-sm">
              We sent a 5-digit verification code to{' '}
              <span className="font-medium">{pendingVerification.identifier}</span>
            </p>
          </div>
        </Alert>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/auth/verify-email')}
            className="w-full"
          >
            Verify Email Address
          </Button>

          <div className="text-sm text-gray-600">
            Didn't receive the email?{' '}
            <Link 
              to="/auth/verify-email" 
              className="font-medium text-green-800 hover:text-green-900"
            >
              Resend verification code
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Link 
              to="/auth/register" 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;