import axios from 'axios';
import type { TranslationResponse, HistoryResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalize response and error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Something went wrong. Please check your connection.';
    if (error.response?.data?.detail?.error) {
      message = error.response.data.detail.error;
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const translateAPI = {
  translate: (text: string, sourceLang: string = 'auto', targetLang: string = 'en') =>
    api.post<any, TranslationResponse>('/translate', {
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
      include_confidence: true,
    }),

  getHistory: (page: number = 1, perPage: number = 20) =>
    api.get<any, HistoryResponse>('/history', {
      params: { page, per_page: perPage },
    }),

  deleteHistoryItem: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/history/${id}`),

  clearHistory: () =>
    api.delete<{ success: boolean; message: string }>('/history'),

  checkHealth: () =>
    api.get('/health'),
};

export default api;
