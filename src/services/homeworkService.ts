import { api } from './api';

export interface InteractiveOption {
  text: string;
  selected?: boolean;
  is_correct?: boolean;
  color?: string;
  shape?: string;
}

export interface InteractiveMatch {
  left: string;
  right: string;
}

export interface LegendItem {
  concept: string;
  color: string;
}

export interface InteractiveData {
  text?: string;
  blank?: string;
  options?: InteractiveOption[];
  matches?: InteractiveMatch[];
  question_text?: string;
  answer_text?: string;
  state?: boolean;
  
  start?: number;
  steps?: number;
  result?: number;
  operation?: "add" | "subtract" | string;
  max?: number;

  total?: number;
  subtract?: number;
  shape?: string;

  legend?: LegendItem[];
}

export interface QuestionSchema {
  id: number;
  question: string;
  answer: string;
  answers?: string[];
  write_this: string;
  steps: string[];
  warnings: string[];
  question_type: string;
  interactive_data?: InteractiveData;
}

export interface HomeworkResponseSchema {
  subject: string;
  worksheet_title: string;
  questions: QuestionSchema[];
}

export interface HistoryResponseSchema {
  id: string;
  filename: string;
  subject?: string;
  thumbnail_url?: string;
  created_at: string;
  processed_response: HomeworkResponseSchema;
}

export interface HistoryListResponse {
  items: HistoryResponseSchema[];
  total: number;
}

export const homeworkService = {
  analyze: async (file: File, signal?: AbortSignal): Promise<HistoryResponseSchema> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<HistoryResponseSchema>('/homework/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal,
    });
    console.log(`[${performance.now().toFixed(0)}ms] [Frontend] Response parsed`);
    return response.data;
  },

  getHistoryList: async (skip: number = 0, limit: number = 20): Promise<HistoryListResponse> => {
    const response = await api.get<HistoryListResponse>('/history', {
      params: { skip, limit }
    });
    return response.data;
  },

  getHistoryDetail: async (id: string): Promise<HistoryResponseSchema> => {
    const response = await api.get<HistoryResponseSchema>(`/history/${id}`);
    return response.data;
  },

  deleteHistory: async (id: string): Promise<void> => {
    await api.delete(`/history/${id}`);
  },

  deleteAllHistory: async (): Promise<void> => {
    await api.delete(`/history`);
  }
};

export interface DeviceSchema {
  id: string;
  device_id: string;
  device_name: string;
  platform: string;
  last_active: string;
}

export const workspaceService = {
  initWorkspace: async (device_id: string, device_name: string, platform: string): Promise<{workspace_id: string}> => {
    const response = await api.post('/workspace/init', { device_id, device_name, platform });
    return response.data;
  },

  generatePairingToken: async (): Promise<{token_id: string, expires_at: string}> => {
    const response = await api.post('/workspace/pairing/generate');
    return response.data;
  },

  joinWorkspace: async (token_id: string, device_id: string, device_name: string, platform: string): Promise<{workspace_id: string}> => {
    const response = await api.post('/workspace/pairing/join', { token_id, device_id, device_name, platform });
    return response.data;
  },

  listDevices: async (): Promise<DeviceSchema[]> => {
    const response = await api.get('/workspace/devices');
    return response.data;
  },

  renameDevice: async (device_id: string, new_name: string): Promise<void> => {
    await api.put(`/workspace/devices/${device_id}`, { new_name });
  },

  removeDevice: async (device_id: string): Promise<void> => {
    await api.delete(`/workspace/devices/${device_id}`);
  }
};
