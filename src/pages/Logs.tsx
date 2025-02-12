import { useState } from 'react';

// Mock log data - in a real app, this would come from your IoT system
const mockLogs = [
  {
    id: 1,
    timestamp: '2024-02-29 10:15:23',
    type: 'INFO',
    message: 'Machine started - Temperature: 65°C, Humidity: 45%',
    component: 'System'
  },
  {
    id: 2,
    timestamp: '2024-02-29 10:15:25',
    type: 'INFO',
    message: 'Grinding speed set to 1200 RPM',
    component: 'Motor'
  },
  {
    id: 3,
    timestamp: '2024-02-29 10:16:00',
    type: 'WARNING',
    message: 'Temperature approaching upper limit: 68°C',
    component: 'Temperature Sensor'
  },
  {
    id: 4,
    timestamp: '2024-02-29 10:17:30',
    type: 'ERROR',
    message: 'Humidity exceeded recommended range: 65%',
    component: 'Humidity Sensor'
  },
  {
    id: 5,
    timestamp: '2024-02-29 10:18:00',
    type: 'INFO',
    message: 'Automatic humidity adjustment initiated',
    component: 'Control System'
  }
];

export function Logs() {
  const [logs, setLogs] = useState(mockLogs);
  const [filter, setFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => 
    filter === 'ALL' ? true : log.type === filter
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ERROR':
        return 'text-red-600 bg-red-50';
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-50';
      case 'INFO':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-ginger-700">System Logs</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-salabat-500 focus:ring-salabat-500"
          >
            <option value="ALL">All Logs</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warnings</option>
            <option value="ERROR">Errors</option>
          </select>
          <button
            onClick={() => setLogs(mockLogs)}
            className="px-4 py-2 bg-salabat-500 text-white rounded-md hover:bg-salabat-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salabat-500"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.component}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}