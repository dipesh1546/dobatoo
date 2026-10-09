import type { JudgingCriterion } from '../../types/poetryJudging';
import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';

let MOCK_CRITERIA: JudgingCriterion[] = [
  {
    id: 'CRT-001',
    name: 'Originality',
    description: 'Uniqueness of poetic structure, imagery, voice, and perspective.',
    weight: 25,
    maxScore: 10,
  },
  {
    id: 'CRT-002',
    name: 'Expression',
    description: 'Vocal clarity, emotional delivery, body language, and stage presence.',
    weight: 25,
    maxScore: 10,
  },
  {
    id: 'CRT-003',
    name: 'Theme Interpretation',
    description: 'Connection to the official theme: "DOBATO — जहाँ दुई बाटो भेटिन्छन्".',
    weight: 25,
    maxScore: 10,
  },
  {
    id: 'CRT-004',
    name: 'Performance',
    description: 'Overall impact, audience connection, rhythm, and execution.',
    weight: 25,
    maxScore: 10,
  },
];

export const criteriaService = {
  async getCriteria(): Promise<APIResponse<JudgingCriterion[]>> {
    try {
      const res = await fetchApi<JudgingCriterion[]>('/admin/poetry/criteria', {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    return {
      success: true,
      statusCode: 200,
      message: 'Criteria retrieved.',
      data: MOCK_CRITERIA,
    };
  },

  async updateCriteria(criteriaList: JudgingCriterion[]): Promise<APIResponse<JudgingCriterion[]>> {
    const totalWeight = criteriaList.reduce((sum, c) => sum + Number(c.weight), 0);

    if (totalWeight !== 100) {
      return {
        success: false,
        statusCode: 422,
        message: `Total criteria weight must equal exactly 100%. Currently: ${totalWeight}%.`,
      };
    }

    try {
      const res = await fetchApi<JudgingCriterion[]>('/admin/poetry/criteria', {
        method: 'PUT',
        headers: adminAuthService.getAuthHeaders(),
        body: JSON.stringify({ criteria: criteriaList }),
      });
      if (res.success && res.data) return res;
    } catch {}

    MOCK_CRITERIA = [...criteriaList];

    return {
      success: true,
      statusCode: 200,
      message: 'Judging criteria updated successfully.',
      data: MOCK_CRITERIA,
    };
  },
};
