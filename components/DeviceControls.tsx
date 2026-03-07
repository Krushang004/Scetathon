'use client';

import { useState } from 'react';
import { Zap, Power, PowerOff } from 'lucide-react';
import { DevicesData, updateDevice, updateManualOverride } from '@/firebase/listeners';

interface DeviceControlsProps {
  devicesData: DevicesData | null;
}

export default function DeviceControls({ devicesData }: DeviceControlsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggle = async (
    device: 'led',
    currentValue: boolean
  ) => {
    setLoading(device);
    try {
      await updateDevice(device, !currentValue);
      await updateManualOverride(device, !currentValue);
    } catch (error) {
      console.error('Error updating device:', error);
      alert('Failed to update device. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const led = devicesData?.led || false;

  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Power className="w-5 h-5" />
        Device Control Panel
      </h2>

      <div className="space-y-4">
        {/* LED Control */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className={`w-6 h-6 ${led ? 'text-yellow-400' : 'text-gray-500'}`} />
              <div>
                <div className="text-text-primary font-medium">LED</div>
                <div className="text-sm text-text-secondary">Classroom LED indicator</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('led', led)}
              disabled={loading === 'led'}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                led
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === 'led' ? (
                'Updating...'
              ) : led ? (
                <span className="flex items-center gap-2">
                  <PowerOff className="w-4 h-4" />
                  Turn OFF
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  Turn ON
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-accent">
        <p className="text-xs text-text-secondary">
          Changes are saved to Firebase in real-time. ESP32 will read and apply these settings automatically.
        </p>
      </div>
    </div>
  );
}

