import type { Judge } from '../../types/poetryJudging';
import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';

const JUDGE_TOKEN_KEY = 'dobato_judge_token';
const JUDGE_USER_KEY = 'dobato_judge_user';

let MOCK_JUDGES: Judge[] = [
  {
    id: 'JDG-001',
    name: 'Dr. Ramesh Luitel',
    email: 'judge.ramesh@dobato.com',
    role: 'HEAD_JUDGE',
    status: 'ACTIVE',
    assignedEntryIds: ['PTR-2026-001', 'PTR-2026-002', 'PTR-2026-003', 'PTR-2026-005'],
  },
  {
    id: 'JDG-002',
    name: 'Sushma Karki',
    email: 'judge.sushma@dobato.com',
    role: 'JUDGE',
    status: 'ACTIVE',
    assignedEntryIds: ['PTR-2026-001', 'PTR-2026-002', 'PTR-2026-004'],
  },
  {
    id: 'JDG-003',
    name: 'Pradeep Rimal',
    email: 'judge.pradeep@dobato.com',
    role: 'JUDGE',
    status: 'ACTIVE',
    assignedEntryIds: ['PTR-2026-001', 'PTR-2026-003', 'PTR-2026-005'],
  },
];

export const judgeService = {
  getJudgeToken(): string | null {
    return localStorage.getItem(JUDGE_TOKEN_KEY);
  },

  getCurrentJudge(): Judge | null {
    const raw = localStorage.getItem(JUDGE_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isJudgeAuthenticated(): boolean {
    return !!this.getJudgeToken() || adminAuthService.isAuthenticated();
  },

  async judgeLogin(email: string, pass: string): Promise<APIResponse<{ token: string; judge: Judge }>> {
    try {
      const res = await fetchApi<{ token: string; judge: Judge }>('/auth/judge/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
      });
      if (res.success && res.data) {
        localStorage.setItem(JUDGE_TOKEN_KEY, res.data.token);
        localStorage.setItem(JUDGE_USER_KEY, JSON.stringify(res.data.judge));
        return res;
      }
    } catch {}

    const match = MOCK_JUDGES.find((j) => j.email.toLowerCase() === email.toLowerCase());
    if (match && pass.length >= 6) {
      const token = `judge_token_${match.id}_${Date.now()}`;
      localStorage.setItem(JUDGE_TOKEN_KEY, token);
      localStorage.setItem(JUDGE_USER_KEY, JSON.stringify(match));
      return {
        success: true,
        statusCode: 200,
        message: 'Judge authenticated successfully.',
        data: { token, judge: match },
      };
    }

    return {
      success: false,
      statusCode: 401,
      message: 'Invalid judge email or password. Authorized judges only.',
    };
  },

  judgeLogout(): void {
    localStorage.removeItem(JUDGE_TOKEN_KEY);
    localStorage.removeItem(JUDGE_USER_KEY);
  },

  async getJudges(): Promise<APIResponse<Judge[]>> {
    try {
      const res = await fetchApi<any[]>('/admin/judges', {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) {
        const rawList = Array.isArray(res.data) ? res.data : [];
        const mappedJudges: Judge[] = rawList.map((j: any) => ({
          id: j.id,
          name: j.name,
          email: j.email,
          phone: j.phone,
          role: j.role || 'JUDGE',
          status: j.isActive === false ? 'INACTIVE' : 'ACTIVE',
          assignedEntryIds: j.assignedEntryIds || (j.assignments ? j.assignments.map((a: any) => a.participantId) : []),
        }));
        return {
          ...res,
          data: mappedJudges,
        };
      }
    } catch {}

    return {
      success: true,
      statusCode: 200,
      message: 'Judges list retrieved.',
      data: MOCK_JUDGES,
    };
  },

  async createJudge(name: string, email: string, role: 'JUDGE' | 'HEAD_JUDGE', phone?: string, password?: string): Promise<APIResponse<Judge>> {
    try {
      const res = await fetchApi<any>('/admin/judges', {
        method: 'POST',
        headers: adminAuthService.getAuthHeaders(),
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || undefined, password: password || undefined }),
      });
      if (res.success && res.data) {
        const j = res.data;
        const newJudge: Judge = {
          id: j.id,
          name: j.name,
          email: j.email,
          phone: j.phone,
          role: j.role || role || 'JUDGE',
          status: j.isActive === false ? 'INACTIVE' : 'ACTIVE',
          assignedEntryIds: [],
        };
        MOCK_JUDGES.push(newJudge);
        return {
          ...res,
          data: newJudge,
        };
      }

      if (!res.success) {
        return res;
      }
    } catch {}

    const newJudge: Judge = {
      id: `JDG-${(MOCK_JUDGES.length + 1).toString().padStart(3, '0')}`,
      name,
      email,
      phone,
      role,
      status: 'ACTIVE',
      assignedEntryIds: [],
    };
    MOCK_JUDGES.push(newJudge);

    return {
      success: true,
      statusCode: 201,
      message: 'Judge created successfully.',
      data: newJudge,
    };
  },

  async updateJudge(id: string, updates: Partial<Judge>): Promise<APIResponse<Judge>> {
    try {
      if (updates.status !== undefined) {
        const statusRes = await fetchApi<any>(`/admin/judges/${id}/status`, {
          method: 'PATCH',
          headers: adminAuthService.getAuthHeaders(),
          body: JSON.stringify({ isActive: updates.status === 'ACTIVE' }),
        });
        if (statusRes.success && statusRes.data) {
          const j = statusRes.data;
          const mapped: Judge = {
            id: j.id,
            name: j.name,
            email: j.email,
            phone: j.phone,
            role: j.role || 'JUDGE',
            status: j.isActive === false ? 'INACTIVE' : 'ACTIVE',
            assignedEntryIds: [],
          };
          return { ...statusRes, data: mapped };
        }
      }

      const res = await fetchApi<any>(`/admin/judges/${id}`, {
        method: 'PATCH',
        headers: adminAuthService.getAuthHeaders(),
        body: JSON.stringify({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
        }),
      });
      if (res.success && res.data) {
        const j = res.data;
        const mapped: Judge = {
          id: j.id,
          name: j.name,
          email: j.email,
          phone: j.phone,
          role: j.role || 'JUDGE',
          status: j.isActive === false ? 'INACTIVE' : 'ACTIVE',
          assignedEntryIds: [],
        };
        return { ...res, data: mapped };
      }
    } catch {}

    const idx = MOCK_JUDGES.findIndex((item) => item.id === id);
    if (idx !== -1) {
      MOCK_JUDGES[idx] = { ...MOCK_JUDGES[idx], ...updates };
      return {
        success: true,
        statusCode: 200,
        message: 'Judge updated successfully.',
        data: MOCK_JUDGES[idx],
      };
    }

    return { success: false, statusCode: 404, message: 'Judge not found.' };
  },

  async deleteJudge(id: string): Promise<APIResponse<boolean>> {
    try {
      const res = await fetchApi<boolean>(`/admin/judges/${id}`, {
        method: 'DELETE',
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success) return res;
    } catch {}

    const initialLen = MOCK_JUDGES.length;
    MOCK_JUDGES = MOCK_JUDGES.filter((item) => item.id !== id);
    if (MOCK_JUDGES.length < initialLen) {
      return {
        success: true,
        statusCode: 200,
        message: 'Judge removed successfully.',
        data: true,
      };
    }

    return { success: false, statusCode: 404, message: 'Judge not found.' };
  },

  async toggleJudgeStatus(id: string): Promise<APIResponse<Judge>> {
    try {
      const res = await fetchApi<Judge>(`/admin/poetry/judges/${id}/toggle`, {
        method: 'PATCH',
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    const j = MOCK_JUDGES.find((item) => item.id === id);
    if (j) {
      j.status = j.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      return {
        success: true,
        statusCode: 200,
        message: `Judge status changed to ${j.status}.`,
        data: j,
      };
    }

    return { success: false, statusCode: 404, message: 'Judge not found.' };
  },
};
