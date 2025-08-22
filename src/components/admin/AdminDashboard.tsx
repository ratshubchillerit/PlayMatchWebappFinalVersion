import React, { useState } from 'react';
import DatabaseStatus from '../DatabaseStatus';

interface AdminDashboardProps {
  openModal: (content: any) => void;
  onBack: () => void;
  user: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ openModal, onBack, user }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
    { id: 'users', label: 'Users', icon: 'fas fa-users' },
    { id: 'matches', label: 'Matches', icon: 'fas fa-futbol' },
    { id: 'turfs', label: 'Turfs', icon: 'fas fa-map-marker-alt' },
    { id: 'teams', label: 'Teams', icon: 'fas fa-users-cog' },
    { id: 'bookings', label: 'Bookings', icon: 'fas fa-calendar-check' },
    { id: 'revenue', label: 'Revenue', icon: 'fas fa-dollar-sign' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' }
  ];

  const overviewStats = [
    { title: 'Total Users', value: '12,847', change: '+12%', icon: 'fas fa-users', color: 'bg-blue-600' },
    { title: 'Active Matches', value: '1,234', change: '+8%', icon: 'fas fa-futbol', color: 'bg-emerald-600' },
    { title: 'Total Turfs', value: '567', change: '+15%', icon: 'fas fa-map-marker-alt', color: 'bg-purple-600' },
    { title: 'Monthly Revenue', value: '৳2,45,000', change: '+23%', icon: 'fas fa-dollar-sign', color: 'bg-orange-600' }
  ];

  const recentUsers = [
    { name: 'Alex Johnson', email: 'alex@example.com', sport: 'Football', joinDate: '2025-01-15', status: 'active' },
    { name: 'Sarah Williams', email: 'sarah@example.com', sport: 'Basketball', joinDate: '2025-01-14', status: 'active' },
    { name: 'Mike Davis', email: 'mike@example.com', sport: 'Cricket', joinDate: '2025-01-13', status: 'inactive' },
    { name: 'Emma Brown', email: 'emma@example.com', sport: 'Tennis', joinDate: '2025-01-12', status: 'active' }
  ];

  const recentMatches = [
    { id: 1, sport: 'Football', teams: 'Thunder Bolts vs Lightning', turf: 'Green Valley', date: '2025-01-15', status: 'completed' },
    { id: 2, sport: 'Basketball', teams: 'Court Kings vs Hoops', turf: 'City Sports Center', date: '2025-01-15', status: 'ongoing' },
    { id: 3, sport: 'Cricket', teams: 'Elite vs Champions', turf: 'Cricket Ground', date: '2025-01-14', status: 'completed' },
    { id: 4, sport: 'Tennis', teams: 'Ace vs Serve', turf: 'Tennis Club', date: '2025-01-14', status: 'scheduled' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-emerald-400 text-sm mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} rounded-full p-3`}>
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Monthly Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 78, 82, 95, 88, 92, 100].map((height, index) => (
              <div key={index} className="flex-1 bg-emerald-600 rounded-t" style={{ height: `${height}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between text-gray-400 text-sm mt-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Sport Distribution</h3>
          <div className="space-y-4">
            {[
              { sport: 'Football', percentage: 45, color: 'bg-emerald-600' },
              { sport: 'Cricket', percentage: 25, color: 'bg-blue-600' },
              { sport: 'Basketball', percentage: 20, color: 'bg-purple-600' },
              { sport: 'Tennis', percentage: 10, color: 'bg-orange-600' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.sport}</span>
                  <span className="text-gray-400">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-emerald-600 rounded-full p-2 mr-3">
                    <i className="fas fa-user text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-300 text-sm">{user.sport}</p>
                  <span className={`text-xs px-2 py-1 rounded ${user.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Recent Matches</h3>
          <div className="space-y-3">
            {recentMatches.map((match, index) => (
              <div key={index} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-white font-semibold">{match.teams}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    match.status === 'completed' ? 'bg-green-600 text-white' :
                    match.status === 'ongoing' ? 'bg-blue-600 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {match.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{match.sport} • {match.turf}</p>
                <p className="text-gray-500 text-xs">{match.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">User Management</h3>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
          <i className="fas fa-plus mr-2"></i>Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-gray-300 pb-3">Name</th>
              <th className="text-gray-300 pb-3">Email</th>
              <th className="text-gray-300 pb-3">Sport</th>
              <th className="text-gray-300 pb-3">Join Date</th>
              <th className="text-gray-300 pb-3">Status</th>
              <th className="text-gray-300 pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-3 text-white">{user.name}</td>
                <td className="py-3 text-gray-300">{user.email}</td>
                <td className="py-3 text-gray-300">{user.sport}</td>
                <td className="py-3 text-gray-300">{user.joinDate}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${user.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                    {user.status}
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
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'matches': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Match Management</h3><p className="text-gray-300 mt-4">Match management features coming soon...</p></div>;
      case 'turfs': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Turf Management</h3><p className="text-gray-300 mt-4">Turf management features coming soon...</p></div>;
      case 'teams': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Team Management</h3><p className="text-gray-300 mt-4">Team management features coming soon...</p></div>;
      case 'bookings': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Booking Management</h3><p className="text-gray-300 mt-4">Booking management features coming soon...</p></div>;
      case 'revenue': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">Revenue Analytics</h3><p className="text-gray-300 mt-4">Revenue analytics coming soon...</p></div>;
      case 'settings': return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><h3 className="text-2xl font-bold text-white">System Settings</h3><p className="text-gray-300 mt-4">System settings coming soon...</p></div>;
      default: return renderOverview();
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
            <h2 className="text-xl font-bold text-white font-orbitron">Admin Panel</h2>
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
        <DatabaseStatus />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-orbitron mb-2">
            {sidebarItems.find(item => item.id === activeTab)?.label || 'Overview'}
          </h1>
          <p className="text-gray-300">Welcome back, {user?.name}! Here's what's happening with PlayMatch.</p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;