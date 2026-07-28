import { api } from './api';
import type { HistoryResponseSchema } from './homeworkService';

export interface HistoryListResponse {
  items: HistoryResponseSchema[];
  total: number;
}

export const historyService = {
  list: async (skip: number = 0, limit: number = 20): Promise<HistoryListResponse> => {
    const response = await api.get<HistoryListResponse>('/history', {
      params: { skip, limit },
    });
    return response.data;
  },
  
  getById: async (id: string): Promise<HistoryResponseSchema> => {
    const response = await api.get<HistoryResponseSchema>(`/history/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/history/${id}`);
  },
};
