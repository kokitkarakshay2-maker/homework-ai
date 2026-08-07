import { useEffect, useRef } from 'react';
import { getDeviceId } from '../lib/device';
import { workspaceService } from '../services/homeworkService';
import { UAParser } from 'ua-parser-js';

export function useWorkspaceInit() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initWorkspace = async () => {
      try {
        const deviceId = getDeviceId();
        
        // Always call init to ensure the device is registered or to backfill,
        // but if we already have a workspaceId, it just updates last_active.
        const parser = new UAParser();
        const result = parser.getResult();
        const platform = result.device.type === 'tablet' ? 'Tablet' : result.device.type === 'mobile' ? 'Phone' : 'Desktop';
        const browser = result.browser.name || 'Unknown';
        const deviceName = `${browser} on ${platform}`;

        const res = await workspaceService.initWorkspace(deviceId, deviceName, platform);
        
        if (res.workspace_id) {
          localStorage.setItem('hwai_workspace_id', res.workspace_id);
        }
      } catch (err) {
        console.error("Failed to init workspace:", err);
      }
    };

    initWorkspace();
  }, []);
}
