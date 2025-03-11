import React, { useState, useEffect } from 'react';
import { checkServerConnection } from '../api';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkConnection() {
      try {
        setIsChecking(true);
        const connected = await checkServerConnection();
        setIsConnected(connected);
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    }

    checkConnection();
  }, []);

  if (isChecking) {
    return (
      <div style={{ padding: '10px', background: '#fff3cd', color: '#856404', borderRadius: '4px', margin: '10px 0' }}>
        Checking server connection...
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', margin: '10px 0' }}>
        ⚠️ Backend server not connected. Please make sure the server is running on port 5000.
      </div>
    );
  }

  return null;
}
