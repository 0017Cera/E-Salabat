import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, cleaningScheduleService, type CleaningSchedule } from '../lib/supabase';
import { PageContainer } from '../components/PageContainer';
import toast from 'react-hot-toast';
import { 
  HomeIcon, 
  ClockIcon, 
  PlayIcon, 
  InformationCircleIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

export function Dashboard() {
  const [schedules, setSchedules] = useState<CleaningSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const navigation = [  
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'History', href: '/history', icon: ClockIcon },
    { name: 'Run', href: '/run', icon: PlayIcon },
    { name: 'Data', href: '/data', icon: TableCellsIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await cleaningScheduleService.getSchedules();
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load schedules');
    }
  };

  const handleSetSchedule = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      await cleaningScheduleService.addSchedule({
        schedule_date: selectedDate,
        status: 'pending',
        created_by: user.id
      });

      await fetchSchedules();
      setSelectedDate('');
      toast.success('Cleaning schedule set successfully');
    } catch (error) {
      console.error('Error setting schedule:', error);
      toast.error('Failed to set schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: 'pending' | 'completed') => {
    try {
      await cleaningScheduleService.updateScheduleStatus(id, newStatus);
      await fetchSchedules();
      toast.success('Schedule status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      await cleaningScheduleService.deleteSchedule(id);
      await fetchSchedules();
      toast.success('Schedule deleted');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete schedule');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    return `${day} ${month}`;
  };

  const getNextCleaningInfo = () => {
    if (schedules.length === 0) return null;
    
    const today = new Date();
    const futureDates = schedules
      .map(schedule => new Date(schedule.schedule_date))
      .filter(date => date > today);

    if (futureDates.length === 0) return null;

    const nextDate = new Date(Math.min(...futureDates.map(d => d.getTime())));
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const daysUntilCleaning = getNextCleaningInfo();

  return (
    <PageContainer>
      <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <img 
              src="/LogoE-Salabat.png" 
              alt="E-SALABAT" 
              className="h-20 sm:h-28 mx-auto mb-4 sm:mb-6"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-1">
              FRAMSI HART'S TURMERIC
            </h1>
          </div>

          {/* Next Cleaning Info */}
          <div className="space-y-6 mb-8">
            <div className="bg-yellow-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">{getCurrentDate()}</h2>
              <div className="text-xl">
                {daysUntilCleaning ? `${daysUntilCleaning} Days` : 'No Cleaning Schedule'}
              </div>
              <p className="text-sm text-gray-700">
                {daysUntilCleaning ? 'until next cleaning' : ''}
              </p>
            </div>

            {/* Schedule Setting Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Schedule Cleaning</h2>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  SET DATE
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button 
                onClick={handleSetSchedule}
                disabled={!selectedDate || loading}
                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting...' : 'SET'}
              </button>
            </div>
          </div>

          {/* Schedules Table */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-sm font-medium text-gray-600 mb-4">
              Cleaning Schedule Log
            </h3>
            {schedules.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedules.map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(schedule.schedule_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            schedule.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleUpdateStatus(
                              schedule.id!, 
                              schedule.status === 'pending' ? 'completed' : 'pending'
                            )}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Toggle Status
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No schedules yet</p>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </PageContainer>
  );
}