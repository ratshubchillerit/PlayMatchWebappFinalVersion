import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DatabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    turfs: 0,
    matches: 0,
    bookings: 0
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Test database connection
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (!error) {
        setIsConnected(true);
        await fetchRealStats();
      }
    } catch (err) {
      console.log('Database not connected - using mock data');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealStats = async () => {
    try {
      const [usersRes, turfsRes, matchesRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('turfs').select('id', { count: 'exact' }),
        supabase.from('matches').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' })
      ]);

      setStats({
        users: usersRes.count || 0,
        turfs: turfsRes.count || 0,
        matches: matchesRes.count || 0,
        bookings: bookingsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-yellow-600 text-white p-4 rounded-lg mb-4">
        <div className="flex items-center">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Checking database connection...
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg mb-4 ${isConnected ? 'bg-green-600' : 'bg-red-600'} text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <i className={`fas ${isConnected ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2`}></i>
          <span className="font-semibold">
            {isConnected ? 'Database Connected' : 'Database Not Connected'}
          </span>
        </div>
        {!isConnected && (
          <button 
            onClick={() => window.open('https://supabase.com', '_blank')}
            className="bg-white text-red-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100"
          >
            Connect to Supabase
          </button>
        )}
      </div>
      
      <div className="mt-2 text-sm">
        {isConnected ? (
          <div className="grid grid-cols-4 gap-4 mt-3">
            <div className="text-center">
              <div className="font-bold text-lg">{stats.users}</div>
              <div className="text-xs opacity-90">Real Users</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.turfs}</div>
              <div className="text-xs opacity-90">Real Turfs</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.matches}</div>
              <div className="text-xs opacity-90">Real Matches</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.bookings}</div>
              <div className="text-xs opacity-90">Real Bookings</div>
            </div>
          </div>
        ) : (
          <div>
            Currently showing <strong>mock data</strong>. Connect to Supabase to see real database information.
            <div className="mt-2 text-xs opacity-90">
              • User registrations will be stored in database<br/>
              • Team creation will persist data<br/>
              • Bookings will be saved and tracked<br/>
              • Admin dashboard will show real statistics
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseStatus;