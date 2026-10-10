import type { ParticipationType, GenderType, PerformanceType, DiscoverySource } from './api';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ORGANIZER' | 'VOLUNTEER';
  token: string;
}

export interface DashboardStats {
  totalRegistrations: number;
  poetryParticipants: number;
  musicParticipants?: number;
  storytellingParticipants?: number;
  otherParticipants?: number;
  attendOnly: number;
  attendAndPoetry: number;
}

export interface Registration {
  id: string;
  registrationId?: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  gender?: GenderType;
  participationType: ParticipationType;
  createdAt: string;
  status: 'REGISTERED' | 'CANCELLED';
  checkedIn?: boolean;
  checkedInAt?: string;
}

export interface RegistrationPerformanceDetails {
  performanceType: PerformanceType;
  stageIntroductionName: string;
  description?: string;
  poetryTopic?: string;
}

export interface RegistrationDetails extends Registration {
  discoverySource?: DiscoverySource;
  discoverySourceOther?: string;
  mediaConsent?: boolean;
  mediaAgreement?: boolean;
  performance?: RegistrationPerformanceDetails | null;
  poetry?: RegistrationPerformanceDetails | null;
  stageIntroductionName?: string;
  performanceType?: PerformanceType;
  poetryTopic?: string;
  eventName?: string;
  eventDate?: string;
  venueName?: string;
}

export interface PoetryParticipant {
  id: string;
  registrationId: string;
  fullName: string;
  photoUrl?: string;
  stageIntroductionName: string;
  performanceType: PerformanceType;
  createdAt: string;
  checkedIn?: boolean;
  status: 'REGISTERED' | 'CANCELLED';
}

export interface CheckInResult {
  valid: boolean;
  alreadyCheckedIn: boolean;
  registration?: RegistrationDetails;
  message?: string;
}

export interface EventStats {
  title: string;
  date: string;
  fee: string;
  status: 'OPEN' | 'CLOSED';
  totalCapacity: number;
  registeredCount: number;
}

export interface CheckInStats {
  registered: number;
  checkedIn: number;
  remaining: number;
  percentage: number;
}

export interface RegistrationChartDataPoint {
  date: string;
  count: number;
}

export type ParticipationFilter = 'ALL' | 'ATTEND_ONLY' | 'ATTEND_AND_POETRY';
export type StatusFilter = 'ALL' | 'REGISTERED' | 'CANCELLED';
export type DateRangeFilter = 'ALL' | 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM';

export interface RegistrationFilterParams {
  search?: string;
  participation?: ParticipationFilter;
  status?: StatusFilter;
  dateRange?: DateRangeFilter;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PoetryFilterParams {
  search?: string;
  performanceType?: string;
  checkInStatus?: 'ALL' | 'CHECKED_IN' | 'NOT_CHECKED_IN';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
