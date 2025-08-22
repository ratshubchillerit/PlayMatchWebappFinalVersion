import React from 'react';

import BookingForm from './BookingForm';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  const renderModalContent = () => {
    switch (content.type) {
      case 'nextMatch':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Next Match Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <i className="fas fa-calendar text-emerald-400 mr-3"></i>
                <span className="text-gray-300">{content.match}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock text-emerald-400 mr-3"></i>
                <span className="text-gray-300">{content.time}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-emerald-400 mr-3"></i>
                <span className="text-gray-300">{content.venue}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-users text-emerald-400 mr-3"></i>
                <span className="text-gray-300">{content.players}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                Get Directions
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                Share Match
              </button>
            </div>
          </div>
        );

      case 'teamMembers':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Team Members</h2>
            <div className="space-y-4">
              {content.members.map((member, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-emerald-600 rounded-full p-2 mr-3">
                      <i className="fas fa-user text-white"></i>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{member.name}</p>
                      <p className="text-gray-400 text-sm">{member.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                    <span className="text-gray-400 text-sm">{member.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'bookedTurfs':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Booked Turfs</h2>
            <div className="space-y-4">
              {content.allBookings && content.allBookings.length > 0 ? (
                content.allBookings.map((booking, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold mb-2">{booking.turf?.name || 'Unknown Turf'}</h3>
                        <div className="flex justify-between text-gray-300 mb-2">
                          <span><i className="fas fa-calendar mr-2"></i>{new Date(booking.booking_date).toLocaleDateString()}</span>
                          <span><i className="fas fa-clock mr-2"></i>{booking.start_time} - {booking.end_time}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-400">৳{booking.total_amount}</span>
                          <span className={`px-2 py-1 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-600' : booking.status === 'cancelled' ? 'bg-red-600' : 'bg-yellow-600'}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => content.onCancelBooking(booking.id)}
                          className="text-red-400 hover:text-red-300 ml-4"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                content.bookings.map((booking, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">{booking.turf}</h3>
                  <div className="flex justify-between text-gray-300">
                    <span><i className="fas fa-calendar mr-2"></i>{booking.date}</span>
                    <span><i className="fas fa-clock mr-2"></i>{booking.time}</span>
                  </div>
                </div>
                ))
              )}
              {(!content.allBookings || content.allBookings.length === 0) && content.bookings.length === 0 && (
                <p className="text-gray-400 text-center py-4">No bookings found</p>
              )}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Performance Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{content.stats.wins}</div>
                <div className="text-gray-300">Wins</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{content.stats.losses}</div>
                <div className="text-gray-300">Losses</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{content.stats.goals}</div>
                <div className="text-gray-300">Goals</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{content.stats.assists}</div>
                <div className="text-gray-300">Assists</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 font-orbitron">{content.stats.winRate}</div>
              <div className="text-gray-300">Win Rate</div>
            </div>
          </div>
        );

      case 'teamDetails':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">{content.team.name}</h2>
            <img src={content.team.image} alt={content.team.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Sport:</span>
                <span className="text-white">{content.team.sport}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Members:</span>
                <span className="text-white">{content.team.members}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Record:</span>
                <span className="text-white">{content.team.wins}W - {content.team.losses}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Your Role:</span>
                <span className="text-emerald-400">{content.team.role}</span>
              </div>
            </div>
          </div>
        );

      case 'turfDetails':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">{content.turf.name}</h2>
            <img src={content.turf.image} alt={content.turf.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Location:</span>
                <span className="text-white">{content.turf.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Price:</span>
                <span className="text-emerald-400 font-bold">{content.turf.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Rating:</span>
                <span className="text-white">
                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  {content.turf.rating}
                </span>
              </div>
              <div>
                <span className="text-gray-300">Amenities:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.turf.amenities.map((amenity, index) => (
                    <span key={index} className="bg-gray-700 text-emerald-400 text-xs px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'booking':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Book {content.turf.name}</h2>
            <BookingForm 
              turf={content.turf}
              initialDate={content.date}
              onConfirmBooking={content.onConfirmBooking}
              checkAvailability={content.checkAvailability}
              loading={content.loading}
              user={content.user}
              onClose={onClose}
            />
          </div>
        );

      case 'joinMatch':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Join Match</h2>
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Match Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Sport:</span>
                  <span className="text-white capitalize">{content.match.sport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Venue:</span>
                  <span className="text-white">{content.match.turf}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Time:</span>
                  <span className="text-white">{content.match.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Players:</span>
                  <span className="text-white">{content.match.players}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Skill Level:</span>
                  <span className="text-white">{content.match.skillLevel}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Position (Optional)</label>
                <select className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select Position</option>
                  <option value="forward">Forward</option>
                  <option value="midfielder">Midfielder</option>
                  <option value="defender">Defender</option>
                  <option value="goalkeeper">Goalkeeper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message to Team (Optional)</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Introduce yourself to the team..."
                ></textarea>
              </div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                <i className="fas fa-check mr-2"></i>
                Confirm Join Request
              </button>
            </div>
          </div>
        );

      case 'teamCreated':
        return (
          <div className="text-center">
            <i className="fas fa-check-circle text-6xl text-emerald-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-white mb-4 font-orbitron">Team Created Successfully!</h2>
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">{content.team.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Sport:</span>
                  <span className="text-white capitalize">{content.team.sport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Skill Level:</span>
                  <span className="text-white capitalize">{content.team.skillLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Created:</span>
                  <span className="text-white">{content.team.createdAt}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Your team has been created! You can now invite players and start organizing matches.
            </p>
            <div className="flex gap-4">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                <i className="fas fa-user-plus mr-2"></i>
                Invite Players
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                <i className="fas fa-calendar-plus mr-2"></i>
                Schedule Match
              </button>
            </div>
          </div>
        );

      case 'joinTeamRequest':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Request to Join Team</h2>
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">{content.team.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Sport:</span>
                  <span className="text-white">{content.team.sport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Skill Level:</span>
                  <span className="text-white">{content.team.skillLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Open Slots:</span>
                  <span className="text-emerald-400">{content.team.openSlots}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Experience</label>
                <select className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select your experience level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="advanced">Advanced (5+ years)</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Position</label>
                <select className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select preferred position</option>
                  <option value="forward">Forward</option>
                  <option value="midfielder">Midfielder</option>
                  <option value="defender">Defender</option>
                  <option value="goalkeeper">Goalkeeper</option>
                  <option value="any">Any Position</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join?</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                  placeholder="Tell the team why you'd be a great addition..."
                ></textarea>
              </div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                <i className="fas fa-paper-plane mr-2"></i>
                Send Join Request
              </button>
            </div>
          </div>
        );
      default:
        return <div className="text-white">No content available</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          {renderModalContent()}
        </div>
      </div>
    </div>
  );
};

export default Modal;