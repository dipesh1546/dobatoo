export type CompetitionStatus = 'DRAFT' | 'OPEN' | 'JUDGING' | 'FINAL_REVIEW' | 'FINALIZED';
export type ReviewStatus = 'PENDING' | 'REVIEWED' | 'NEEDS_ATTENTION';
export type JudgingStatus = 'PENDING' | 'SCORED' | 'IN_PROGRESS';
export type JudgeRole = 'JUDGE' | 'HEAD_JUDGE';
export type JudgeStatus = 'ACTIVE' | 'INACTIVE';

export interface PrizePackage {
  rank: 1 | 2 | 3;
  cashPrize?: string;
  trophy: boolean;
  tshirt: boolean;
  accessDuration: string;
}

export interface PoetryCompetition {
  id: string;
  theme: string;
  status: CompetitionStatus;
  prizes: PrizePackage[];
  isLocked: boolean;
  updatedAt: string;
}

export interface Judge {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: JudgeRole;
  status: JudgeStatus;
  assignedEntryIds: string[];
}

export interface JudgingCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage (0-100)
  maxScore: number; // e.g. 10
}

export interface JudgeScoreItem {
  criterionId: string;
  score: number;
}

export interface JudgeEntryScore {
  id: string;
  judgeId: string;
  judgeName?: string;
  participantId: string;
  scores: Record<string, number>; // criterionId -> score
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScoreSummary {
  participantId: string;
  registrationId: string;
  participantName: string;
  poetryTitle: string;
  language: string;
  performanceType: string;
  judgesCount: number;
  rawScoreTotal: number;
  weightedScore: number; // 0 - 100
  hasTie: boolean;
  rank?: number;
}

export interface WinnerSlot {
  participantId: string;
  registrationId: string;
  participantName: string;
  poetryTitle: string;
  weightedScore: number;
  prizeText: string;
}

export interface WinnerSelection {
  firstPlace?: WinnerSlot | null;
  secondPlace?: WinnerSlot | null;
  thirdPlace?: WinnerSlot | null;
  finalizedAt?: string;
  finalizedBy?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface PoetryParticipantDetail {
  id: string;
  registrationId: string;
  participantName: string;
  poetryTitle: string;
  language: string;
  performanceType: string;
  description?: string;
  createdAt: string;
  checkedIn: boolean;
  reviewStatus: ReviewStatus;
  judgingStatus: JudgingStatus;
  internalNote?: string;
  personalDetails?: {
    email: string;
    phone: string;
    age: number;
    city: string;
    gender: string;
  };
}

export interface PoetryStats {
  totalParticipants: number;
  checkedIn: number;
  notCheckedIn: number;
  entriesReviewed: number;
  entriesPending: number;
  judged: number;
  pendingJudging: number;
}

export interface PoetryFilterParams {
  search?: string;
  language?: string;
  performanceType?: string;
  checkInStatus?: 'ALL' | 'CHECKED_IN' | 'NOT_CHECKED_IN';
  reviewStatus?: 'ALL' | 'REVIEWED' | 'PENDING' | 'NEEDS_ATTENTION';
  judgingStatus?: 'ALL' | 'JUDGED' | 'PENDING';
  page?: number;
  limit?: number;
}
