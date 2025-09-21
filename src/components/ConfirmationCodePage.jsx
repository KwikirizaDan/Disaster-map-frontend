import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ConfirmationCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || 'your email';

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-xl text-center">
        
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
        
        <div className="space-y-3 text-gray-600">
          <p>We've sent a verification email to:</p>
          <p className="font-semibold text-blue-600 break-all">{email}</p>
          <p>Please check your inbox and click the verification link to activate your account.</p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
          <p><strong>Note:</strong> The verification link may take a few minutes to arrive. Don't forget to check your spam folder.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Return to Login
          </button>
          
          <p className="text-sm text-gray-500">
            Didn't receive the email?{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-500"
            >
              Contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationCodePage;