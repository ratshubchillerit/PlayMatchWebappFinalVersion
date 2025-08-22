import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginPageProps {
  onSwitchToSignUp: () => void;
  onSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp, onSuccess }) => {
  const { signIn, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { data, error } = await signIn(formData.email, formData.password);
      if (error) {
        setErrors({ submit: error });
        return;
      }
      if (data?.user) {
        onSuccess();
      }
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Login failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 transform rotate-12 scale-150"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-center">
            <div className="mb-4">
              <i className="fas fa-futbol text-4xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold text-white font-orbitron">Welcome Back</h1>
            <p className="text-gray-200 mt-2">Sign in to continue your sports journey</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {(errors.submit || authError) && (
              <div className="bg-red-600 text-white p-4 rounded-lg text-sm">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                {errors.submit || authError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 pl-12 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Enter your email"
                />
                <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 pl-12 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Enter your password"
                />
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </>
              )}
            </button>

            {/* Demo Credentials */}
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">
                <i className="fas fa-info-circle mr-2 text-blue-400"></i>
                Demo Account Available
              </p>
              <p className="text-xs text-gray-400">
                Create a new account or use your existing credentials to access the platform
              </p>
            </div>
          </form>

          <div className="bg-gray-700 px-8 py-4">
            <p className="text-center text-gray-400">
              Don't have an account?
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-emerald-400 hover:text-emerald-300 ml-2 transition-colors font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: 'fas fa-users', count: '10K+', label: 'Players' },
            { icon: 'fas fa-map-marker-alt', count: '500+', label: 'Turfs' },
            { icon: 'fas fa-trophy', count: '25K+', label: 'Matches' }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center backdrop-blur-sm">
              <i className={`${stat.icon} text-xl text-emerald-400 mb-2`}></i>
              <div className="text-white font-bold">{stat.count}</div>
              <div className="text-gray-400 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;