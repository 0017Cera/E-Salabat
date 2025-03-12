import { useState, useEffect } from 'react';
import { PageContainer } from '../components/PageContainer';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ScheduleLog {
  id: number;
  created_at: string;
  schedule_date: string;
  status: 'pending' | 'completed';
  created_by: string; // This is the UUID
  user_email?: string; // Add this to store the user's email
}

interface UserLoginLog {
  id: number;
  timestamp: string;
  user_id: string;
  action: 'login' | 'logout';
  email: string;
}

interface ProcessedLog {
  id: number;
  amount: number;
  timestamp: string;
  user_email: string;
}

export function Logs() {
  const [scheduleLogs, setScheduleLogs] = useState<ScheduleLog[]>([]);
  const [loginLogs, setLoginLogs] = useState<UserLoginLog[]>([]);
  const [processedLogs, setProcessedLogs] = useState<ProcessedLog[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Fetch processed logs
      const { data: processed, error: processedError } = await supabase
        .from('processed_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (processedError) {
        console.error('Processed logs error:', processedError);
        toast.error(`Failed to load processed logs: ${processedError.message}`);
      } else {
        setProcessedLogs(processed || []);
      }

      // Fetch schedule logs
      const { data: schedules, error: schedulesError } = await supabase
        .from('schedule_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (schedulesError) {
        console.error('Schedule logs error:', schedulesError);
        toast.error(`Failed to load schedule logs: ${schedulesError.message}`);
      } else {
        setScheduleLogs(schedules || []);
      }

      // Fetch login logs
      const { data: logins, error: loginsError } = await supabase
        .from('user_login_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (loginsError) {
        console.error('Login logs error:', loginsError);
        toast.error(`Failed to load login logs: ${loginsError.message}`);
      } else {
        setLoginLogs(logins || []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'text-green-600 bg-green-50';
      case 'logout':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <PageContainer>
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ginger-700">
            System Logs
          </h1>
        </div>
        
        {/* Processed Logs Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Processed Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed At
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.amount} Kilo of ginger
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user_email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Logs Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Schedule Logs</h2>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-salabat-500 focus:ring-salabat-500"
              >
                <option value="ALL">All Schedules</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="px-4 py-2 bg-salabat-500 text-white rounded-md hover:bg-salabat-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salabat-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduleLogs
                    .filter(log => filter === 'ALL' ? true : log.status === filter)
                    .map((log) => (
                      <tr key={log.id} className="text-sm text-gray-500">
                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatDate(log.schedule_date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {log.user_email}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Login Logs Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">User Login Logs</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loginLogs.map((log) => (
                    <tr key={log.id} className="text-sm text-gray-500">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {log.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(log.action)}`}>
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden shadow-md">
          <div className="flex justify-around p-4">
            <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center text-gray-500">
              <span className="material-icons">home</span>
              <span className="text-xs">Home</span>
            </button>
            <button onClick={() => navigate('/run')} className="flex flex-col items-center text-gray-500">
              <span className="material-icons">play_arrow</span>
              <span className="text-xs">Run</span>
            </button>
            <button onClick={() => navigate('/logs')} className="flex flex-col items-center text-yellow-500">
              <span className="material-icons">history</span>
              <span className="text-xs">History</span>
            </button>
            <button onClick={() => navigate('/about')} className="flex flex-col items-center text-gray-500">
              <span className="material-icons">person</span>
              <span className="text-xs">About</span>
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}