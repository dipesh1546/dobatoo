import type { ScoreSummary, JudgingCriterion, JudgeEntryScore, PoetryParticipantDetail } from '../../types/poetryJudging';
import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';
import { scoringService } from './scoringService';
import { poetryAdminService } from './poetryAdminService';
import { criteriaService } from './criteriaService';

export const resultsService = {
  async getResults(): Promise<APIResponse<ScoreSummary[]>> {
    try {
      const res = await fetchApi<ScoreSummary[]>('/admin/poetry/results', {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    const [participantsRes, scoresRes, criteriaRes] = await Promise.all([
      poetryAdminService.getParticipants({ limit: 100 }),
      scoringService.getAllScores(),
      criteriaService.getCriteria(),
    ]);

    const participants: PoetryParticipantDetail[] = participantsRes.data?.items || [];
    const allScores: JudgeEntryScore[] = scoresRes.data || [];
    const criteria: JudgingCriterion[] = criteriaRes.data || [];

    const summaries: ScoreSummary[] = participants.map((p: PoetryParticipantDetail) => {
      // Find all judge scores for this participant
      const pScores = allScores.filter((s: JudgeEntryScore) => s.participantId === p.id || s.participantId === p.registrationId);
      const judgesCount = pScores.length;

      if (judgesCount === 0) {
        return {
          participantId: p.id,
          registrationId: p.registrationId,
          participantName: p.participantName,
          poetryTitle: p.poetryTitle,
          language: p.language,
          performanceType: p.performanceType,
          judgesCount: 0,
          rawScoreTotal: 0,
          weightedScore: 0,
          hasTie: false,
        };
      }

      // Calculate weighted score sum per judge then average across judges
      let totalWeightedSum = 0;
      let totalRaw = 0;

      pScores.forEach((judgeScore: JudgeEntryScore) => {
        let judgeWeighted = 0;
        criteria.forEach((crit: JudgingCriterion) => {
          const raw = judgeScore.scores[crit.id] || 0;
          totalRaw += raw;
          // (raw / maxScore) * weight
          judgeWeighted += (raw / (crit.maxScore || 10)) * (crit.weight || 25);
        });
        totalWeightedSum += judgeWeighted;
      });

      const averageWeighted = Number((totalWeightedSum / judgesCount).toFixed(2));
      const averageRaw = Number((totalRaw / judgesCount).toFixed(1));

      return {
        participantId: p.id,
        registrationId: p.registrationId,
        participantName: p.participantName,
        poetryTitle: p.poetryTitle,
        language: p.language,
        performanceType: p.performanceType,
        judgesCount,
        rawScoreTotal: averageRaw,
        weightedScore: averageWeighted,
        hasTie: false,
      };
    });

    // Sort highest weighted score first
    summaries.sort((a, b) => b.weightedScore - a.weightedScore);

    // Rank assignment & Tie Detection
    summaries.forEach((item, index) => {
      item.rank = index + 1;
      const tieCount = summaries.filter(
        (other) => other.participantId !== item.participantId && other.weightedScore > 0 && other.weightedScore === item.weightedScore
      ).length;

      if (tieCount > 0) {
        item.hasTie = true;
      }
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Competition results calculated.',
      data: summaries,
    };
  },
};
