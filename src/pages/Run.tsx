import { PageContainer } from '../components/PageContainer';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { machineApi } from '../lib/api';
import { processedLogsService } from '../lib/supabase';

// ... existing imports ...

export function Run() {
  const [sensorTemp, setSensorTemp] = useState<number | null>(null);
  const [valveStatus, setValveStatus] = useState(false);
  const [heatStatus, setHeatStatus] = useState(false);
  const [mixerStatus, setMixerStatus] = useState(false);
  const [grinderStatus, setGrinderStatus] = useState(false);
  const [cookingTime, setCookingTime] = useState('30');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to play notification sound
  const playNotificationSound = async () => {
    try {
      // Create a new Audio instance each time
      const audio = new Audio('/notif.mp3');
      audio.volume = 1.0; // Full volume
      await audio.play();
      console.log('🔊 Playing notification sound');
    } catch (error) {
      console.error('❌ Error playing sound:', error);
    }
  };

  // Custom toast with sound
  const notifyWithSound = (message: string, type: 'success' | 'error' = 'success') => {
    playNotificationSound();
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  // Add click handler to enable audio
  useEffect(() => {
    const enableAudio = () => {
      const audio = new Audio('/notif.mp3');
      audio.play().catch(() => {});
      document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio);
    return () => document.removeEventListener('click', enableAudio);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Get temperature data
        const sensorData = await machineApi.getSensorData();
        console.log('Received temperature:', sensorData.temperature);
        
        if (typeof sensorData.temperature === 'number') {
          setSensorTemp(sensorData.temperature);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Initial fetch
    fetchAllData();

    // Set up polling interval
    const interval = setInterval(fetchAllData, 2000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer finished
            setIsTimerRunning(false);
            notifyWithSound('Timer finished!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const handleNotify = () => {
    const minutes = parseInt(cookingTime);
    if (isNaN(minutes) || minutes <= 0 || minutes > 120) {
      notifyWithSound('Please enter a valid time between 1 and 120 minutes', 'error');
      return;
    }

    setTimeRemaining(minutes * 60); // Convert minutes to seconds
    setIsTimerRunning(true);
    notifyWithSound(`Timer started for ${minutes} minutes`);
  };

  const toggleValve = async () => {
    const newStatus = !valveStatus;
    try {
      await machineApi.toggleValve(newStatus);
      setValveStatus(newStatus);
      notifyWithSound(`Pump ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error toggling valve:', error);
      notifyWithSound('Failed to toggle valve', 'error');
    }
  };

  const toggleHeat = async () => {
    const newStatus = !heatStatus;
    try {
      await machineApi.toggleHeater(newStatus);
      setHeatStatus(newStatus);
      notifyWithSound(`Juicer ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error toggling heater:', error);
      notifyWithSound('Failed to toggle heater', 'error');
    }
  };

  const toggleMixer = () => {
    const newStatus = !mixerStatus;
    setMixerStatus(newStatus);
    notifyWithSound(`Mixer ${newStatus ? 'activated' : 'deactivated'}`);
  };

  const toggleGrinder = async () => {
    const newStatus = !grinderStatus;
    try {
      await machineApi.toggleGrinder(!newStatus);  // Invert the status sent to ESP32
      setGrinderStatus(newStatus);
      notifyWithSound(`Grinder ${newStatus ? 'activated' : 'deactivated'}`);

      // Record processing data when grinder is deactivated
      if (!newStatus) {  // When turning OFF
        try {
          const userEmail = localStorage.getItem('userEmail') || 'Unknown User';
          await processedLogsService.addProcessedLog(1, userEmail);
          notifyWithSound('Processing data recorded successfully');
        } catch (error) {
          console.error('Error recording processed data:', error);
          notifyWithSound('Failed to record processing data', 'error');
        }
      }
    } catch (error) {
      console.error('Error toggling grinder:', error);
      notifyWithSound('Failed to toggle grinder', 'error');
    }
  };

  return (
    <PageContainer>
      <audio 
        ref={audioRef} 
        src="/notif.mp3"
        preload="auto"
        onLoadedData={() => console.log('🎵 Audio file loaded successfully')}
        onError={(e) => console.error('❌ Audio loading error:', e)}
      />
      <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <img 
              src="/LogoE-Salabat.png" 
              alt="E-SALABAT" 
              className="h-20 sm:h-28 mx-auto mb-4 sm:mb-6"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-1">
              Machine Control Panel
            </h1>
          </div>

          <div className="space-y-6">
            {/* Status Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* Machine Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Machine Status</h2>
                <div className="flex items-center justify-center h-32">
                  <span className="text-lg font-medium text-yellow-500">
                    {heatStatus ? 'Juice Processing' : 'Ready'}
                  </span>
                </div>
              </div>

              {/* Temperature Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Temperature</h2>
                <div className="relative h-32 w-32 mx-auto">
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
                      className={`${
                        sensorTemp && sensorTemp > 200 ? 'text-red-500' : 'text-yellow-500'
                      }`}
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 45 * (1 - ((sensorTemp ?? 0) / 250))
                      }`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="45"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-700">
                      {sensorTemp !== null ? `${sensorTemp.toFixed(1)}°C` : 'Loading...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-4">
                {/* Status Controls */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Juicer Control</span>
                  <button
                    onClick={toggleHeat}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      heatStatus
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {heatStatus ? 'Juicer' : 'Juicer'}
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Valve Control</span>
                  <button
                    onClick={toggleValve}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      valveStatus
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {valveStatus ? 'Pump' : 'Pump'}
                  </button>
                </div>
              </div>
            </div>

            {/* Speed Controls */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Mixer Control</span>
                <button
                  onClick={toggleMixer}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mixerStatus
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {mixerStatus ? 'Mixer' : 'Mixer'}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Grinder Control</span>
                <button
                  onClick={toggleGrinder}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    grinderStatus
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {grinderStatus ? 'Grinder' : 'Grinder'}
                </button>
              </div>
            </div>

            {/* Timer Section */}
            <div className="bg-yellow-500 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-white mb-3">Set Cooking Time</h2>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="w-20 px-3 py-2 rounded-lg border-0 text-sm"
                  min="1"
                  max="120"
                  disabled={isTimerRunning}
                />
                <span className="text-white text-sm">min</span>
                <button
                  onClick={handleNotify}
                  disabled={isTimerRunning}
                  className={`px-4 py-2 bg-white text-yellow-500 rounded-lg text-sm font-medium transition-colors ${
                    isTimerRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  {isTimerRunning ? 'Timer Running' : 'Start Timer'}
                </button>
                {isTimerRunning && (
                  <div className="text-white text-sm ml-2">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}