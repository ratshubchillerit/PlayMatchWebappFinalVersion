import React from 'react';

interface HeroProps {
  onAction: (action: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onAction }) => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 transform rotate-12 scale-150"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 font-orbitron"
            data-aos="fade-up"
          >
            Connect. Play. 
            <span className="text-emerald-400">Compete.</span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Join the ultimate sports matchmaking platform. Find players, book turfs, 
            create teams, and dominate the game.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <button 
              onClick={() => onAction('findMatch')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-search mr-2"></i>
              Find a Match
            </button>
            <button 
              onClick={() => onAction('createTeam')}
              className="border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <i className="fas fa-users mr-2"></i>
              Create Team
            </button>
            <button 
              onClick={() => onAction('signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Sign Up Free
            </button>
          </div>
        </div>
        
        {/* Stats Section */}
        <div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {[
            { icon: 'fas fa-users', count: '10,000+', label: 'Active Players' },
            { icon: 'fas fa-map-marker-alt', count: '500+', label: 'Available Turfs' },
            { icon: 'fas fa-trophy', count: '25,000+', label: 'Matches Played' }
          ].map((stat, index) => (
            <div key={index} className="text-center bg-gray-800 bg-opacity-50 rounded-lg p-6 backdrop-blur-sm">
              <i className={`${stat.icon} text-3xl text-emerald-400 mb-4`}></i>
              <div className="text-3xl font-bold text-white font-orbitron">{stat.count}</div>
              <div className="text-gray-300 font-inter">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;