import { fetchApi, buildApiUrl } from './apiClient';
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

  /**
   * Uploads participant photo to Cloudinary (optional for giveaways & badges).
   */
  uploadPhoto: async (
    file: File
  ): Promise<{ success: boolean; url: string; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = buildApiUrl('/registrations/upload-image');
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.url) {
        throw new Error(json.message || json.error || 'Failed to upload image');
      }

      return {
        success: true,
        url: json.url,
      };
    } catch (err: any) {
      return {
        success: false,
        url: '',
        error: err.message || 'Image upload failed. Please try again.',
      };
    }
  },
};
