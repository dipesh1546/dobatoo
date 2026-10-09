import type { JudgeEntryScore, PoetryParticipantDetail } from '../../types/poetryJudging';
import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';
import { judgeService } from './judgeService';
import { poetryAdminService } from './poetryAdminService';

let MOCK_SCORES: JudgeEntryScore[] = [
  {
    id: 'SCR-101',
    judgeId: 'JDG-001',
    judgeName: 'Dr. Ramesh Luitel',
    participantId: 'PTR-2026-001',
    scores: {
      'CRT-001': 9,
      'CRT-002': 9,
      'CRT-003': 8,
      'CRT-004': 9,
    },
    comment: 'Strong emotional delivery and authentic Nepali imagery.',
    createdAt: '2026-10-08T12:00:00Z',
    updatedAt: '2026-10-08T12:00:00Z',
  },
  {
    id: 'SCR-102',
    judgeId: 'JDG-002',
    judgeName: 'Sushma Karki',
    participantId: 'PTR-2026-001',
    scores: {
      'CRT-001': 8,
      'CRT-002': 9,
      'CRT-003': 9,
      'CRT-004': 8,
    },
    comment: 'Captivating stage presence.',
    createdAt: '2026-10-08T12:10:00Z',
    updatedAt: '2026-10-08T12:10:00Z',
  },
  {
    id: 'SCR-103',
    judgeId: 'JDG-001',
    judgeName: 'Dr. Ramesh Luitel',
    participantId: 'PTR-2026-002',
    scores: {
      'CRT-001': 8,
      'CRT-002': 8,
      'CRT-003': 9,
      'CRT-004': 9,
    },
    comment: 'Excellent spoken word rhythm.',
    createdAt: '2026-10-08T12:30:00Z',
    updatedAt: '2026-10-08T12:30:00Z',
  },
  {
    id: 'SCR-104',
    judgeId: 'JDG-002',
    judgeName: 'Sushma Karki',
    participantId: 'PTR-2026-002',
    scores: {
      'CRT-001': 9,
      'CRT-002': 9,
      'CRT-003': 8,
      'CRT-004': 8,
    },
    comment: 'Powerfully voiced poem.',
    createdAt: '2026-10-08T12:45:00Z',
    updatedAt: '2026-10-08T12:45:00Z',
  },
];

export const scoringService = {
  async getAssignedEntriesForJudge(
    judgeId?: string
  ): Promise<APIResponse<PoetryParticipantDetail[]>> {
    const activeJudge = judgeService.getCurrentJudge();
    const targetJudgeId = judgeId || activeJudge?.id || 'JDG-001';

    try {
      const res = await fetchApi<PoetryParticipantDetail[]>(`/admin/poetry/scoring/assigned?judgeId=${targetJudgeId}`, {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    const participantsRes = await poetryAdminService.getParticipants({ limit: 100 });
    const all = participantsRes.data?.items || [];

    // Filter to entries assigned to this judge
    const assignedIds = activeJudge?.assignedEntryIds || ['PTR-2026-001', 'PTR-2026-002', 'PTR-2026-003', 'PTR-2026-005'];
    const assigned = all.filter((p: PoetryParticipantDetail) => assignedIds.includes(p.id) || assignedIds.includes(p.registrationId));

    return {
      success: true,
      statusCode: 200,
      message: 'Assigned entries loaded.',
      data: assigned.length > 0 ? assigned : all.slice(0, 4),
    };
  },

  async getJudgeScoreForParticipant(
    judgeId: string,
    participantId: string
  ): Promise<APIResponse<JudgeEntryScore | null>> {
    try {
      const res = await fetchApi<JudgeEntryScore>(
        `/admin/poetry/scoring/score?judgeId=${judgeId}&participantId=${participantId}`,
        { headers: adminAuthService.getAuthHeaders() }
      );
      if (res.success) return res;
    } catch {}

    const found = MOCK_SCORES.find(
      (s) => s.judgeId === judgeId && s.participantId === participantId
    );

    return {
      success: true,
      statusCode: 200,
      message: found ? 'Existing score found.' : 'No score submitted yet.',
      data: found || null,
    };
  },

  async submitScore(
    participantId: string,
    scores: Record<string, number>,
    comment?: string
  ): Promise<APIResponse<JudgeEntryScore>> {
    // Check competition status first
    const compRes = await poetryAdminService.getCompetition();
    const compStatus = compRes.data?.status || 'JUDGING';

    if (compStatus === 'FINALIZED') {
      return {
        success: false,
        statusCode: 409,
        message: 'Competition results are finalized and cannot be modified.',
      };
    }

    if (compStatus === 'FINAL_REVIEW') {
      return {
        success: false,
        statusCode: 403,
        message: 'Scoring is closed for final review.',
      };
    }

    if (compStatus === 'DRAFT' || compStatus === 'OPEN') {
      return {
        success: false,
        statusCode: 403,
        message: 'Judging phase is not yet open.',
      };
    }

    const currentJudge = judgeService.getCurrentJudge() || {
      id: 'JDG-001',
      name: 'Dr. Ramesh Luitel',
    };

    try {
      const res = await fetchApi<JudgeEntryScore>('/admin/poetry/scoring/submit', {
        method: 'POST',
        headers: adminAuthService.getAuthHeaders(),
        body: JSON.stringify({
          judgeId: currentJudge.id,
          participantId,
          scores,
          comment,
        }),
      });
      if (res.success && res.data) return res;
    } catch {}

    // Upsert logic (Prevent duplicate scores per Judge + Participant)
    const existingIndex = MOCK_SCORES.findIndex(
      (s) => s.judgeId === currentJudge.id && s.participantId === participantId
    );

    const now = new Date().toISOString();

    if (existingIndex !== -1) {
      MOCK_SCORES[existingIndex].scores = { ...scores };
      MOCK_SCORES[existingIndex].comment = comment;
      MOCK_SCORES[existingIndex].updatedAt = now;

      poetryAdminService.addAuditLog(
        'Score Edited',
        currentJudge.name,
        `Updated scores for entry ${participantId}`
      );

      return {
        success: true,
        statusCode: 200,
        message: 'Score updated successfully.',
        data: MOCK_SCORES[existingIndex],
      };
    } else {
      const newScore: JudgeEntryScore = {
        id: `SCR-${Date.now().toString().slice(-4)}`,
        judgeId: currentJudge.id,
        judgeName: currentJudge.name,
        participantId,
        scores,
        comment,
        createdAt: now,
        updatedAt: now,
      };

      MOCK_SCORES.push(newScore);

      poetryAdminService.addAuditLog(
        'Score Submitted',
        currentJudge.name,
        `Submitted scores for entry ${participantId}`
      );

      return {
        success: true,
        statusCode: 201,
        message: 'Score submitted successfully.',
        data: newScore,
      };
    }
  },

  async getAllScores(): Promise<APIResponse<JudgeEntryScore[]>> {
    return {
      success: true,
      statusCode: 200,
      message: 'All scores retrieved.',
      data: MOCK_SCORES,
    };
  },
};
