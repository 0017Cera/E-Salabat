import { useState } from 'react';
import toast from 'react-hot-toast';

export function Run() {
  const [juicerStatus, setJuicerStatus] = useState(false);
  const [valveStatus, setValveStatus] = useState(false);
  const [heatLevel, setHeatLevel] = useState(4);
  const [mixerSpeed, setMixerSpeed] = useState(2);
  const [grinderSpeed, setGrinderSpeed] = useState(2);
  const [cookingTime, setCookingTime] = useState(30);
  const [gingerJuiceLevel] = useState(97);

  const handleNotify = () => {
    toast.success(`Timer set for ${cookingTime} minutes`);
  };

  const toggleJuicer = () => {
    setJuicerStatus(!juicerStatus);
    toast.success(`Juicer turned ${!juicerStatus ? 'on' : 'off'}`);
  };

  const toggleValve = () => {
    setValveStatus(!valveStatus);
    toast.success(`Valve 1 turned ${!valveStatus ? 'on' : 'off'}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-ginger-700 mb-6">Machine Control Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ginger Juice Level */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-ginger-700 mb-4">Ginger Juice</h2>
          <div className="relative h-40 w-40 mx-auto">
            <svg className="transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              <circle
                className="text-salabat-500"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - gingerJuiceLevel / 100)}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-ginger-700">{gingerJuiceLevel}%</span>
            </div>
          </div>
        </div>

        {/* Temperature Display */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-ginger-700 mb-4">Temperature</h2>
          <div className="relative h-40 w-40 mx-auto">
            <svg className="transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              <circle
                className="text-salabat-500"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * 0.25}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-ginger-700">150°C</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Controls */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-ginger-700">Juicer Status</span>
                <button
                  onClick={toggleJuicer}
                  className={`px-6 py-2 rounded-full font-medium ${
                    juicerStatus
                      ? 'bg-salabat-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {juicerStatus ? 'On' : 'Off'}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-ginger-700">Valve 1 Status</span>
                <button
                  onClick={toggleValve}
                  className={`px-6 py-2 rounded-full font-medium ${
                    valveStatus
                      ? 'bg-salabat-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {valveStatus ? 'On' : 'Off'}
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div>
                <label className="text-lg font-medium text-ginger-700">Heat Status</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={heatLevel}
                  onChange={(e) => setHeatLevel(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Off</span>
                  <span>{heatLevel}</span>
                </div>
              </div>
              <div>
                <label className="text-lg font-medium text-ginger-700">Mixer Speed</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={mixerSpeed}
                  onChange={(e) => setMixerSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Off</span>
                  <span>{mixerSpeed}</span>
                </div>
              </div>
              <div>
                <label className="text-lg font-medium text-ginger-700">Grinder Speed</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={grinderSpeed}
                  onChange={(e) => setGrinderSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Off</span>
                  <span>{grinderSpeed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="bg-salabat-500 p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-4">Set Cooking Time</h2>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={cookingTime}
              onChange={(e) => setCookingTime(Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-md border-0 focus:ring-2 focus:ring-white"
              min="1"
              max="120"
            />
            <span className="text-white">min</span>
            <button
              onClick={handleNotify}
              className="px-6 py-2 bg-white text-salabat-500 rounded-md font-medium hover:bg-gray-100"
            >
              Notify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}