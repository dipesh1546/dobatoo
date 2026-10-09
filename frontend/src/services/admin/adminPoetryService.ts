import type { PoetryParticipant, PoetryFilterParams, PaginatedResult } from '../../types/admin';
import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';

const MOCK_POETRY_PARTICIPANTS: PoetryParticipant[] = [
  {
    id: 'PTR-2026-001',
    registrationId: 'DBT-2026-000101',
    fullName: 'Aayush Shrestha',
    stageIntroductionName: 'Aayush Shrestha',
    performanceType: 'POETRY',
    createdAt: '2026-10-08T10:15:00Z',
    status: 'REGISTERED',
  },
  {
    id: 'PTR-2026-002',
    registrationId: 'DBT-2026-000103',
    fullName: 'Rohan Gurung',
    stageIntroductionName: 'Rohan (Fewa Beats)',
    performanceType: 'MUSIC',
    createdAt: '2026-10-07T16:45:00Z',
    status: 'REGISTERED',
  },
  {
    id: 'PTR-2026-003',
    registrationId: 'DBT-2026-000105',
    fullName: 'Bikash Adhikari',
    stageIntroductionName: 'Bikash Adhikari',
    performanceType: 'STORY_TELLING',
    createdAt: '2026-10-06T11:20:00Z',
    status: 'REGISTERED',
  },
  {
    id: 'PTR-2026-004',
    registrationId: 'DBT-2026-000107',
    fullName: 'Saurav Joshi',
    stageIntroductionName: 'Saurav Joshi',
    performanceType: 'POETRY',
    createdAt: '2026-10-05T19:40:00Z',
    status: 'REGISTERED',
  },
  {
    id: 'PTR-2026-005',
    registrationId: 'DBT-2026-000110',
    fullName: 'Manish Verma',
    stageIntroductionName: 'Manish Verma',
    performanceType: 'OTHER',
    createdAt: '2026-10-04T15:30:00Z',
    status: 'REGISTERED',
  },
];

export const adminPoetryService = {
  async getPoetryParticipants(
    params: PoetryFilterParams
  ): Promise<APIResponse<PaginatedResult<PoetryParticipant>>> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.performanceType) query.append('performanceType', params.performanceType);
    query.append('page', (params.page || 1).toString());
    query.append('limit', (params.limit || 10).toString());

    try {
      const response = await fetchApi<PaginatedResult<PoetryParticipant>>(
        `/admin/poetry?${query.toString()}`,
        {
          headers: adminAuthService.getAuthHeaders(),
        }
      );

      if (response.success && response.data) {
        return response;
      }
    } catch {
      // Fallback query logic
    }

    let filtered = [...MOCK_POETRY_PARTICIPANTS];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.fullName.toLowerCase().includes(term) ||
          p.registrationId.toLowerCase().includes(term) ||
          p.stageIntroductionName.toLowerCase().includes(term)
      );
    }

    if (params.performanceType && params.performanceType !== 'ALL') {
      filtered = filtered.filter((p) => p.performanceType === params.performanceType);
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      statusCode: 200,
      message: 'Poetry participants retrieved successfully.',
      data: {
        items,
        total,
        page,
        limit,
        totalPages,
      },
    };
  },
};
