import React, { useState } from 'react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onProfileClick: () => void;
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  setActiveSection, 
  onProfileClick, 
  isAuthenticated, 
  user, 
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'matchmaking', label: 'Find Match', icon: 'fas fa-search' },
    { id: 'teams', label: 'Teams', icon: 'fas fa-users' },
    { id: 'turfs', label: 'Turfs', icon: 'fas fa-map-marker-alt' },
    { id: 'contact', label: 'Contact', icon: 'fas fa-envelope' }
  ];

  return (
    <header className="bg-gray-800 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-emerald-400 font-orbitron">
                <i className="fas fa-futbol mr-2"></i>
                PlayMatch
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <i className={`${item.icon} mr-2`}></i>
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* User Profile / Auth */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <>
                  <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-3">
                    <i className="fas fa-bell text-lg"></i>
                  </button>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-300 text-sm">
                      Welcome, {user?.profile?.full_name || user?.profile?.username || user?.email} 
                      {user?.profile?.role === 'admin' && <span className="text-emerald-400 ml-1">(Admin)</span>}
                      {user?.profile?.role === 'turf_owner' && <span className="text-blue-400 ml-1">(Turf Owner)</span>}
                    </span>
                    <button 
                      onClick={onProfileClick}
                      className={`${
                        user?.profile?.role === 'admin' ? 'bg-purple-600 hover:bg-purple-700' :
                        user?.profile?.role === 'turf_owner' ? 'bg-blue-600 hover:bg-blue-700' :
                        'bg-emerald-600 hover:bg-emerald-700'
                      } rounded-full p-2 transition-all duration-300`}
                    >
                      <i className="fas fa-user text-white"></i>
                    </button>
                    <button
                      onClick={onLogout}
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      <i className="fas fa-sign-out-alt mr-1"></i>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-300">
                  Please sign in to access PlayMatch
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <i className={`${item.icon} mr-2`}></i>
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-600 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      onProfileClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-300"
                  >
                    <i className="fas fa-user mr-2"></i>
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-300"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-3 py-2 text-gray-300">
                  Please sign in to access PlayMatch
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;