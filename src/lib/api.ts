// ESP32 URLs
const MECH_CONTROL_URL = 'http://192.168.47.185';  // Main ESP32 for temperature, grinder, valve, heater
const JUICE_MIXER_URL = 'http://192.168.47.161';   // ESP32 for mixer control

export interface SensorData {
  temperature: number;
  grinderStatus: boolean;
  valveStatus: boolean;
  heaterStatus: boolean;
}

export interface MixerData {
  mixerStatus: boolean;
}

export interface MachineState {
  grinderStatus: boolean;
  valveStatus: boolean;
  heaterStatus: boolean;
  temperature: number;
}

export const machineApi = {
  // Get sensor data from main ESP32
  getSensorData: async (): Promise<SensorData> => {
    console.log('🔍 Fetching temperature from /sensors');
    
    try {
      const response = await fetch(`${MECH_CONTROL_URL}/sensors`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch temperature: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Temperature data:', data);

      return {
        temperature: Number(data.temperature ?? 0),
        grinderStatus: false,  // Default values since we're only getting temperature
        valveStatus: false,
        heaterStatus: false,
      };
    } catch (error) {
      console.error('❌ Error fetching temperature:', error);
      return {
        temperature: null as any,
        grinderStatus: false,
        valveStatus: false,
        heaterStatus: false,
      };
    }
  },

  // Get mixer data from ESP32
  getMixerData: async (): Promise<MixerData> => {
    const endpoint = `${JUICE_MIXER_URL}/state`;
    console.log('🔍 Attempting to fetch mixer data from:', endpoint);
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch mixer data: ${response.status}`);
      }

      const data = await response.json();
      return {
        mixerStatus: Boolean(data.mixerStatus ?? false)
      };
    } catch (error) {
      console.error('Error fetching mixer data:', error);
      throw error;
    }
  },

  // Control functions for main ESP32
  toggleGrinder: async (status: boolean): Promise<void> => {
    console.log('🔄 Toggling grinder:', status ? 'ON' : 'OFF');
    try {
      const response = await fetch(`${MECH_CONTROL_URL}/control/grinder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to control grinder');
    } catch (error) {
      console.error('Error controlling grinder:', error);
      throw error;
    }
  },

  toggleValve: async (status: boolean): Promise<void> => {
    console.log('🔄 Toggling valve:', status ? 'ON' : 'OFF');
    try {
      const response = await fetch(`${MECH_CONTROL_URL}/control/valve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to control valve');
    } catch (error) {
      console.error('Error controlling valve:', error);
      throw error;
    }
  },

  toggleHeater: async (status: boolean): Promise<void> => {
    console.log('🔄 Toggling heater:', status ? 'ON' : 'OFF');
    try {
      const response = await fetch(`${MECH_CONTROL_URL}/control/heater`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to control heater');
    } catch (error) {
      console.error('Error controlling heater:', error);
      throw error;
    }
  },

  // Control functions for ESP32
  toggleMixer: async (status: boolean): Promise<void> => {
    console.log('🔄 Toggling mixer:', status ? 'ON' : 'OFF');
    try {
      const response = await fetch(`${JUICE_MIXER_URL}/control/mixer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to control mixer');
    } catch (error) {
      console.error('Error controlling mixer:', error);
      throw error;
    }
  }
}; 
