import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable Graceful Shutdown Hooks (SIGTERM/SIGINT) for production orchestration
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || configService.get<number>('port', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV') || configService.get<string>('nodeEnv', 'development');
  const frontendUrl = configService.get<string>('FRONTEND_URL') || configService.get<string>('frontendUrl', 'http://localhost:5173');
  const corsOriginsEnv = configService.get<string>('CORS_ORIGINS');
  const enableSwagger = configService.get<string>('ENABLE_SWAGGER', 'true') !== 'false';

  // Production-grade Security HTTP Headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Prevents Swagger UI CDN/stylesheet blocking
      referrerPolicy: { policy: 'same-origin' },
      frameguard: { action: 'deny' },
      noSniff: true,
      xssFilter: true,
    }),
  );

  // Global API Prefix (/api/v1)
  app.setGlobalPrefix('api/v1');

  // CORS Configuration
  const staticAllowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'https://dobato.app',
    'https://www.dobato.app',
  ];

  if (frontendUrl && !staticAllowedOrigins.includes(frontendUrl)) {
    staticAllowedOrigins.push(frontendUrl);
  }

  if (corsOriginsEnv) {
    corsOriginsEnv.split(',').forEach((o) => {
      const trimmed = o.trim();
      if (trimmed && !staticAllowedOrigins.includes(trimmed)) {
        staticAllowedOrigins.push(trimmed);
      }
    });
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server requests or CLI/curl without Origin header
      if (!origin) return callback(null, true);

      const isAllowed =
        staticAllowedOrigins.includes(origin) ||
        /^https:\/\/([a-zA-Z0-9-]+\.)?dobato\.app$/.test(origin) ||
        /^https:\/\/([a-zA-Z0-9-]+\.)?onrender\.com$/.test(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'x-requested-with',
      'Idempotency-Key',
      'idempotency-key',
    ],
    credentials: true,
  });

  // Global Request Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Interceptors & Exception Filters
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // OpenAPI / Swagger Setup
  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('DOBATO API Documentation')
      .setDescription(
        'Official Backend API for DOBATO - Open Mic Event & Platform Launch.\nBrand Slogan: "Two Paths. One Connection."',
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('Health', 'API and system health status endpoints')
      .addTag('Event', 'DOBATO Grand Launch Event details and public metadata')
      .addTag('Registration', 'Public open mic event registration')
      .addTag('Poetry', 'Public poetry competition guidelines and prizes')
      .addTag('Admin - Registrations', 'Registration listing, participant search, manual entry')
      .addTag('Admin - Poetry', 'Poetry entries, scoring overview, and judge assignments')
      .addTag('Admin - Judges', 'Dedicated judge account management and status controls')
      .addTag('Admin - Users', 'Role-based administrator user management')
      .addTag('Admin - Dashboard & Analytics', 'Open mic performance metrics & statistics')
      .addTag('Judge Interface', 'Judge portal login, assigned entries, and scoring')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'DOBATO API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(port);
  logger.log(`====================================================`);
  logger.log(`🚀 DOBATO Backend API running on port ${port}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
  logger.log(`📌 Base URL: http://localhost:${port}/api/v1`);
  logger.log(`🏥 Health Check: http://localhost:${port}/api/v1/health`);
  if (enableSwagger) {
    logger.log(`📖 OpenAPI Docs: http://localhost:${port}/api/docs`);
  }
  logger.log(`====================================================`);
}

bootstrap();
