import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseKey ? 'Set' : 'Missing'
  });
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthUser {
  email: string;
  password: string;
}

export interface CleaningSchedule {
  id?: number;
  schedule_date: string;
  status: 'pending' | 'completed';
  created_by: string;
  created_at?: string;
}

export interface LogEntry {
  id?: number;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  component: string;
  message: string;
}

export interface ProcessedLog {
  id?: number;
  amount: number;
  timestamp: string;
  user_email: string;
}

export const authService = {
  register: async ({ email, password }: AuthUser) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  login: async ({ email, password }: AuthUser) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Log the login
      await supabase.from('user_login_logs').insert([{
        user_id: data.user.id,
        action: 'login',
        email: data.user.email
      }]);

      return data;
    } catch (error) {
      if (!(error instanceof Error)) {
        throw new Error('Login failed. Please try again.');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        // Log the logout before actually logging out
        await supabase.from('user_login_logs').insert([{
          user_id: user.id,
          action: 'logout',
          email: user.email || ''
        }]);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

export const cleaningScheduleService = {
  getSchedules: async () => {
    const { data, error } = await supabase
      .from('schedule_logs')
      .select('*')
      .order('schedule_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  addSchedule: async (schedule: { schedule_date: string; status: 'pending' | 'completed'; created_by: string }) => {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('schedule_logs')
      .insert([{
        schedule_date: schedule.schedule_date,
        status: schedule.status,
        created_by: user.id
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  updateScheduleStatus: async (id: number, status: 'pending' | 'completed') => {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('schedule_logs')
      .update({ status })
      .eq('id', id)
      .eq('created_by', user.id) // Only allow updating own schedules
      .select();
    
    if (error) throw error;
    return data[0];
  },

  deleteSchedule: async (id: number) => {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('schedule_logs')
      .delete()
      .eq('id', id)
      .eq('created_by', user.id); // Only allow deleting own schedules
    
    if (error) throw error;
  }
};

export const logsService = {
  getLogs: async () => {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  addLog: async (log: Omit<LogEntry, 'id'>) => {
    const { data, error } = await supabase
      .from('logs')
      .insert([log])
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

export const processedLogsService = {
  // Add a new processed log
  addProcessedLog: async (amount: number, user_email: string) => {
    try {
      const { data, error } = await supabase
        .from('processed_logs')
        .insert([
          {
            amount,
            timestamp: new Date().toISOString(),
            user_email,
          },
        ])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error adding processed log:', error);
      throw error;
    }
  },

  // Get all processed logs
  getProcessedLogs: async () => {
    try {
      const { data, error } = await supabase
        .from('processed_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching processed logs:', error);
      throw error;
    }
  },
};