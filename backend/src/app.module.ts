import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { EventModule } from './modules/event/event.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { PoetryModule } from './modules/poetry/poetry.module';
import { AdminModule } from './modules/admin/admin.module';
import { PoetryJudgingModule } from './modules/poetry-judging/poetry-judging.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Security Rate Limiting (100 requests per minute by default)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Database Foundation
    DatabaseModule,

    // Core Open Mic Application Modules
    HealthModule,
    EventModule,
    RegistrationModule,
    PoetryModule,
    AdminModule,
    PoetryJudgingModule,
    MailModule,
  ],
})
export class AppModule {}
