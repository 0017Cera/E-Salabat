import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock IoT sensor data
const mockSensorData = {
  temperature: 65,
  humidity: 45,
  grindingSpeed: 1200,
  status: 'Running',
  maintenanceDate: '2024-03-15',
  lastCleaning: '2024-02-28'
};

export function Dashboard() {
  const [sensorData, setSensorData] = useState(mockSensorData);

  useEffect(() => {
    // Simulate real-time sensor updates
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() * 2 - 1),
        humidity: Math.max(30, Math.min(60, prev.humidity + (Math.random() * 2 - 1))),
        grindingSpeed: Math.max(1000, Math.min(1400, prev.grindingSpeed + (Math.random() * 50 - 25)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Machine Status Section */}
      <div>
        <h2 className="text-2xl font-bold text-ginger-700 mb-4">Machine Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-ginger-600 mb-2">Temperature</h3>
            <p className="text-2xl sm:text-3xl font-bold text-salabat-600">{sensorData.temperature.toFixed(1)}°C</p>
            <p className="text-sm text-gray-500">Optimal Range: 60-70°C</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-ginger-600 mb-2">Humidity</h3>
            <p className="text-2xl sm:text-3xl font-bold text-salabat-600">{sensorData.humidity.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">Optimal Range: 30-60%</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-ginger-600 mb-2">Grinding Speed</h3>
            <p className="text-2xl sm:text-3xl font-bold text-salabat-600">{sensorData.grindingSpeed.toFixed(0)} RPM</p>
            <p className="text-sm text-gray-500">Optimal Range: 1000-1400 RPM</p>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div>
        <h2 className="text-2xl font-bold text-ginger-700 mb-4">Maintenance Schedule</h2>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-lg font-semibold text-ginger-600">Next Maintenance</h3>
                <p className="text-gray-500">{sensorData.maintenanceDate}</p>
              </div>
              <button className="w-full sm:w-auto bg-salabat-500 text-white px-4 py-2 rounded-md hover:bg-salabat-600">
                Schedule
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-lg font-semibold text-ginger-600">Last Cleaning</h3>
                <p className="text-gray-500">{sensorData.lastCleaning}</p>
              </div>
              <button className="w-full sm:w-auto bg-salabat-500 text-white px-4 py-2 rounded-md hover:bg-salabat-600">
                Log Cleaning
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Production Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-ginger-700 mb-4">Production Output</h2>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { time: '00:00', output: 20 },
                { time: '04:00', output: 45 },
                { time: '08:00', output: 80 },
                { time: '12:00', output: 75 },
                { time: '16:00', output: 90 },
                { time: '20:00', output: 60 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="output" stroke="#FFB800" fill="#FFE299" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-ginger-700 mb-4">Quality Metrics</h2>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { metric: 'Moisture', value: 95 },
                { metric: 'Particle Size', value: 98 },
                { metric: 'Purity', value: 97 },
                { metric: 'Color', value: 94 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#E18C29" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}