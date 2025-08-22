import React from 'react';

const About: React.FC = () => {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">
            About PlayMatch
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter">
            Revolutionizing how athletes connect, compete, and excel in their favorite sports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div 
            className="space-y-6"
            data-aos="fade-right"
          >
            <h3 className="text-2xl font-bold text-white font-orbitron">
              Connecting Sports Enthusiasts Worldwide
            </h3>
            
            <p className="text-gray-300 text-lg font-inter leading-relaxed">
              PlayMatch was born from a simple idea: sports should bring people together, not keep them apart. 
              We recognized that finding the right players, teams, and venues was often the biggest barrier 
              to enjoying the sports we love.
            </p>
            
            <p className="text-gray-300 text-lg font-inter leading-relaxed">
              Our platform eliminates these barriers by creating an intelligent matchmaking system that 
              considers your skill level, location, schedule, and sport preferences to connect you with 
              the perfect playing opportunities.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-emerald-600 rounded-full p-2 mr-4">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
                <span className="text-gray-300 font-inter">Smart matchmaking algorithm</span>
              </div>
              
              <div className="flex items-center">
                <div className="bg-emerald-600 rounded-full p-2 mr-4">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
                <span className="text-gray-300 font-inter">Verified turf partnerships</span>
              </div>
              
              <div className="flex items-center">
                <div className="bg-emerald-600 rounded-full p-2 mr-4">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
                <span className="text-gray-300 font-inter">Community-driven platform</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-2 gap-6"
            data-aos="fade-left"
          >
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2 font-orbitron">10K+</div>
              <div className="text-gray-300 font-inter">Active Players</div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2 font-orbitron">500+</div>
              <div className="text-gray-300 font-inter">Partner Turfs</div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2 font-orbitron">25K+</div>
              <div className="text-gray-300 font-inter">Matches Played</div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2 font-orbitron">15+</div>
              <div className="text-gray-300 font-inter">Sports Supported</div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div 
          className="mt-20 text-center bg-gradient-to-r from-emerald-900 to-blue-900 rounded-lg p-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h3 className="text-2xl font-bold text-white mb-4 font-orbitron">Our Mission</h3>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto font-inter leading-relaxed">
            To create a world where every athlete, regardless of skill level or location, 
            can easily find their perfect match and experience the joy of competitive sports 
            in a supportive, inclusive community.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;