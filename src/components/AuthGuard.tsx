import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, error } = useAuth();
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2 font-orbitron">Loading PlayMatch</h2>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error if there's an authentication error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
          <h2 className="text-2xl font-bold text-white mb-4 font-orbitron">Authentication Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            <i className="fas fa-refresh mr-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show login modal if user is not authenticated
  if (!user) {
    return (
      <>
        {authMode === 'login' ? (
          <LoginPage 
            onSwitchToSignUp={() => setAuthMode('signup')}
            onSuccess={() => {}}
          />
        ) : (
          <SignUpPage 
            onSwitchToLogin={() => setAuthMode('login')}
            onSuccess={() => {}}
          />
        )}
      </>
    );
  }

  // User is authenticated, show the main app
  return <>{children}</>;
};

export default AuthGuard;