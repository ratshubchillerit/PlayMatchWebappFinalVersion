import React, { useState } from 'react';

interface TurfManagementProps {
  openModal: (content: any) => void;
  onBack: () => void;
  user: any;
}

const TurfManagement: React.FC<TurfManagementProps> = ({ openModal, onBack, user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-pie' },
    { id: 'bookings', label: 'Bookings', icon: 'fas fa-calendar-check' },
    { id: 'availability', label: 'Availability', icon: 'fas fa-clock' },
    { id: 'pricing', label: 'Pricing', icon: 'fas fa-dollar-sign' },
    { id: 'maintenance', label: 'Maintenance', icon: 'fas fa-tools' },
    { id: 'reviews', label: 'Reviews', icon: 'fas fa-star' },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' }
  ];

  const turfStats = [
    { title: 'Today\'s Bookings', value: '12', change: '+3', icon: 'fas fa-calendar-check', color: 'bg-emerald-600' },
    { title: 'Weekly Revenue', value: '৳45,000', change: '+15%', icon: 'fas fa-dollar-sign', color: 'bg-blue-600' },
    { title: 'Utilization Rate', value: '78%', change: '+5%', icon: 'fas fa-chart-line', color: 'bg-purple-600' },
    { title: 'Average Rating', value: '4.8', change: '+0.2', icon: 'fas fa-star', color: 'bg-orange-600' }
  ];

  const todayBookings = [
    { time: '06:00 - 07:00', team: 'Thunder Bolts', sport: 'Football', status: 'confirmed', payment: '৳500' },
    { time: '07:00 - 08:00', team: 'Morning Runners', sport: 'Football', status: 'confirmed', payment: '৳500' },
    { time: '08:00 - 09:00', team: 'Elite Squad', sport: 'Football', status: 'pending', payment: '৳500' },
    { time: '18:00 - 19:00', team: 'Evening Warriors', sport: 'Football', status: 'confirmed', payment: '৳600' },
    { time: '19:00 - 20:00', team: 'Night Owls', sport: 'Football', status: 'confirmed', payment: '৳600' },
    { time: '20:00 - 21:00', team: 'Late Legends', sport: 'Football', status: 'cancelled', payment: '৳600' }
  ];

  const weeklySchedule = [
    { day: 'Monday', bookings: 8, revenue: '৳4,200', utilization: '67%' },
    { day: 'Tuesday', bookings: 10, revenue: '৳5,500', utilization: '83%' },
    { day: 'Wednesday', bookings: 12, revenue: '৳6,800', utilization: '100%' },
    { day: 'Thursday', bookings: 9, revenue: '৳4,900', utilization: '75%' },
    { day: 'Friday', bookings: 11, revenue: '৳6,200', utilization: '92%' },
    { day: 'Saturday', bookings: 14, revenue: '৳8,400', utilization: '100%' },
    { day: 'Sunday', bookings: 13, revenue: '৳7,800', utilization: '100%' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {turfStats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-emerald-400 text-sm mt-1">{stat.change} from yesterday</p>
              </div>
              <div className={`${stat.color} rounded-full p-3`}>
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Today's Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-gray-300 pb-3">Time Slot</th>
                <th className="text-gray-300 pb-3">Team/Player</th>
                <th className="text-gray-300 pb-3">Sport</th>
                <th className="text-gray-300 pb-3">Status</th>
                <th className="text-gray-300 pb-3">Payment</th>
                <th className="text-gray-300 pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayBookings.map((booking, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-3 text-white font-semibold">{booking.time}</td>
                  <td className="py-3 text-gray-300">{booking.team}</td>
                  <td className="py-3 text-gray-300">{booking.sport}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-600 text-white' :
                      booking.status === 'pending' ? 'bg-yellow-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 text-emerald-400 font-semibold">{booking.payment}</td>
                  <td className="py-3">
                    <button className="text-blue-400 hover:text-blue-300 mr-3">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <i className="fas fa-times"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Weekly Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weeklySchedule.map((day, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 text-center">
              <h4 className="text-white font-semibold mb-2">{day.day}</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-400 text-xs">Bookings</p>
                  <p className="text-emerald-400 font-bold">{day.bookings}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Revenue</p>
                  <p className="text-blue-400 font-bold">{day.revenue}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Utilization</p>
                  <p className="text-purple-400 font-bold">{day.utilization}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">All Bookings</h3>
        <div className="flex gap-4">
          <select className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
            <i className="fas fa-plus mr-2"></i>Add Booking
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-gray-300 pb-3">Date</th>
              <th className="text-gray-300 pb-3">Time</th>
              <th className="text-gray-300 pb-3">Customer</th>
              <th className="text-gray-300 pb-3">Sport</th>
              <th className="text-gray-300 pb-3">Duration</th>
              <th className="text-gray-300 pb-3">Amount</th>
              <th className="text-gray-300 pb-3">Status</th>
              <th className="text-gray-300 pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, i) => (
              <tr key={i} className="border-b border-gray-700">
                <td className="py-3 text-white">2025-01-{15 + i}</td>
                <td className="py-3 text-gray-300">{6 + i}:00 PM</td>
                <td className="py-3 text-gray-300">Team {i + 1}</td>
                <td className="py-3 text-gray-300">Football</td>
                <td className="py-3 text-gray-300">1 hour</td>
                <td className="py-3 text-emerald-400">৳{500 + i * 50}</td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded text-xs bg-green-600 text-white">
                    Confirmed
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-blue-400 hover:text-blue-300 mr-3">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'bookings': return renderBookings();
      case 'availability': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Availability Management</h3><p className="text-gray-300 mt-4">Availability management features coming soon...</p></div>;
      case 'pricing': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Pricing Management</h3><p className="text-gray-300 mt-4">Pricing management features coming soon...</p></div>;
      case 'maintenance': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Maintenance Schedule</h3><p className="text-gray-300 mt-4">Maintenance scheduling features coming soon...</p></div>;
      case 'reviews': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Customer Reviews</h3><p className="text-gray-300 mt-4">Review management features coming soon...</p></div>;
      case 'analytics': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Analytics & Reports</h3><p className="text-gray-300 mt-4">Analytics features coming soon...</p></div>;
      case 'settings': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Turf Settings</h3><p className="text-gray-300 mt-4">Settings management coming soon...</p></div>;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 shadow-lg">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="text-emerald-400 hover:text-emerald-300 mr-4"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h2 className="text-xl font-bold text-white font-orbitron">Turf Panel</h2>
          </div>
          
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-white font-semibold">Green Valley Complex</h3>
            <p className="text-gray-400 text-sm">Football Turf</p>
            <div className="flex items-center mt-2">
              <i className="fas fa-star text-yellow-400 mr-1"></i>
              <span className="text-white text-sm">4.8 Rating</span>
            </div>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <i className={`${item.icon} mr-3`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-orbitron mb-2">
            {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <p className="text-gray-300">Manage your turf operations and track performance.</p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default TurfManagement;