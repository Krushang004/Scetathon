'use client';

import { useState } from 'react';
import { Lightbulb, Fan, Power, PowerOff } from 'lucide-react';
import { DevicesData, updateDevice, updateManualOverride } from '@/firebase/listeners';

interface DeviceControlsProps {
  devicesData: DevicesData | null;
}

export default function DeviceControls({ devicesData }: DeviceControlsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggle = async (
    device: 'light_zone1' | 'light_zone2' | 'fan',
    currentValue: boolean
  ) => {
    setLoading(device);
    try {
      await updateDevice(device, !currentValue);
      
      // Also update manual override for light_zone1 and fan
      if (device === 'light_zone1' || device === 'fan') {
        await updateManualOverride(device, !currentValue);
      }
    } catch (error) {
      console.error('Error updating device:', error);
      alert('Failed to update device. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const lightZone1 = devicesData?.light_zone1 || false;
  const lightZone2 = devicesData?.light_zone2 || false;
  const fan = devicesData?.fan || false;

  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Power className="w-5 h-5" />
        Device Control Panel
      </h2>

      <div className="space-y-4">
        {/* Light Zone 1 */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className={`w-6 h-6 ${lightZone1 ? 'text-yellow-400' : 'text-gray-500'}`} />
              <div>
                <div className="text-text-primary font-medium">Light Zone 1</div>
                <div className="text-sm text-text-secondary">Main classroom lights</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('light_zone1', lightZone1)}
              disabled={loading === 'light_zone1'}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                lightZone1
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === 'light_zone1' ? (
                'Updating...'
              ) : lightZone1 ? (
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

        {/* Light Zone 2 */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className={`w-6 h-6 ${lightZone2 ? 'text-yellow-400' : 'text-gray-500'}`} />
              <div>
                <div className="text-text-primary font-medium">Light Zone 2</div>
                <div className="text-sm text-text-secondary">Secondary lights</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('light_zone2', lightZone2)}
              disabled={loading === 'light_zone2'}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                lightZone2
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === 'light_zone2' ? (
                'Updating...'
              ) : lightZone2 ? (
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

        {/* Fan */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fan className={`w-6 h-6 ${fan ? 'text-blue-400' : 'text-gray-500'} ${fan ? 'animate-spin' : ''}`} />
              <div>
                <div className="text-text-primary font-medium">Fan</div>
                <div className="text-sm text-text-secondary">Ventilation system</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('fan', fan)}
              disabled={loading === 'fan'}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                fan
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === 'fan' ? (
                'Updating...'
              ) : fan ? (
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

