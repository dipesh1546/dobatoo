import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthController } from './admin-auth.controller';
import { AdminService } from './admin.service';
import { Role } from '@prisma/client';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

describe('AdminAuthController (Phase 6)', () => {
  let controller: AdminAuthController;

  const mockAdminProfile = {
    id: 'admin-uuid-1',
    name: 'DOBATO Super Admin',
    email: 'superadmin@dobato.app',
    role: Role.SUPER_ADMIN,
  };

  const mockLoginResponse = {
    accessToken: 'mock_jwt_token_123',
    admin: mockAdminProfile,
  };

  const mockAdminService = {
    login: jest.fn(),
    getMe: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    })
      .overrideGuard(AdminAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdminAuthController>(AdminAuthController);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return login response with access token and admin profile', async () => {
      mockAdminService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login({
        email: 'superadmin@dobato.app',
        password: 'AdminSecret@2026',
      });

      expect(result.message).toBe('Login successful.');
      expect(result.data.accessToken).toBe('mock_jwt_token_123');
      expect(result.data.admin.role).toBe(Role.SUPER_ADMIN);
    });
  });

  describe('getMe', () => {
    it('should return authenticated admin profile', async () => {
      mockAdminService.getMe.mockResolvedValue(mockAdminProfile);

      const result = await controller.getMe(mockAdminProfile);

      expect(result.message).toBe('Admin profile fetched successfully.');
      expect(result.data.email).toBe('superadmin@dobato.app');
    });
  });

  describe('logout', () => {
    it('should return logout success message', async () => {
      mockAdminService.logout.mockResolvedValue({ message: 'Logout successful.' });

      const result = await controller.logout(mockAdminProfile);

      expect(result.message).toBe('Logout successful.');
    });
  });
});
