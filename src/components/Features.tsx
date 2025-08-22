import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      icon: 'fas fa-search',
      title: 'Smart Matchmaking',
      description: 'Our intelligent algorithm matches you with players and games based on your skill level, location, and preferences.',
      color: 'bg-emerald-600'
    },
    {
      icon: 'fas fa-users',
      title: 'Team Management',
      description: 'Create and manage teams, invite players, track performance, and build lasting connections with fellow athletes.',
      color: 'bg-blue-600'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Turf Booking',
      description: 'Book premium sports facilities with real-time availability, secure payments, and instant confirmations.',
      color: 'bg-purple-600'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Performance Tracking',
      description: 'Monitor your progress with detailed statistics, match history, and personalized insights to improve your game.',
      color: 'bg-orange-600'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Optimized',
      description: 'Access PlayMatch anywhere with our responsive design that works perfectly on all devices.',
      color: 'bg-pink-600'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security, and our platform ensures reliable service 24/7.',
      color: 'bg-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter">
            Everything you need to elevate your sports experience and connect with the community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`${feature.color} rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                <i className={`${feature.icon} text-2xl text-white`}></i>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 font-orbitron">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 font-inter leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div 
          className="mt-20 text-center"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg p-12">
            <h3 className="text-3xl font-bold text-white mb-4 font-orbitron">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-gray-100 mb-8 font-inter">
              Join thousands of athletes already using PlayMatch to find their perfect game
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <i className="fas fa-user-plus mr-2"></i>
                Sign Up Free
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-play mr-2"></i>
                Watch Demo
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                <i className="fas fa-play mr-2"></i>
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;