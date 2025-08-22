import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if we have real Supabase credentials
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key';
};

// Database types
export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  email?: string;
  role: 'player' | 'admin' | 'turf_owner';
  sport?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  location?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Turf {
  id: number;
  name: string;
  location: string;
  description?: string;
  hourly_rate: number;
  amenities: string[];
  sports: number[];
  image_url?: string;
  rating: number;
  is_active: boolean;
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  sport_id: number;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  captain_id: string;
  max_members: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: number;
  title: string;
  description?: string;
  sport_id: number;
  turf_id: number;
  organizer_id: string;
  match_date: string;
  duration_minutes: number;
  max_participants: number;
  current_participants: number;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Auth helper functions
export const authHelpers = {
  // Sign up with username and password
  async signUp(email: string, password: string, userData: { username: string; full_name: string; sport?: string; skill_level?: string; location?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }
};

// Database helper functions
export const dbHelpers = {
  // Profile operations
  async getProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Turf operations
  async getTurfs() {
    const { data, error } = await supabase
      .from('turfs')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });
    return { data, error };
  },

  async getTurf(id: number) {
    const { data, error } = await supabase
      .from('turfs')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Team operations
  async createTeam(teamData: Omit<Team, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select()
      .single();
    return { data, error };
  },

  async getTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        sport:sports(name),
        captain:profiles(username, full_name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getUserTeams(userId: string) {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        *,
        team:teams(
          *,
          sport:sports(name)
        )
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  // Match operations
  async getMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        sport:sports(name),
        turf:turfs(name, location),
        organizer:profiles(username, full_name)
      `)
      .eq('status', 'scheduled')
      .gte('match_date', new Date().toISOString())
      .order('match_date', { ascending: true });
    return { data, error };
  },

  async createMatch(matchData: Omit<Match, 'id' | 'created_at' | 'updated_at' | 'current_participants'>) {
    const { data, error } = await supabase
      .from('matches')
      .insert([{ ...matchData, current_participants: 0 }])
      .select()
      .single();
    return { data, error };
  },

  // Booking operations
  async createBooking(bookingData: {
    turf_id: number;
    user_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    total_amount: number;
  }) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    return { data, error };
  },

  async getUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        turf:turfs(name, location)
      `)
      .eq('user_id', userId)
      .order('booking_date', { ascending: false });
    return { data, error };
  },

  // Check turf availability
  async checkTurfAvailability(turfId: number, date: string, timeSlot: string) {
    const startTime = timeSlot + ':00';
    const endHour = parseInt(timeSlot.split(':')[0]) + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:00:00`;
    
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('turf_id', turfId)
      .eq('booking_date', date)
      .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime})`)
      .eq('status', 'confirmed');
    
    // If no conflicting bookings found, slot is available
    return { data: !data || data.length === 0, error };
  },

  // Get user's bookings with details
  async getUserBookingsDetailed(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        turf:turfs(
          name,
          location,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('booking_date', { ascending: false });
    return { data, error };
  },

  // Cancel booking
  async cancelBooking(bookingId: number) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();
    return { data, error };
  },

  // Admin operations
  async getStats() {
    const [usersResult, matchesResult, turfsResult, bookingsResult] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('matches').select('id', { count: 'exact' }),
      supabase.from('turfs').select('id', { count: 'exact' }),
      supabase.from('bookings').select('total_amount').eq('payment_status', 'paid')
    ]);

    const totalRevenue = bookingsResult.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    return {
      totalUsers: usersResult.count || 0,
      totalMatches: matchesResult.count || 0,
      totalTurfs: turfsResult.count || 0,
      totalRevenue
    };
  }
};