export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface StoredReferralData {
  referralCode?: string;
  utm?: UtmParams;
  timestamp: string;
}

export interface PublicReferralInfo {
  referralCode: string;
  valid: boolean;
  publicMessage?: string;
  inviterName?: string;
}

export interface UserReferralRewards {
  referralCode: string;
  inviteLink: string;
  pointsBalance: number;
  successfulReferrals: number;
  availableDiscountFormatted?: string;
}

export interface ReferralItem {
  id: string;
  referralCode: string;
  source: string;
  campaign: string;
  visits: number;
  registrations: number;
  conversionRate: number;
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ReferralSummary {
  totalLinks: number;
  totalVisits: number;
  totalRegistrations: number;
  conversionRate: number;
  topSources: { source: string; count: number }[];
  topCampaigns: { campaign: string; count: number }[];
}

export type AcquisitionSource = 'DIRECT' | 'REFERRAL' | 'SOCIAL' | 'CAMPAIGN';

export interface ReferralAnalytics {
  totalRegistrations: number;
  referralRegistrations: number;
  campaignRegistrations: number;
  directRegistrations: number;
  socialRegistrations: number;
  conversionRate: number;
  sourceBreakdown: { source: AcquisitionSource; count: number; percentage: number }[];
  socialBreakdown: { platform: string; count: number }[];
  registrationsOverTime: { date: string; direct: number; referral: number; campaign: number }[];
}

export interface ReferralFilterParams {
  search?: string;
  source?: string;
  campaign?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  dateRange?: string;
  page?: number;
  limit?: number;
}
