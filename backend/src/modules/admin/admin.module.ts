import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminAuthController } from './admin-auth.controller';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminRegistrationController } from './admin-registration.controller';
import { AdminPoetryController } from './admin-poetry.controller';
import { AdminUserController } from './admin-user.controller';
import { AdminService } from './admin.service';
import { AdminAuditService } from './admin-audit.service';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PoetryJudgingModule } from '../poetry-judging/poetry-judging.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('jwtSecret') ||
          configService.get<string>('JWT_SECRET') ||
          'dobato_secret_jwt_key_2026_super_secure',
        signOptions: { expiresIn: '24h' },
      }),
    }),
    forwardRef(() => PoetryJudgingModule),
  ],
  controllers: [
    AdminAuthController,
    AdminDashboardController,
    AdminRegistrationController,
    AdminPoetryController,
    AdminUserController,
  ],
  providers: [AdminService, AdminAuditService, AdminAuthGuard, RolesGuard],
  exports: [AdminService, AdminAuditService, JwtModule],
})
export class AdminModule {}
