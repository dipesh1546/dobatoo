import type {
  RegistrationDetails,
  RegistrationFilterParams,
  PaginatedResult,
} from '../../types/admin';
import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';

export const adminRegistrationService = {
  async getRegistrations(
    params: RegistrationFilterParams
  ): Promise<APIResponse<PaginatedResult<RegistrationDetails>>> {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) {
      query.append('search', params.search.trim());
    }

    if (params.participation && params.participation !== 'ALL') {
      query.append('participationType', params.participation);
    }

    if (params.status && params.status !== 'ALL') {
      query.append('status', params.status);
    }

    // Convert date range to fromDate & toDate
    let fromDate: string | undefined;
    let toDate: string | undefined;

    if (params.dateRange && params.dateRange !== 'ALL') {
      const now = new Date();
      if (params.dateRange === 'TODAY') {
        fromDate = now.toISOString().split('T')[0];
        toDate = fromDate;
      } else if (params.dateRange === 'YESTERDAY') {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        fromDate = y.toISOString().split('T')[0];
        toDate = fromDate;
      } else if (params.dateRange === 'LAST_7_DAYS') {
        const d7 = new Date();
        d7.setDate(d7.getDate() - 7);
        fromDate = d7.toISOString().split('T')[0];
      } else if (params.dateRange === 'LAST_30_DAYS') {
        const d30 = new Date();
        d30.setDate(d30.getDate() - 30);
        fromDate = d30.toISOString().split('T')[0];
      } else if (params.dateRange === 'CUSTOM') {
        fromDate = params.startDate || undefined;
        toDate = params.endDate || undefined;
      }
    }

    if (fromDate) query.append('fromDate', fromDate);
    if (toDate) query.append('toDate', toDate);

    query.append('page', (params.page || 1).toString());
    query.append('limit', (params.limit || 10).toString());

    try {
      const response = await fetchApi<any>(
        `/admin/registrations?${query.toString()}`,
        {
          headers: adminAuthService.getAuthHeaders(),
        }
      );

      if (response.success && response.data) {
        const rawItems = Array.isArray(response.data)
          ? response.data
          : Array.isArray((response.data as any).items)
          ? (response.data as any).items
          : [];

        const pagination = (response as any).pagination || (response.data as any).pagination || {};

        const items: RegistrationDetails[] = rawItems.map((r: any) => ({
          ...r,
          id: r.registrationId || r.id,
          registrationId: r.registrationId || r.id,
          fullName: r.fullName,
          email: r.email,
          phone: r.phone,
          status: r.status === 'CANCELLED' ? 'CANCELLED' : 'REGISTERED',
          participationType: r.participationType,
          stageIntroductionName: r.stageIntroductionName || r.stageName,
          performanceType: r.performanceType || (r.poetry ? r.poetry.performanceType : undefined),
          poetryTopic: r.poetryTopic || (r.poetry ? r.poetry.topic : 'DOBATO'),
          discoverySource: r.discoverySource,
          discoverySourceOther: r.discoverySourceOther,
          createdAt: r.createdAt,
          performance: r.poetry
            ? {
                performanceType: r.poetry.performanceType || r.performanceType || 'POETRY',
                stageIntroductionName: r.stageIntroductionName || r.stageName || r.fullName,
                description: r.poetry.description || '',
                poetryTopic: r.poetry.topic || 'DOBATO',
              }
            : null,
        }));

        const totalCount = Number(pagination.total ?? (response.data as any).total ?? items.length);
        const limitCount = Number(params.limit || pagination.limit || 10);
        const pageCount = Number(params.page || pagination.page || 1);
        const totalPagesCount = Number(pagination.totalPages ?? Math.max(1, Math.ceil(totalCount / limitCount)));

        const paginatedResult: PaginatedResult<RegistrationDetails> = {
          items,
          total: totalCount,
          page: pageCount,
          limit: limitCount,
          totalPages: totalPagesCount,
        };

        return {
          ...response,
          data: paginatedResult,
        };
      }

      return {
        success: false,
        statusCode: response.statusCode || 400,
        message: response.message || 'Failed to load registrations.',
      };
    } catch (err: any) {
      return {
        success: false,
        statusCode: 500,
        message: err?.message || 'Server connection error while fetching registrations.',
      };
    }
  },

  async getRegistrationById(id: string): Promise<APIResponse<RegistrationDetails>> {
    try {
      const response = await fetchApi<any>(`/admin/registrations/${id}`, {
        headers: adminAuthService.getAuthHeaders(),
      });

      if (response.success && response.data) {
        const r = response.data;
        const mapped: RegistrationDetails = {
          ...r,
          id: r.registrationId || r.id,
          registrationId: r.registrationId || r.id,
          status: r.status === 'CANCELLED' ? 'CANCELLED' : 'REGISTERED',
          poetryTopic: r.poetryTopic || (r.poetry ? r.poetry.topic : 'DOBATO'),
          performanceType: r.performanceType || (r.poetry ? r.poetry.performanceType : undefined),
          stageIntroductionName: r.stageIntroductionName || r.stageName,
          mediaConsent: r.mediaAgreement ?? r.mediaConsent ?? true,
          eventName: r.event?.title || 'DOBATO Grand Launch',
          eventDate: '16 October 2026',
          venueName: r.event?.location || 'The Gardens, Panipokhari, Kathmandu, Nepal',
          performance: r.poetry
            ? {
                performanceType: r.poetry.performanceType || r.performanceType || 'POETRY',
                stageIntroductionName: r.stageIntroductionName || r.stageName || r.fullName,
                description: r.poetry.description || '',
                poetryTopic: r.poetry.topic || 'DOBATO',
              }
            : null,
        };
        return {
          ...response,
          data: mapped,
        };
      }

      return {
        success: false,
        statusCode: response.statusCode || 404,
        message: response.message || 'Registration record not found.',
      };
    } catch (err: any) {
      return {
        success: false,
        statusCode: 500,
        message: err?.message || 'Failed to retrieve registration details.',
      };
    }
  },

  async createRegistration(payload: any): Promise<APIResponse<RegistrationDetails>> {
    const isPerformer = payload.participationType === 'ATTEND_AND_POETRY';
    const cleanPayload = {
      fullName: payload.fullName?.trim(),
      email: payload.email?.trim().toLowerCase(),
      phone: payload.phone?.trim(),
      gender: payload.gender || undefined,
      participationType: payload.participationType,
      discoverySource: payload.discoverySource || 'OTHERS',
      discoverySourceOther: payload.discoverySource === 'OTHERS' ? payload.discoverySourceOther?.trim() : undefined,
      stageIntroductionName: isPerformer ? (payload.stageIntroductionName?.trim() || payload.fullName?.trim()) : undefined,
      performanceType: isPerformer ? payload.performanceType : undefined,
      poetryTitle: isPerformer ? (payload.stageIntroductionName?.trim() || payload.fullName?.trim()) : undefined,
      description: isPerformer ? (payload.performanceDescription?.trim() || payload.performanceNotes?.trim()) : undefined,
      topic: isPerformer ? 'DOBATO' : undefined,
    };

    try {
      const response = await fetchApi<any>('/admin/registrations', {
        method: 'POST',
        headers: adminAuthService.getAuthHeaders(),
        body: JSON.stringify(cleanPayload),
      });

      if (response.success && response.data) {
        const returnedData = response.data;
        const regId = returnedData.registrationId || returnedData.id;

        const createdRecord: RegistrationDetails = {
          ...returnedData,
          id: regId,
          registrationId: regId,
          fullName: cleanPayload.fullName,
          email: cleanPayload.email,
          phone: cleanPayload.phone,
          gender: cleanPayload.gender || 'OTHER',
          participationType: cleanPayload.participationType,
          discoverySource: cleanPayload.discoverySource,
          discoverySourceOther: cleanPayload.discoverySourceOther,
          stageIntroductionName: cleanPayload.stageIntroductionName,
          performanceType: cleanPayload.performanceType,
          poetryTopic: 'DOBATO',
          mediaConsent: true,
          status: 'REGISTERED',
          createdAt: returnedData.createdAt || new Date().toISOString(),
          eventName: 'DOBATO Grand Launch',
          eventDate: '16 October 2026',
          venueName: 'The Gardens, Panipokhari, Kathmandu, Nepal',
          performance: isPerformer
            ? {
                performanceType: cleanPayload.performanceType || 'POETRY',
                stageIntroductionName: cleanPayload.stageIntroductionName || cleanPayload.fullName,
                description: cleanPayload.description || '',
                poetryTopic: 'DOBATO',
              }
            : null,
        };

        return {
          ...response,
          data: createdRecord,
        };
      }

      return {
        success: false,
        statusCode: response.statusCode || 400,
        message: response.message || 'Registration could not be created.',
      };
    } catch (err: any) {
      return {
        success: false,
        statusCode: 500,
        message: err?.message || 'Server connection error while creating registration.',
      };
    }
  },
};
