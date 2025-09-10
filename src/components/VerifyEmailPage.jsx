import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmailPage = () => {
  const { code } = useParams();
  const { verifyEmail } = useAuth();
  const [message, setMessage] = useState('Verifying your email...');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const doVerification = async () => {
      if (code) {
        const result = await verifyEmail(code);
        setMessage(result.message);
        setSuccess(result.success);
      } else {
        setMessage('No verification code provided.');
      }
    };

    doVerification();
  }, [code, verifyEmail]);

  return (
    <div className="bg-[var(--dark-bg)] text-white flex items-center justify-center h-screen">
      <div className="bg-[var(--main-container-bg)] p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className={`text-lg ${success ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
        {success && (
          <p className="mt-4">
            You can now <Link to="/login" className="text-[var(--accent-blue)] hover:underline">log in</Link>.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
