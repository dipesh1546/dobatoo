import { fetchApi } from './apiClient';
import type { RegistrationPayload, RegistrationResponseData, APIResponse } from '../types/api';

export const registrationService = {
  submitRegistration: async (
    payload: RegistrationPayload
  ): Promise<APIResponse<RegistrationResponseData>> => {
    return fetchApi<RegistrationResponseData>('/registrations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
