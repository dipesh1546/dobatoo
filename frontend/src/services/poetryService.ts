import { fetchApi } from './apiClient';
import type { PerformanceRegistrationData, APIResponse } from '../types/api';

export const poetryService = {
  submitPerformance: async (payload: PerformanceRegistrationData): Promise<APIResponse<{ submissionId: string }>> => {
    return fetchApi<{ submissionId: string }>('/poetry/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
