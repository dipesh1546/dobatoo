/**
 * DOBATO API Interfaces - Phase 10 / Updated Contracts
 */

export type ParticipationType = 'ATTEND_ONLY' | 'ATTEND_AND_POETRY';
export type GenderType = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type PerformanceType = 'POETRY' | 'STORY_TELLING' | 'MUSIC' | 'OTHER';
export type DiscoverySource = 'INSTAGRAM' | 'TIKTOK' | 'FRIENDS' | 'OTHERS';

export interface PerformanceRegistrationData {
  performanceType: PerformanceType;
  stageIntroductionName: string;
  description?: string;
}

export interface RegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
  gender?: GenderType;
  photoUrl?: string;
  participationType: ParticipationType;
  discoverySource: DiscoverySource;
  discoverySourceOther?: string;
  stageIntroductionName?: string;
  performanceType?: PerformanceType;
  performanceDescription?: string;
  mediaAgreement: boolean;
  topic?: string;
}

export interface RegistrationResponseData {
  registrationId: string;
  verificationToken?: string;
  emailSent?: boolean | null;
  fullName?: string;
  email?: string;
  photoUrl?: string;
  participationType?: ParticipationType;
  performanceType?: PerformanceType;
  stageIntroductionName?: string;
  createdAt?: string;
  event?: {
    title: string;
    date: string;
  };
}

export interface VerificationResponseData {
  isValid: boolean;
  isAlreadyCheckedIn?: boolean;
  registrationId?: string;
  participationType?: ParticipationType;
  checkinTime?: string;
  message?: string;
  valid?: boolean;
  checkedIn?: boolean;
}

export interface EventPassData {
  registrationId: string;
  verificationToken: string;
  participationType: ParticipationType;
  eventName: string;
  eventDate: string;
}

export interface EventDetails {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  venueName: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
