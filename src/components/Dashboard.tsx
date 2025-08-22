import React from 'react';
import { dbHelpers } from '../lib/supabase';

interface DashboardProps {
  openModal: (content: any) => void;
  onBack?: () => void;
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ openModal, onBack, user }) => {
  const [userBookings, setUserBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user?.id) {
      loadUserBookings();
    }
  }, [user]);

  const loadUserBookings = async () => {
    try {
      const { data, error } = await dbHelpers.getUserBookingsDetailed(user.id);
      if (!error && data) {
        setUserBookings(data);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const { error } = await dbHelpers.cancelBooking(bookingId);
      if (!error) {
        loadUserBookings(); // Refresh bookings
        alert('Booking cancelled successfully');
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      alert('Error cancelling booking');
    }
  };

  const dashboardCards = [
    {
      title: 'Next Match',
      icon: 'fas fa-clock',
      content: 'Football vs Thunder Bolts',
      subtitle: 'Tomorrow at 6:00 PM',
      color: 'bg-emerald-600',
      details: {
        type: 'nextMatch',
        match: 'Football vs Thunder Bolts',
        time: 'Tomorrow at 6:00 PM',
        venue: 'Green Valley Sports Complex',
        players: '10/22 confirmed'
      }
    },
    {
      title: 'Team Members',
      icon: 'fas fa-users',
      content: '8 Active Members',
      subtitle: '2 new requests',
      color: 'bg-blue-600',
      details: {
        type: 'teamMembers',
        members: [
          { name: 'Alex Johnson', position: 'Forward', status: 'online' },
          { name: 'Sarah Williams', position: 'Midfielder', status: 'offline' },
          { name: 'Mike Davis', position: 'Defender', status: 'online' },
          { name: 'Emma Brown', position: 'Goalkeeper', status: 'online' }
        ]
      }
    },
    {
      title: 'Booked Turfs',
      icon: 'fas fa-map-marker-alt',
      content: '3 Upcoming Bookings',
      subtitle: 'Next: Today 7 PM',
      color: 'bg-orange-600',
      details: {
        type: 'bookedTurfs',
        bookings: [
          ...userBookings.slice(0, 3).map(booking => ({
            id: booking.id,
            turf: booking.turf?.name || 'Unknown Turf',
            date: new Date(booking.booking_date).toLocaleDateString(),
            time: booking.start_time,
            status: booking.status,
            onCancel: () => handleCancelBooking(booking.id)
          }))
        ],
        allBookings: userBookings,
        onCancelBooking: handleCancelBooking
      }
    },
    {
      title: 'Performance',
      icon: 'fas fa-chart-line',
      content: '15 Wins, 3 Losses',
      subtitle: '83% Win Rate',
      color: 'bg-purple-600',
      details: {
        type: 'performance',
        stats: {
          wins: 15,
          losses: 3,
          draws: 2,
          goals: 24,
          assists: 12,
          winRate: '83%'
        }
      }
    }
  ];

  return (
    <section className="py-16 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Home
            </button>
          </div>
        )}
        
        <div 
          className="text-center mb-12"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">
            {onBack ? 'Your Dashboard' : 'Dashboard Overview'}
          </h2>
          <p className="text-xl text-gray-300 font-inter">
            Track your performance, manage teams, and stay on top of your game
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} rounded-lg p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onClick={() => openModal(card.details)}
            >
              <div className="flex items-center justify-between mb-4">
                <i className={`${card.icon} text-2xl`}></i>
                <i className="fas fa-arrow-right text-sm opacity-70"></i>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 font-orbitron">{card.title}</h3>
              <p className="text-2xl font-bold mb-1 font-inter">{card.content}</p>
              <p className="text-sm opacity-80 font-inter">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;