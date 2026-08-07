import axios from 'axios';
import { getDeviceId } from '../lib/device';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds to allow Gemini Vision processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for future auth injection and device ID
api.interceptors.request.use((config) => {
  const deviceId = getDeviceId();
  config.headers['x-device-id'] = deviceId;
  
  const workspaceId = localStorage.getItem('hwai_workspace_id');
  if (workspaceId) {
    console.log('[API] Current workspace_id header:', workspaceId);
    config.headers['x-workspace-id'] = workspaceId;
  }
  
  console.log(`[${performance.now().toFixed(0)}ms] [Frontend] Axios request started / Request sent`);
  return config;
});

// Error handling & simple retry interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[${performance.now().toFixed(0)}ms] [Frontend] Response received`);
    return response;
  },
  async (error) => {
    const config = error.config;
    console.error(`[${performance.now().toFixed(0)}ms] [Frontend] Error occurred:`, error.message);
    
    // Only retry network errors or 502/503/504 errors, and only once
    // Do NOT retry if the request was intentionally canceled/aborted
    if (config && (!config._retry) && !axios.isCancel(error) && (!error.response || error.response.status >= 502)) {
      console.warn("[Frontend Axios] API request failed, retrying once...");
      config._retry = true;
      await new Promise(res => setTimeout(res, 1000));
      return api(config);
    }
    
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      console.error('API No Response:', error.request);
    }
    return Promise.reject(error);
  }
);
