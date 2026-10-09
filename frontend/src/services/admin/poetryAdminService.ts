import type {
  PoetryParticipantDetail,
  PoetryStats,
  PoetryFilterParams,
  PoetryCompetition,
  AuditLog,
  ReviewStatus,
  CompetitionStatus,
} from '../../types/poetryJudging';
import type { APIResponse } from '../../types/api';
import type { PaginatedResult } from '../../types/admin';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';

let MOCK_COMPETITION: PoetryCompetition = {
  id: 'COMP-2026-POETRY',
  theme: 'Finding the Right Person — जहाँ दुई बाटो भेटिन्छन्',
  status: 'JUDGING',
  isLocked: false,
  updatedAt: new Date().toISOString(),
  prizes: [
    {
      rank: 1,
      cashPrize: 'NPR 3,000',
      trophy: true,
      tshirt: true,
      accessDuration: 'Lifetime Free DOBATO Access',
    },
    {
      rank: 2,
      cashPrize: 'NPR 2,000',
      trophy: true,
      tshirt: true,
      accessDuration: '6 Months Free DOBATO Access',
    },
    {
      rank: 3,
      trophy: true,
      tshirt: true,
      accessDuration: '3 Months Free DOBATO Access',
    },
  ],
};

let MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-08T09:00:00Z',
    action: 'Competition Created',
    actor: 'Lead Admin',
    details: 'Competition created with theme: DOBATO — जहाँ दुई बाटो भेटिन्छन्',
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-08T10:15:00Z',
    action: 'Judges Assigned',
    actor: 'Lead Admin',
    details: 'Assigned 3 judges to registered poetry entries',
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-08T11:00:00Z',
    action: 'Competition Moved to JUDGING',
    actor: 'Lead Admin',
    details: 'Competition status updated from OPEN to JUDGING',
  },
];

let MOCK_PARTICIPANTS: PoetryParticipantDetail[] = [
  {
    id: 'PTR-2026-001',
    registrationId: 'DBT-2026-000101',
    participantName: 'Aayush Shrestha',
    poetryTitle: 'Mayaluki Batoma (मायालुकी बाटोमा)',
    language: 'NEPALI',
    performanceType: 'ORIGINAL_POETRY',
    description: 'A quiet reflection on meeting someone by chance on the trails of Kathmandu.',
    createdAt: '2026-10-08T10:15:00Z',
    checkedIn: true,
    reviewStatus: 'REVIEWED',
    judgingStatus: 'SCORED',
    internalNote: 'Excellent structure and emotional tone.',
    personalDetails: {
      email: 'aayush.shrestha@example.com',
      phone: '+977 9841234567',
      age: 24,
      city: 'Kathmandu',
      gender: 'MALE',
    },
  },
  {
    id: 'PTR-2026-002',
    registrationId: 'DBT-2026-000103',
    participantName: 'Rohan Gurung',
    poetryTitle: 'Echoes of Fewa',
    language: 'ENGLISH',
    performanceType: 'SPOKEN_WORD',
    description: 'Spoken word poetry about long distance connection and rediscovery.',
    createdAt: '2026-10-07T16:45:00Z',
    checkedIn: true,
    reviewStatus: 'REVIEWED',
    judgingStatus: 'SCORED',
    internalNote: 'Very expressive presentation.',
    personalDetails: {
      email: 'rohan.gurung@example.com',
      phone: '+977 9860112233',
      age: 26,
      city: 'Pokhara',
      gender: 'MALE',
    },
  },
  {
    id: 'PTR-2026-003',
    registrationId: 'DBT-2026-000105',
    participantName: 'Bikash Adhikari',
    poetryTitle: 'Dhukdhuki (धुकधुकी)',
    language: 'NEPALI',
    performanceType: 'POETRY_WITH_MUSIC',
    description: 'Nepali poetry accompanied by soft acoustic guitar notes.',
    createdAt: '2026-10-06T11:20:00Z',
    checkedIn: false,
    reviewStatus: 'REVIEWED',
    judgingStatus: 'PENDING',
    internalNote: 'Needs sound check before performance.',
    personalDetails: {
      email: 'bikash.adhikari@example.com',
      phone: '+977 9849887766',
      age: 27,
      city: 'Lalitpur',
      gender: 'MALE',
    },
  },
  {
    id: 'PTR-2026-004',
    registrationId: 'DBT-2026-000107',
    participantName: 'Saurav Joshi',
    poetryTitle: 'Whispers in the Mist',
    language: 'ENGLISH',
    performanceType: 'ORIGINAL_POETRY',
    description: 'Poetic verses exploring urban solitude and finding purpose.',
    createdAt: '2026-10-05T19:40:00Z',
    checkedIn: false,
    reviewStatus: 'PENDING',
    judgingStatus: 'PENDING',
    personalDetails: {
      email: 'saurav.j@example.com',
      phone: '+977 9851099887',
      age: 28,
      city: 'Chitwan',
      gender: 'MALE',
    },
  },
  {
    id: 'PTR-2026-005',
    registrationId: 'DBT-2026-000110',
    participantName: 'Manish Verma',
    poetryTitle: 'Dil Ki Baat (दिल की बात)',
    language: 'HINDI',
    performanceType: 'SPOKEN_WORD',
    description: 'Hindi poetry exploring cross-cultural romance.',
    createdAt: '2026-10-04T15:30:00Z',
    checkedIn: true,
    reviewStatus: 'REVIEWED',
    judgingStatus: 'SCORED',
    personalDetails: {
      email: 'manish.v@example.com',
      phone: '+977 9801223344',
      age: 25,
      city: 'Birgunj',
      gender: 'MALE',
    },
  },
];

export const poetryAdminService = {
  async getCompetition(): Promise<APIResponse<PoetryCompetition>> {
    try {
      const res = await fetchApi<PoetryCompetition>('/admin/poetry/competition', {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    return {
      success: true,
      statusCode: 200,
      message: 'Competition details retrieved.',
      data: MOCK_COMPETITION,
    };
  },

  async updateCompetitionStatus(status: CompetitionStatus): Promise<APIResponse<PoetryCompetition>> {
    try {
      const res = await fetchApi<PoetryCompetition>('/admin/poetry/status', {
        method: 'PATCH',
        headers: adminAuthService.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.success && res.data) return res;
    } catch {}

    MOCK_COMPETITION.status = status;
    if (status === 'FINALIZED') {
      MOCK_COMPETITION.isLocked = true;
    }

    this.addAuditLog(`Competition Status Changed to ${status}`, 'Lead Admin', `Status changed to ${status}`);

    return {
      success: true,
      statusCode: 200,
      message: `Competition status updated to ${status}.`,
      data: MOCK_COMPETITION,
    };
  },

  async getStats(): Promise<APIResponse<PoetryStats>> {
    try {
      const res = await fetchApi<PoetryStats>('/admin/poetry/stats', {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    const stats: PoetryStats = {
      totalParticipants: MOCK_PARTICIPANTS.length,
      checkedIn: MOCK_PARTICIPANTS.filter((p) => p.checkedIn).length,
      notCheckedIn: MOCK_PARTICIPANTS.filter((p) => !p.checkedIn).length,
      entriesReviewed: MOCK_PARTICIPANTS.filter((p) => p.reviewStatus === 'REVIEWED').length,
      entriesPending: MOCK_PARTICIPANTS.filter((p) => p.reviewStatus === 'PENDING').length,
      judged: MOCK_PARTICIPANTS.filter((p) => p.judgingStatus === 'SCORED').length,
      pendingJudging: MOCK_PARTICIPANTS.filter((p) => p.judgingStatus === 'PENDING').length,
    };

    return {
      success: true,
      statusCode: 200,
      message: 'Poetry statistics fetched.',
      data: stats,
    };
  },

  async getParticipants(params: PoetryFilterParams): Promise<APIResponse<PaginatedResult<PoetryParticipantDetail>>> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.language) query.append('language', params.language);
    if (params.performanceType) query.append('performanceType', params.performanceType);
    if (params.checkInStatus) query.append('checkInStatus', params.checkInStatus);
    if (params.reviewStatus) query.append('reviewStatus', params.reviewStatus);
    if (params.judgingStatus) query.append('judgingStatus', params.judgingStatus);
    query.append('page', (params.page || 1).toString());
    query.append('limit', (params.limit || 10).toString());

    try {
      const res = await fetchApi<any>(`/admin/poetry?${query.toString()}`, {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) {
        const rawItems = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as any).items)
          ? (res.data as any).items
          : [];
        const pagination = (res as any).pagination || (res.data as any).pagination || {};
        const total = Number(pagination.total ?? rawItems.length);
        const limit = Number(params.limit || pagination.limit || 10);
        const page = Number(params.page || pagination.page || 1);
        const totalPages = Number(pagination.totalPages ?? Math.max(1, Math.ceil(total / limit)));

        const items: PoetryParticipantDetail[] = rawItems.map((p: any) => ({
          id: p.id,
          registrationId: p.registrationId || (p.registration ? p.registration.registrationId : p.id),
          participantName: p.participantName || p.fullName || (p.registration ? p.registration.fullName : 'Unknown'),
          poetryTitle: p.poetryTitle || p.stageIntroductionName || 'DOBATO Performance',
          language: p.language || 'NEPALI',
          performanceType: p.performanceType || 'POETRY',
          description: p.description || '',
          createdAt: p.registrationDate || p.createdAt || new Date().toISOString(),
          checkedIn: false,
          reviewStatus: p.reviewStatus || 'PENDING',
          judgingStatus: p.judgingStatus || (p.assignedJudges?.length ? 'SCORED' : 'PENDING'),
          personalDetails: {
            email: p.email || (p.registration ? p.registration.email : ''),
            phone: p.phone || (p.registration ? p.registration.phone : ''),
            age: p.age ?? (p.registration ? p.registration.age : 20) ?? 20,
            city: p.city || (p.registration ? p.registration.city : 'Kathmandu') || 'Kathmandu',
            gender: p.gender || (p.registration ? p.registration.gender : 'OTHER'),
          },
        }));

        return {
          ...res,
          data: {
            items,
            total,
            page,
            limit,
            totalPages,
          },
        };
      }
    } catch {}

    let filtered = [...MOCK_PARTICIPANTS];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.participantName.toLowerCase().includes(term) ||
          p.registrationId.toLowerCase().includes(term) ||
          p.poetryTitle.toLowerCase().includes(term)
      );
    }

    if (params.language && params.language !== 'ALL') {
      filtered = filtered.filter((p) => p.language === params.language);
    }

    if (params.performanceType && params.performanceType !== 'ALL') {
      filtered = filtered.filter((p) => p.performanceType === params.performanceType);
    }

    if (params.checkInStatus && params.checkInStatus !== 'ALL') {
      const isChecked = params.checkInStatus === 'CHECKED_IN';
      filtered = filtered.filter((p) => p.checkedIn === isChecked);
    }

    if (params.reviewStatus && params.reviewStatus !== 'ALL') {
      filtered = filtered.filter((p) => p.reviewStatus === params.reviewStatus);
    }

    if (params.judgingStatus && params.judgingStatus !== 'ALL') {
      filtered = filtered.filter((p) => p.judgingStatus === params.judgingStatus);
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const items = filtered.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      statusCode: 200,
      message: 'Participants fetched.',
      data: { items, total, page, limit, totalPages },
    };
  },

  async getParticipantById(id: string): Promise<APIResponse<PoetryParticipantDetail>> {
    try {
      const res = await fetchApi<any>(`/admin/poetry/${id}`, {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) {
        const p = res.data;
        const mapped: PoetryParticipantDetail = {
          id: p.id,
          registrationId: p.registrationId || (p.registration ? p.registration.registrationId : p.id),
          participantName: p.participantName || p.fullName || (p.registration ? p.registration.fullName : 'Unknown'),
          poetryTitle: p.poetryTitle || p.stageIntroductionName || 'DOBATO Performance',
          language: p.language || 'NEPALI',
          performanceType: p.performanceType || 'POETRY',
          description: p.description || '',
          createdAt: p.registrationDate || p.createdAt || new Date().toISOString(),
          checkedIn: false,
          reviewStatus: p.reviewStatus || 'PENDING',
          judgingStatus: p.judgingStatus || (p.assignedJudges?.length ? 'SCORED' : 'PENDING'),
          personalDetails: {
            email: p.email || (p.registration ? p.registration.email : ''),
            phone: p.phone || (p.registration ? p.registration.phone : ''),
            age: p.age ?? (p.registration ? p.registration.age : 20) ?? 20,
            city: p.city || (p.registration ? p.registration.city : 'Kathmandu') || 'Kathmandu',
            gender: p.gender || (p.registration ? p.registration.gender : 'OTHER'),
          },
        };
        return {
          ...res,
          data: mapped,
        };
      }
    } catch {}

    const found = MOCK_PARTICIPANTS.find(
      (p) => p.id.toLowerCase() === id.toLowerCase() || p.registrationId.toLowerCase() === id.toLowerCase()
    );

    if (found) {
      return { success: true, statusCode: 200, message: 'Participant found.', data: found };
    }

    return { success: false, statusCode: 404, message: 'Participant not found.' };
  },

  async updateReviewStatus(
    id: string,
    status: ReviewStatus,
    note?: string
  ): Promise<APIResponse<PoetryParticipantDetail>> {
    // Sanitize note: remove HTML tags, max 500 chars
    const cleanNote = note ? note.replace(/<[^>]*>?/gm, '').slice(0, 500) : '';

    try {
      const res = await fetchApi<PoetryParticipantDetail>(`/admin/poetry/participants/${id}/review`, {
        method: 'PATCH',
        headers: adminAuthService.getAuthHeaders(),
        body: JSON.stringify({ reviewStatus: status, internalNote: cleanNote }),
      });
      if (res.success && res.data) return res;
    } catch {}

    const index = MOCK_PARTICIPANTS.findIndex((p) => p.id === id || p.registrationId === id);
    if (index !== -1) {
      MOCK_PARTICIPANTS[index].reviewStatus = status;
      MOCK_PARTICIPANTS[index].internalNote = cleanNote;
      this.addAuditLog('Entry Reviewed', 'Organizer', `Updated review status for ${MOCK_PARTICIPANTS[index].registrationId} to ${status}`);
      return {
        success: true,
        statusCode: 200,
        message: 'Review status updated.',
        data: MOCK_PARTICIPANTS[index],
      };
    }

    return { success: false, statusCode: 404, message: 'Participant not found.' };
  },

  async getAuditLogs(): Promise<APIResponse<AuditLog[]>> {
    return {
      success: true,
      statusCode: 200,
      message: 'Audit logs retrieved.',
      data: MOCK_AUDIT_LOGS,
    };
  },

  addAuditLog(action: string, actor: string, details: string) {
    MOCK_AUDIT_LOGS.unshift({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      details,
    });
  },
};
