import type { WinnerSelection, WinnerSlot } from '../../types/poetryJudging';
import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';
import { poetryAdminService } from './poetryAdminService';

let MOCK_WINNERS: WinnerSelection = {
  firstPlace: {
    participantId: 'PTR-2026-001',
    registrationId: 'DBT-2026-000101',
    participantName: 'Aayush Shrestha',
    poetryTitle: 'Mayaluki Batoma (मायालुकी बाटोमा)',
    weightedScore: 87.5,
    prizeText: 'NPR 3,000 + Trophy + T-shirt + Lifetime Free DOBATO Access',
  },
  secondPlace: {
    participantId: 'PTR-2026-002',
    registrationId: 'DBT-2026-000103',
    participantName: 'Rohan Gurung',
    poetryTitle: 'Echoes of Fewa',
    weightedScore: 85.0,
    prizeText: 'NPR 2,000 + Trophy + T-shirt + 6 Months Free DOBATO Access',
  },
  thirdPlace: {
    participantId: 'PTR-2026-005',
    registrationId: 'DBT-2026-000110',
    participantName: 'Manish Verma',
    poetryTitle: 'Dil Ki Baat (दिल की बात)',
    weightedScore: 82.5,
    prizeText: 'Trophy + T-shirt + 3 Months Free DOBATO Access',
  },
};

export const winnerService = {
  async getWinnerSelection(): Promise<APIResponse<WinnerSelection>> {
    try {
      const res = await fetchApi<WinnerSelection>('/admin/poetry/winners', {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    return {
      success: true,
      statusCode: 200,
      message: 'Winner selection retrieved.',
      data: MOCK_WINNERS,
    };
  },

  async saveWinnerSelection(selection: {
    firstPlace?: WinnerSlot | null;
    secondPlace?: WinnerSlot | null;
    thirdPlace?: WinnerSlot | null;
  }): Promise<APIResponse<WinnerSelection>> {
    // Check for duplicate participant across 1st, 2nd, and 3rd slots
    const selectedIds = [
      selection.firstPlace?.participantId,
      selection.secondPlace?.participantId,
      selection.thirdPlace?.participantId,
    ].filter(Boolean);

    const uniqueIds = new Set(selectedIds);
    if (selectedIds.length !== uniqueIds.size) {
      return {
        success: false,
        statusCode: 422,
        message: 'A participant cannot be selected for multiple prize positions.',
      };
    }

    try {
      const res = await fetchApi<WinnerSelection>('/admin/poetry/winners', {
        method: 'PUT',
        headers: adminAuthService.getAuthHeaders(),
        body: JSON.stringify(selection),
      });
      if (res.success && res.data) return res;
    } catch {}

    MOCK_WINNERS = {
      ...selection,
      finalizedAt: MOCK_WINNERS.finalizedAt,
      finalizedBy: MOCK_WINNERS.finalizedBy,
    };

    poetryAdminService.addAuditLog(
      'Winner Selection Saved',
      'Lead Admin',
      `Selected 1st: ${selection.firstPlace?.participantName || 'None'}, 2nd: ${selection.secondPlace?.participantName || 'None'}, 3rd: ${selection.thirdPlace?.participantName || 'None'}`
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Winner selection saved successfully.',
      data: MOCK_WINNERS,
    };
  },

  async finalizeCompetition(selection: {
    firstPlace?: WinnerSlot | null;
    secondPlace?: WinnerSlot | null;
    thirdPlace?: WinnerSlot | null;
  }): Promise<APIResponse<WinnerSelection>> {
    const saveRes = await this.saveWinnerSelection(selection);
    if (!saveRes.success) return saveRes;

    const now = new Date().toISOString();
    MOCK_WINNERS.finalizedAt = now;
    MOCK_WINNERS.finalizedBy = 'Lead Admin';

    // Lock competition status in poetryAdminService
    await poetryAdminService.updateCompetitionStatus('FINALIZED');

    poetryAdminService.addAuditLog(
      'Competition Finalized',
      'Lead Admin',
      'Results finalized and winner selection locked permanently.'
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Competition results finalized and locked successfully.',
      data: MOCK_WINNERS,
    };
  },
};
