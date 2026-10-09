import { fetchApi } from './apiClient';
import type { EventDetails, RegistrationPayload, APIResponse } from '../types/api';

export const eventService = {
  getUpcomingEvents: async (): Promise<APIResponse<EventDetails[]>> => {
    return fetchApi<EventDetails[]>('/events/upcoming');
  },

  getEventById: async (id: string): Promise<APIResponse<EventDetails>> => {
    return fetchApi<EventDetails>(`/events/${id}`);
  },

  registerForEvent: async (payload: RegistrationPayload): Promise<APIResponse<{ registrationId: string }>> => {
    return fetchApi<{ registrationId: string }>('/registrations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
