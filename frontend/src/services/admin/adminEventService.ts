import type { EventStats } from '../../types/admin';
import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';

export const adminEventService = {
  async getEventStats(): Promise<APIResponse<EventStats>> {
    try {
      const response = await fetchApi<any>('/admin/event', {
        headers: adminAuthService.getAuthHeaders(),
      });

      if (response.success && response.data) {
        const raw = response.data;
        const mapped: EventStats = {
          title: raw.title || 'DOBATO GRAND LAUNCH',
          date: raw.eventDate
            ? new Date(raw.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            : (raw.date || '16 October 2026'),
          fee: raw.fee || (Number(raw.registrationFee) === 0 ? 'FREE' : `NPR ${raw.registrationFee}`),
          status: raw.status || (raw.isRegistrationOpen !== false ? 'OPEN' : 'CLOSED'),
          totalCapacity: raw.totalCapacity || 500,
          registeredCount: raw.registeredCount ?? 0,
        };

        return {
          ...response,
          data: mapped,
        };
      }

      return response;
    } catch (error) {
      return {
        success: false,
        statusCode: 503,
        message: 'Unable to load event details: Service unavailable.',
      };
    }
  },
};
