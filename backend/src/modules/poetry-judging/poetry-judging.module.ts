import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../../database/database.module';
import { AdminModule } from '../admin/admin.module';
import { PoetryJudgingService } from './poetry-judging.service';
import { AdminPoetryJudgingController } from './admin-poetry-judging.controller';
import { JudgeController } from './judge.controller';
import { AdminJudgeController } from '../admin/admin-judge.controller';
import { JudgeAuthGuard } from '../../common/guards/judge-auth.guard';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    forwardRef(() => AdminModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'dobato_super_secret_jwt_key_2026',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AdminJudgeController, AdminPoetryJudgingController, JudgeController],
  providers: [PoetryJudgingService, JudgeAuthGuard, AdminAuthGuard, RolesGuard],
  exports: [PoetryJudgingService],
})
export class PoetryJudgingModule {}
