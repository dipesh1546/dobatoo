import type { APIResponse } from '../../types/api';
import { fetchApi } from '../apiClient';
import { adminAuthService } from './adminAuthService';

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ORGANIZER' | 'VOLUNTEER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  lastLogin?: string;
}

let MOCK_ADMIN_USERS: AdminUserData[] = [
  {
    id: 'ADM-001',
    name: 'Lead Organizer',
    email: 'admin@dobato.com',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-09-01T10:00:00Z',
    lastLogin: '2026-10-09T08:30:00Z',
  },
  {
    id: 'ADM-002',
    name: 'Event Coordinator',
    email: 'organizer@dobato.com',
    role: 'ORGANIZER',
    status: 'ACTIVE',
    createdAt: '2026-09-15T12:00:00Z',
    lastLogin: '2026-10-08T16:45:00Z',
  },
  {
    id: 'ADM-003',
    name: 'Stage Volunteer',
    email: 'volunteer@dobato.com',
    role: 'VOLUNTEER',
    status: 'ACTIVE',
    createdAt: '2026-10-01T09:00:00Z',
    lastLogin: '2026-10-07T11:20:00Z',
  },
];

export const adminUsersService = {
  async getAdminUsers(): Promise<APIResponse<AdminUserData[]>> {
    try {
      const res = await fetchApi<AdminUserData[]>('/admin/users', {
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    return {
      success: true,
      statusCode: 200,
      message: 'Admin users retrieved.',
      data: MOCK_ADMIN_USERS,
    };
  },

  async createAdminUser(
    name: string,
    email: string,
    role: 'SUPER_ADMIN' | 'ORGANIZER' | 'VOLUNTEER'
  ): Promise<APIResponse<AdminUserData>> {
    try {
      const res = await fetchApi<AdminUserData>('/admin/users', {
        method: 'POST',
        headers: adminAuthService.getAuthHeaders(),
        body: JSON.stringify({ name, email, role }),
      });
      if (res.success && res.data) return res;
    } catch {}

    const newUser: AdminUserData = {
      id: `ADM-${(MOCK_ADMIN_USERS.length + 1).toString().padStart(3, '0')}`,
      name,
      email,
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    MOCK_ADMIN_USERS.push(newUser);

    return {
      success: true,
      statusCode: 201,
      message: 'Admin user created successfully.',
      data: newUser,
    };
  },

  async toggleUserStatus(id: string): Promise<APIResponse<AdminUserData>> {
    try {
      const res = await fetchApi<AdminUserData>(`/admin/users/${id}/toggle`, {
        method: 'PATCH',
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success && res.data) return res;
    } catch {}

    const u = MOCK_ADMIN_USERS.find((item) => item.id === id);
    if (u) {
      u.status = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      return {
        success: true,
        statusCode: 200,
        message: `Admin user status updated to ${u.status}.`,
        data: u,
      };
    }

    return { success: false, statusCode: 404, message: 'Admin user not found.' };
  },

  async deleteUser(id: string): Promise<APIResponse<boolean>> {
    try {
      const res = await fetchApi<boolean>(`/admin/users/${id}`, {
        method: 'DELETE',
        headers: adminAuthService.getAuthHeaders(),
      });
      if (res.success) return res;
    } catch {}

    const initialLen = MOCK_ADMIN_USERS.length;
    MOCK_ADMIN_USERS = MOCK_ADMIN_USERS.filter((item) => item.id !== id);
    if (MOCK_ADMIN_USERS.length < initialLen) {
      return {
        success: true,
        statusCode: 200,
        message: 'Admin user deleted.',
        data: true,
      };
    }

    return { success: false, statusCode: 404, message: 'Admin user not found.' };
  },
};
