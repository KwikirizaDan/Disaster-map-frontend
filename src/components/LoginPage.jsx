import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check for success message from navigation state (after email verification)
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state so message doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback('');
    setSuccessMessage(''); // Clear success message when attempting to login
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setFeedback(result.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (response.ok) {
        toast.success('Confirmation code sent to your email!');
        navigate('/confirm-code', { state: { email: forgotPasswordEmail } });
      } else {
        toast.error('Failed to send confirmation code. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="bg-gray-50 flex items-center justify-center min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Log in to access the disaster heat map.</p>
          </div>
          
          {/* Success Message Banner */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{successMessage}</span>
              </div>
            </div>
          )}
          
          {!showForgotPassword ? (
            <>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 pb-2">
                    Email or Username
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      person
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="Enter your email or username"
                      className="form-input block w-full rounded-md border-gray-300 bg-gray-50 py-3 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 pb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      lock
                    </span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      placeholder="Enter your password"
                      className="form-input block w-full rounded-md border-gray-300 bg-gray-50 py-3 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    />
                  </div>
                </div>
                {feedback && <p className="text-center text-sm text-red-500">{feedback}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white disabled:bg-gray-400"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
              
              <div className="text-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot your password?
                </button>
              </div>
              
              <p className="mt-4 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </>
          ) : (
            <>
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Enter your email to receive a confirmation code
                  </p>
                </div>
                
                <div>
                  <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 pb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      mail
                    </span>
                    <input
                      type="email"
                      id="forgotEmail"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      placeholder="Enter your email address"
                      className="form-input block w-full rounded-md border-gray-300 bg-gray-50 py-3 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white"
                >
                  Send Confirmation Code
                </button>
              </form>
              
              <div className="text-center">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPage;