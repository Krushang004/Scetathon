'use client';

import { useEffect, useState } from 'react';
import { Clock, Activity } from 'lucide-react';
import { listenToMotionLogs, MotionLogEntry } from '@/firebase/listeners';

export default function MotionLogs() {
  const [logs, setLogs] = useState<MotionLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToMotionLogs((data) => {
      setLogs(data || []);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Motion Logs
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary mx-auto mb-2"></div>
          <p className="text-text-secondary text-sm">Loading logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary">No motion logs available</p>
          <p className="text-xs text-text-secondary mt-1">
            Motion events will appear here when detected
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`bg-dark-bg rounded-lg p-3 flex items-center justify-between ${
                log.motion ? 'border-l-4 border-green-400' : 'border-l-4 border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  log.motion ? 'bg-green-400' : 'bg-gray-500'
                }`} />
                <div>
                  <div className={`text-sm font-medium ${
                    log.motion ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {log.motion ? 'Motion Detected' : 'No Motion'}
                  </div>
                  {log.last_updated && (
                    <div className="text-xs text-text-secondary mt-0.5">
                      {log.last_updated}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-text-secondary text-xs">
                <Clock className="w-3 h-3" />
                {formatTime(log.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

