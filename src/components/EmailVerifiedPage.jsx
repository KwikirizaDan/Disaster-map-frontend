import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EmailVerifiedPage = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false); // guard against double calls in StrictMode

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasVerified.current) {
        console.log('⚠️ Skipping duplicate verification attempt');
        return;
      }
      hasVerified.current = true;

      try {
        console.log('🔍 Verifying code:', code);
        const response = await fetch(`http://127.0.0.1:5000/auth/verify-email/${code}`, {
          method: 'GET',
          credentials: 'include',
        });

        console.log('📊 Response status:', response.status);

        const responseText = await response.text();
        console.log('📄 Response text:', responseText);

        if (response.ok) {
          try {
            const data = JSON.parse(responseText);
            console.log('✅ Success data:', data);
            setVerificationStatus('success');
            setMessage(data.message || 'Email verified successfully!');

            setTimeout(() => {
              navigate('/login', {
                state: { message: 'Email verified successfully! You can now log in.' }
              });
            }, 2000);
          } catch (jsonError) {
            console.error('❌ JSON parse error:', jsonError);
            setVerificationStatus('error');
            setMessage('Invalid response from server. Please try again.');
          }
        } else {
          try {
            const errorData = JSON.parse(responseText);
            console.log('❌ Error data:', errorData);
            setVerificationStatus('error');
            setMessage(errorData.message || `Verification failed (Status: ${response.status})`);
          } catch (errorJsonError) {
            console.error('❌ Error response parse failed:', errorJsonError);
            setVerificationStatus('error');
            setMessage(`Verification failed with status: ${response.status}`);
          }
        }
      } catch (error) {
        console.error('🌐 Network error:', error);
        setVerificationStatus('error');
        setMessage('Network error. Please check your connection and try again.');
      }
    };

    if (code) {
      verifyEmail();
    } else {
      setVerificationStatus('error');
      setMessage('No verification code provided.');
    }
  }, [code, navigate]);

  if (verificationStatus === 'verifying') {
    return (
      <div className="bg-gray-50 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl text-center">
          <div className="animate-pulse">
            <div className="bg-blue-100 p-4 rounded-full inline-block">
              <div className="h-12 w-12 bg-blue-600 rounded-full mx-auto"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
          <p className="text-gray-600">Please wait while we confirm your email address.</p>
          <p className="text-sm text-gray-500">Code: {code}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl text-center">
        
        {/* Status Indicator */}
        <div className="flex justify-center">
          <div className={`p-4 rounded-full ${
            verificationStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <div className={`h-12 w-12 rounded-full mx-auto ${
              verificationStatus === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}></div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900">
          {verificationStatus === 'success' ? 'Email Verified!' : 'Verification Failed'}
        </h2>
        
        {/* Message */}
        <div className="space-y-4">
          <p className={`text-lg ${
            verificationStatus === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </p>
          
          {verificationStatus === 'success' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 text-sm">
                You will be redirected to the login page shortly...
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          {verificationStatus === 'success' ? (
            <button
              onClick={() => navigate('/login', { 
                state: { message: 'Email verified successfully! You can now log in.' } 
              })}
              className="w-full rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              Go to Login Now
            </button>
          ) : (
            <button
              onClick={() => navigate('/register')}
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
            >
              Try Registering Again
            </button>
          )}
        </div>

        {/* Debug info */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Verification code: {code}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
