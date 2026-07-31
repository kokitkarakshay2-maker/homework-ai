import { api } from './api';

export interface InteractiveOption {
  text: string;
  selected?: boolean;
  is_correct?: boolean;
}

export interface InteractiveMatch {
  left: string;
  right: string;
}

export interface InteractiveData {
  text?: string;
  blank?: string;
  options?: InteractiveOption[];
  matches?: InteractiveMatch[];
  question_text?: string;
  answer_text?: string;
  state?: boolean;
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
  }
};
