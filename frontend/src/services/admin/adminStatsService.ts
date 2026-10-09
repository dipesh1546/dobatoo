import type { DashboardStats, RegistrationChartDataPoint } from '../../types/admin';
import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';

export const adminStatsService = {
  async getDashboardStats(): Promise<APIResponse<DashboardStats>> {
    try {
      const response = await fetchApi<any>('/admin/stats', {
        headers: adminAuthService.getAuthHeaders(),
      });

      if (response.success && response.data) {
        const raw = response.data;
        const total = Number(raw.totalRegistrations ?? 0);
        const poetry = Number(raw.poetryParticipants ?? (raw.performanceDistribution?.POETRY ?? 0));
        const music = Number(raw.musicParticipants ?? (raw.performanceDistribution?.MUSIC ?? 0));
        const story = Number(raw.storytellingParticipants ?? (raw.performanceDistribution?.STORY_TELLING ?? 0));
        const other = Number(raw.otherParticipants ?? (raw.performanceDistribution?.OTHER ?? 0));
        const attendOnly = Number(raw.attendOnly ?? Math.max(0, total - (poetry + music + story + other)));
        const attendAndPoetry = Number(raw.attendAndPoetry ?? raw.totalPerformers ?? (poetry + music + story + other));

        const mapped: DashboardStats = {
          totalRegistrations: total,
          poetryParticipants: poetry,
          musicParticipants: music,
          storytellingParticipants: story,
          otherParticipants: other,
          attendOnly,
          attendAndPoetry,
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
        message: 'Unable to load statistics: Service unavailable.',
      };
    }
  },

  async getRegistrationChartStats(): Promise<APIResponse<RegistrationChartDataPoint[]>> {
    try {
      const response = await fetchApi<any>('/admin/stats/registrations-over-time', {
        headers: adminAuthService.getAuthHeaders(),
      });

      if (response.success && response.data) {
        const rawList = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.daily)
          ? response.data.daily
          : Array.isArray((response.data as any).data?.daily)
          ? (response.data as any).data.daily
          : [];

        const mapped: RegistrationChartDataPoint[] = rawList.map((item: any) => {
          let dateStr = item.date || '';
          if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              const d = new Date(dateStr);
              if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              } else {
                dateStr = `${parts[1]}/${parts[2]}`;
              }
            }
          }
          return {
            date: dateStr || 'Date',
            count: Number(item.count || 0),
          };
        });

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
        message: 'Unable to load registration analytics: Service unavailable.',
      };
    }
  },
};
