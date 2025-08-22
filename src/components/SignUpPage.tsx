import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface SignUpPageProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSwitchToLogin, onSuccess }) => {
  const { signUp, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    sport: '',
    skillLevel: '',
    location: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const validateStep1 = () => {
    const newErrors: any = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};

    if (!formData.sport) {
      newErrors.sport = 'Please select your favorite sport';
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = 'Please select your skill level';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    try {
      const userData = {
        username: formData.username,
        full_name: formData.full_name,
        sport: formData.sport,
        skill_level: formData.skillLevel,
        location: formData.location
      };
      
      const { data, error } = await signUp(formData.email, formData.password, userData);
      if (error) {
        setErrors({ submit: error });
        return;
      }
      if (data?.user) {
        onSuccess();
      }
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Registration failed' });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-orbitron">Join PlayMatch</h1>
        <p className="text-gray-300">Create your account to start connecting with players</p>
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
            <div className="w-16 h-1 bg-gray-600"></div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
          </div>
        </div>
      </div>

      {(errors.submit || authError) && (
        <div className="bg-red-600 text-white p-4 rounded-lg text-sm">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {errors.submit || authError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full bg-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            placeholder="Choose a unique username"
          />
          {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full bg-gray-700 border ${errors.full_name ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            placeholder="Enter your full name"
          />
          {errors.full_name && <p className="text-red-400 text-sm mt-1">{errors.full_name}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
          placeholder="Enter your email address"
        />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            placeholder="Create a strong password"
          />
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNextStep}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Continue to Sports Preferences
        <i className="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-orbitron">Sports Preferences</h1>
        <p className="text-gray-300">Tell us about your sports interests and location</p>
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              <i className="fas fa-check"></i>
            </div>
            <div className="w-16 h-1 bg-emerald-600"></div>
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
          </div>
        </div>
      </div>

      {(errors.submit || authError) && (
        <div className="bg-red-600 text-white p-4 rounded-lg text-sm">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {errors.submit || authError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Favorite Sport <span className="text-red-400">*</span>
          </label>
          <select
            name="sport"
            value={formData.sport}
            onChange={handleChange}
            className={`w-full bg-gray-700 border ${errors.sport ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
          >
            <option value="">Select your favorite sport</option>
            <option value="Football">⚽ Football</option>
            <option value="Cricket">🏏 Cricket</option>
            <option value="Basketball">🏀 Basketball</option>
            <option value="Tennis">🎾 Tennis</option>
            <option value="Badminton">🏸 Badminton</option>
            <option value="Volleyball">🏐 Volleyball</option>
            <option value="Table Tennis">🏓 Table Tennis</option>
          </select>
          {errors.sport && <p className="text-red-400 text-sm mt-1">{errors.sport}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skill Level <span className="text-red-400">*</span>
          </label>
          <select
            name="skillLevel"
            value={formData.skillLevel}
            onChange={handleChange}
            className={`w-full bg-gray-700 border ${errors.skillLevel ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
          >
            <option value="">Select your skill level</option>
            <option value="beginner">🌱 Beginner (Just starting out)</option>
            <option value="intermediate">⭐ Intermediate (Some experience)</option>
            <option value="advanced">🏆 Advanced (Very experienced)</option>
            <option value="professional">👑 Professional (Competitive level)</option>
          </select>
          {errors.skillLevel && <p className="text-red-400 text-sm mt-1">{errors.skillLevel}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Location <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full bg-gray-700 border ${errors.location ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
          placeholder="Enter your city or area"
        />
        {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
        <p className="text-gray-400 text-sm mt-1">This helps us find matches and turfs near you</p>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">🎯 What you'll get:</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Smart matchmaking based on your preferences</li>
          <li>• Connect with players of similar skill level</li>
          <li>• Book turfs and organize matches</li>
          <li>• Track your performance and progress</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handlePrevStep}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Creating Account...
            </>
          ) : (
            <>
              <i className="fas fa-user-plus mr-2"></i>
              Create Account
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 transform rotate-12 scale-150"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </form>

          <div className="bg-gray-700 px-8 py-4">
            <p className="text-center text-gray-400">
              Already have an account?
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-emerald-400 hover:text-emerald-300 ml-2 transition-colors font-semibold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: 'fas fa-search', title: 'Find Matches', desc: 'Smart matchmaking' },
            { icon: 'fas fa-users', title: 'Join Teams', desc: 'Connect with players' },
            { icon: 'fas fa-map-marker-alt', title: 'Book Turfs', desc: 'Reserve venues' }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center backdrop-blur-sm">
              <i className={`${feature.icon} text-2xl text-emerald-400 mb-2`}></i>
              <h3 className="text-white font-semibold">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;