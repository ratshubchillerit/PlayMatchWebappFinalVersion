import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dbHelpers } from '../lib/supabase';

interface TurfsProps {
  openModal: (content: any) => void;
  user: any;
}

const Turfs: React.FC<TurfsProps> = ({ openModal, user }) => {
  const { user: authUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [filteredTurfs, setFilteredTurfs] = useState([]);

  const mockTurfs = [
    {
      id: 1,
      name: 'Green Valley Sports Complex',
      location: 'Downtown Area',
      sports: ['Football', 'Cricket'],
      price: '৳500/hour',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600',
      amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Refreshments'],
      availability: {
        'morning': ['6:00 AM', '7:00 AM', '8:00 AM'],
        'afternoon': ['2:00 PM', '3:00 PM', '4:00 PM'],
        'evening': ['6:00 PM', '7:00 PM', '8:00 PM']
      }
    },
    {
      id: 2,
      name: 'City Sports Center',
      location: 'Central Business District',
      sports: ['Basketball', 'Badminton'],
      price: '৳400/hour',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600',
      amenities: ['AC', 'Parking', 'Lockers', 'Water'],
      availability: {
        'morning': ['7:00 AM', '8:00 AM', '9:00 AM'],
        'afternoon': ['1:00 PM', '2:00 PM', '3:00 PM'],
        'evening': ['5:00 PM', '6:00 PM', '7:00 PM']
      }
    },
    {
      id: 3,
      name: 'Elite Sports Club',
      location: 'Premium District',
      sports: ['Tennis', 'Squash'],
      price: '৳800/hour',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600',
      amenities: ['Premium Facilities', 'Spa', 'Restaurant', 'Valet Parking'],
      availability: {
        'morning': ['6:00 AM', '7:00 AM', '8:00 AM'],
        'afternoon': ['12:00 PM', '1:00 PM', '2:00 PM'],
        'evening': ['6:00 PM', '7:00 PM', '8:00 PM']
      }
    }
  ];

  // Load turfs from database
  React.useEffect(() => {
    loadTurfs();
  }, [selectedSport]);

  // Filter turfs when turfs or selectedSport changes
  React.useEffect(() => {
    if (turfs.length > 0) {
      if (selectedSport) {
        const filtered = turfs.filter(turf => 
          turf.sports && turf.sports.includes(selectedSport)
        );
        setFilteredTurfs(filtered);
      } else {
        setFilteredTurfs(turfs);
      }
    }
  }, [turfs, selectedSport]);

  const loadTurfs = async () => {
    setLoading(true);
    try {
      const { data, error } = await dbHelpers.getTurfs();
      if (error) {
        console.error('Error loading turfs:', error);
        // Fallback to mock data
        setTurfs(mockTurfs);
      } else {
        // If no real turfs, use mock data for demo
        const turfsData = Array.isArray(data) && data.length > 0 ? data : mockTurfs;
        setTurfs(turfsData);
      }
    } catch (err) {
      console.error('Error:', err);
      setTurfs(mockTurfs);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (turfId: number, date: string, timeSlot: string) => {
    try {
      const { data, error } = await dbHelpers.checkTurfAvailability(turfId, date, timeSlot);
      return !error && data;
    } catch (err) {
      console.error('Error checking availability:', err);
      return true; // Assume available if check fails
    }
  };

  const createBooking = async (bookingData: any) => {
    if (!authUser) {
      alert('Please log in to make a booking');
      return;
    }

    setBookingLoading(true);
    try {
      const { data, error } = await dbHelpers.createBooking({
        ...bookingData,
        user_id: authUser.id
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error('Booking error:', err);
      throw err;
    } finally {
      setBookingLoading(false);
    }
  };

  const openTurfDetails = (turf) => {
    openModal({
      type: 'turfDetails',
      turf: turf
    });
  };

  const handleBooking = (turf, timeSlot = null) => {
    openModal({
      type: 'booking',
      turf: turf,
      timeSlot: timeSlot,
      date: selectedDate,
      onConfirmBooking: createBooking,
      checkAvailability: checkAvailability,
      loading: bookingLoading,
      user: authUser
    });
  };

  return (
    <section className="py-16 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-12"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">
            Available Turfs
          </h2>
          <p className="text-xl text-gray-300 font-inter">
            Book premium sports facilities for your perfect game
          </p>
        </div>

        {/* Filters */}
        <div 
          className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sport</label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Sports</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
                <option value="Badminton">Badminton</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                <i className="fas fa-search mr-2"></i>
                Search Turfs
              </button>
            </div>
          </div>
        </div>

        {/* Turfs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mb-4"></div>
            <p className="text-gray-300">Loading turfs...</p>
          </div>
        ) : (
        <>
          {filteredTurfs.length === 0 && turfs.length > 0 && (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-600 mb-4"></i>
              <p className="text-gray-300 text-lg">No turfs found for the selected sport</p>
              <p className="text-gray-400">Try selecting a different sport or clear the filter</p>
            </div>
          )}
          
          {filteredTurfs.length === 0 && turfs.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-map-marker-alt text-4xl text-gray-600 mb-4"></i>
              <p className="text-gray-300 text-lg">No turfs available</p>
              <p className="text-gray-400">Check back later for new venues</p>
            </div>
          )}

          {filteredTurfs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredTurfs.map((turf, index) => (
                <div
                  key={turf.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative">
                    <img
                      src={turf.image_url || turf.image}
                      alt={turf.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white px-2 py-1 rounded text-sm font-semibold">
                      <i className="fas fa-star mr-1"></i>
                      {turf.rating}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 font-orbitron">{turf.name}</h3>
                    <p className="text-gray-300 mb-2">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      {turf.location}
                    </p>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Sports Available:</p>
                      <div className="flex flex-wrap gap-2">
                        {(turf.sports || []).map((sport) => (
                          <span
                            key={sport}
                            className="bg-gray-700 text-emerald-400 text-xs px-2 py-1 rounded"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {(turf.amenities || []).slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="text-xs text-gray-400"
                          >
                            <i className="fas fa-check text-emerald-400 mr-1"></i>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-emerald-400 font-orbitron">
                        ৳{turf.hourly_rate || turf.price?.replace('৳', '').replace('/hour', '') || '500'}/hour
                      </span>
                      <button
                        onClick={() => openTurfDetails(turf)}
                        className="text-emerald-400 hover:text-emerald-300 text-sm"
                      >
                        View Details <i className="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                    <button
                      onClick={() => handleBooking(turf, null)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                    >
                      <i className="fas fa-calendar-plus mr-2"></i>
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
        )}
      </div>
    </section>
  );
};

export default Turfs;