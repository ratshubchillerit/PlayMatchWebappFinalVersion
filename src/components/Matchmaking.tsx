import React, { useState } from 'react';

interface MatchmakingProps {
  openModal: (content: any) => void;
  user: any;
}

const Matchmaking: React.FC<MatchmakingProps> = ({ openModal, user }) => {
  const [filters, setFilters] = useState({
    sport: '',
    location: '',
    time: '',
    skillLevel: '',
    radius: 5
  });

  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    if (!filters.sport || !filters.location || !filters.time) {
      alert('Please fill in all required fields (Sport, Location, and Time)');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSearchResult({
      turf: 'Green Valley Sports Complex',
      time: filters.time || '6:00 PM',
      players: '8/22 joined',
      skillLevel: filters.skillLevel || 'Intermediate',
      distance: '2.3 km away',
      matchId: Date.now(),
      sport: filters.sport,
      location: filters.location
    });
    
    setIsSearching(false);
  };

  const handleJoinMatch = () => {
    if (!searchResult) return;
    
    openModal({
      type: 'joinMatch',
      match: searchResult,
      user: user
    });
  };

  const handleGetDirections = () => {
    if (!searchResult) return;
    
    // Simulate opening directions
    const destination = encodeURIComponent(searchResult.turf + ', ' + searchResult.location);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, '_blank');
  };
  return (
    <section className="py-16 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-12"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">
            Find Your Perfect Match
          </h2>
          <p className="text-xl text-gray-300 font-inter">
            Set your preferences and we'll connect you with players and available turfs
          </p>
        </div>

        <div 
          className="bg-gray-800 rounded-lg p-8 shadow-lg"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Sport Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sport <span className="text-red-400">*</span>
              </label>
              <select
                value={filters.sport}
                onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
                className={`w-full bg-gray-700 border ${!filters.sport ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              >
                <option value="">Select Sport</option>
                <option value="football">Football</option>
                <option value="cricket">Cricket</option>
                <option value="basketball">Basketball</option>
                <option value="tennis">Tennis</option>
                <option value="badminton">Badminton</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="Enter your location"
                className={`w-full bg-gray-700 border ${!filters.location ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                value={filters.time}
                onChange={(e) => setFilters({ ...filters, time: e.target.value })}
                className={`w-full bg-gray-700 border ${!filters.time ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              />
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skill Level</label>
              <select
                value={filters.skillLevel}
                onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select Skill Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>

          {/* Radius Slider */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Radius: {filters.radius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.radius}
              onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {isSearching ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Searching for matches...
              </>
            ) : (
              <>
                <i className="fas fa-search mr-2"></i>
                Find Match
              </>
            )}
          </button>
        </div>

        {/* Search Results */}
        {searchResult && (
          <div 
            className="mt-8 bg-gray-800 rounded-lg p-8 shadow-lg"
            data-aos="fade-up"
          >
            <h3 className="text-2xl font-bold text-white mb-6 font-orbitron">
              <i className="fas fa-check-circle text-emerald-400 mr-2"></i>
              Match Found!
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-emerald-400 mr-3"></i>
                  <span className="text-gray-300">{searchResult.turf}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-clock text-emerald-400 mr-3"></i>
                  <span className="text-gray-300">{searchResult.time}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-users text-emerald-400 mr-3"></i>
                  <span className="text-gray-300">{searchResult.players}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-star text-emerald-400 mr-3"></i>
                  <span className="text-gray-300">{searchResult.skillLevel}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-route text-emerald-400 mr-3"></i>
                  <span className="text-gray-300">{searchResult.distance}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-futbol text-emerald-400 mr-3"></i>
                  <span className="text-gray-300">{searchResult.sport}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                onClick={handleJoinMatch}
                <i className="fas fa-plus mr-2"></i>
                Join Match
              </button>
              <button className="flex-1 border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-gray-900 font-semibold py-3 rounded-lg transition-all duration-300">
                onClick={handleGetDirections}
                <i className="fas fa-directions mr-2"></i>
                Get Directions
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Matchmaking;