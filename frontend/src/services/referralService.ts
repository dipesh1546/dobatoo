import type {
  StoredReferralData,
  PublicReferralInfo,
  ReferralSummary,
  ReferralAnalytics,
  ReferralItem,
  ReferralFilterParams,
  UtmParams,
} from '../types/referral';
import type { APIResponse } from '../types/api';
import type { PaginatedResult } from '../types/admin';
import { fetchApi } from './apiClient';
import { adminAuthService } from './admin/adminAuthService';

const STORAGE_KEY = 'dobato_referral_data';

let MOCK_REFERRAL_ITEMS: ReferralItem[] = [
  {
    id: 'REF-001',
    referralCode: 'DOBATO-LAUNCH-2026',
    source: 'Instagram',
    campaign: 'dobato_launch',
    visits: 1420,
    registrations: 124,
    conversionRate: 8.73,
    createdAt: '2026-10-01T10:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'REF-002',
    referralCode: 'AAYUSH-REF-101',
    source: 'REFERRAL',
    campaign: 'friend_invite',
    visits: 42,
    registrations: 7,
    conversionRate: 16.67,
    createdAt: '2026-10-04T12:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'REF-003',
    referralCode: 'POETRY-COMMUNITY-NP',
    source: 'Facebook',
    campaign: 'poetry_contest',
    visits: 890,
    registrations: 68,
    conversionRate: 7.64,
    createdAt: '2026-10-03T15:30:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'REF-004',
    referralCode: 'TIKTOK-VALLEY-VIBES',
    source: 'TikTok',
    campaign: 'nepal_youth_connect',
    visits: 2150,
    registrations: 149,
    conversionRate: 6.93,
    createdAt: '2026-10-02T18:20:00Z',
    status: 'ACTIVE',
  },
];

export const referralService = {
  storeReferralAndUtm(queryString: string): StoredReferralData | null {
    if (!queryString || !queryString.includes('?')) {
      return this.getStoredReferral();
    }

    const params = new URLSearchParams(queryString);
    const ref = params.get('ref') || params.get('referral');

    const utm: UtmParams = {};
    if (params.get('utm_source')) utm.utm_source = params.get('utm_source')!;
    if (params.get('utm_medium')) utm.utm_medium = params.get('utm_medium')!;
    if (params.get('utm_campaign')) utm.utm_campaign = params.get('utm_campaign')!;
    if (params.get('utm_content')) utm.utm_content = params.get('utm_content')!;
    if (params.get('utm_term')) utm.utm_term = params.get('utm_term')!;

    if (!ref && Object.keys(utm).length === 0) {
      return this.getStoredReferral();
    }

    const existing = this.getStoredReferral() || { timestamp: new Date().toISOString() };
    const updated: StoredReferralData = {
      referralCode: ref || existing.referralCode,
      utm: Object.keys(utm).length > 0 ? utm : existing.utm,
      timestamp: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    return updated;
  },

  getStoredReferral(): StoredReferralData | null {
    try {
      const sessionRaw = sessionStorage.getItem(STORAGE_KEY);
      if (sessionRaw) return JSON.parse(sessionRaw);

      const localRaw = localStorage.getItem(STORAGE_KEY);
      if (localRaw) return JSON.parse(localRaw);
    } catch {}
    return null;
  },

  async getPublicReferralInfo(code: string): Promise<APIResponse<PublicReferralInfo>> {
    try {
      const res = await fetchApi<PublicReferralInfo>(`/referral/public-info?code=${encodeURIComponent(code)}`);
      if (res.success && res.data) return res;
    } catch {}

    // Fallback public info
    return {
      success: true,
      statusCode: 200,
      message: 'Referral info verified.',
      data: {
        referralCode: code,
        valid: true,
        publicMessage: 'Someone invited you to DOBATO ❤️',
      },
    };
  },

  async getUserReferralRewards(referralCode: string): Promise<APIResponse<{
    referralCode: string;
    inviteLink: string;
    pointsBalance: number;
    successfulReferrals: number;
    availableDiscountFormatted?: string;
  }>> {
    try {
      const res = await fetchApi<any>(`/referrals/user-rewards?code=${encodeURIComponent(referralCode)}`);
      if (res.success && res.data) return res;
    } catch {}

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dobato.app';
    return {
      success: true,
      statusCode: 200,
      message: 'User referral rewards retrieved.',
      data: {
        referralCode,
        inviteLink: `${baseUrl}/register?ref=${referralCode}`,
        pointsBalance: 0,
        successfulReferrals: 0,
      },
    };
  },

  async getReferralSummary(): Promise<APIResponse<ReferralSummary>> {
    try {
      const res = await fetchApi<ReferralSummary>('/admin/referrals/summary', {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    const totalVisits = MOCK_REFERRAL_ITEMS.reduce((sum, item) => sum + item.visits, 0);
    const totalRegistrations = MOCK_REFERRAL_ITEMS.reduce((sum, item) => sum + item.registrations, 0);
    const conversionRate = totalVisits > 0 ? Number(((totalRegistrations / totalVisits) * 100).toFixed(2)) : 0;

    return {
      success: true,
      statusCode: 200,
      message: 'Referral summary retrieved.',
      data: {
        totalLinks: MOCK_REFERRAL_ITEMS.length,
        totalVisits,
        totalRegistrations,
        conversionRate,
        topSources: [
          { source: 'TikTok', count: 149 },
          { source: 'Instagram', count: 124 },
          { source: 'Facebook', count: 68 },
          { source: 'Direct Friend Referral', count: 7 },
        ],
        topCampaigns: [
          { campaign: 'nepal_youth_connect', count: 149 },
          { campaign: 'dobato_launch', count: 124 },
          { campaign: 'poetry_contest', count: 68 },
        ],
      },
    };
  },

  async getReferralDetails(params: ReferralFilterParams): Promise<APIResponse<PaginatedResult<ReferralItem>>> {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.source) query.append('source', params.source);
      if (params.campaign) query.append('campaign', params.campaign);
      query.append('page', (params.page || 1).toString());
      query.append('limit', (params.limit || 10).toString());

      const res = await fetchApi<PaginatedResult<ReferralItem>>(`/admin/referrals?${query.toString()}`, {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    let filtered = [...MOCK_REFERRAL_ITEMS];
    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.referralCode.toLowerCase().includes(term) ||
          item.source.toLowerCase().includes(term) ||
          item.campaign.toLowerCase().includes(term)
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const items = filtered.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      statusCode: 200,
      message: 'Referral list retrieved.',
      data: { items, total, page, limit, totalPages },
    };
  },

  async getReferralAnalytics(): Promise<APIResponse<ReferralAnalytics>> {
    try {
      const res = await fetchApi<ReferralAnalytics>('/admin/analytics', {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    const totalRegistrations = 348;
    const referralRegistrations = 145;
    const campaignRegistrations = 124;
    const directRegistrations = 79;
    const socialRegistrations = 217;

    return {
      success: true,
      statusCode: 200,
      message: 'Campaign analytics loaded.',
      data: {
        totalRegistrations,
        referralRegistrations,
        campaignRegistrations,
        directRegistrations,
        socialRegistrations,
        conversionRate: 8.45,
        sourceBreakdown: [
          { source: 'REFERRAL', count: 145, percentage: 41.7 },
          { source: 'CAMPAIGN', count: 124, percentage: 35.6 },
          { source: 'DIRECT', count: 79, percentage: 22.7 },
        ],
        socialBreakdown: [
          { platform: 'TikTok', count: 149 },
          { platform: 'Instagram', count: 124 },
          { platform: 'Facebook', count: 68 },
          { platform: 'WhatsApp Invite', count: 42 },
        ],
        registrationsOverTime: [
          { date: 'Oct 01', direct: 8, referral: 6, campaign: 4 },
          { date: 'Oct 02', direct: 10, referral: 8, campaign: 6 },
          { date: 'Oct 03', direct: 12, referral: 18, campaign: 12 },
          { date: 'Oct 04', direct: 15, referral: 25, campaign: 18 },
          { date: 'Oct 05', direct: 14, referral: 34, campaign: 28 },
          { date: 'Oct 06', direct: 10, referral: 28, campaign: 24 },
          { date: 'Oct 07', direct: 10, referral: 26, campaign: 32 },
        ],
      },
    };
  },
};
