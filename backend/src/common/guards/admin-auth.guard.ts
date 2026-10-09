import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  private readonly logger = new Logger(AdminAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn(`[AdminAuthGuard] Token missing or invalid on ${request.method} ${request.url}`);
      throw new UnauthorizedException('Authentication token missing or invalid');
    }

    try {
      const jwtSecret =
        this.configService.get<string>('jwtSecret') ||
        this.configService.get<string>('JWT_SECRET') ||
        'dobato_secret_jwt_key_2026_super_secure';

      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      const adminUser = await this.prisma.adminUser.findUnique({
        where: { id: payload.sub },
      });

      if (!adminUser || !adminUser.isActive) {
        this.logger.warn(`[AdminAuthGuard] Admin account inactive or not found for ID: ${payload.sub}`);
        throw new UnauthorizedException('Admin account deactivated or invalid');
      }

      request.user = {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      };

      return true;
    } catch (error) {
      this.logger.warn(
        `[AdminAuthGuard] Auth failure on ${request.method} ${request.url}: ${
          error instanceof Error ? error.message : error
        }`,
      );
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication token invalid or expired');
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization || request.headers.Authorization;
    if (authHeader && typeof authHeader === 'string') {
      const trimmed = authHeader.trim();
      if (trimmed.toLowerCase().startsWith('bearer ')) {
        const t = trimmed.substring(7).trim();
        if (t && t !== 'undefined' && t !== 'null') {
          return t;
        }
      } else if (trimmed && trimmed !== 'undefined' && trimmed !== 'null' && trimmed.split('.').length === 3) {
        return trimmed;
      }
    }

    if (request.cookies) {
      const c =
        request.cookies.accessToken ||
        request.cookies.token ||
        request.cookies.adminToken ||
        request.cookies.dobato_admin_token;
      if (c && typeof c === 'string' && c !== 'undefined' && c !== 'null') {
        return c;
      }
    }

    const cookieHeader = request.headers.cookie;
    if (cookieHeader && typeof cookieHeader === 'string') {
      const match = cookieHeader.match(/(?:dobato_admin_token|accessToken|token|adminToken)=([^;]+)/);
      if (match && match[1]) {
        const c = decodeURIComponent(match[1].trim());
        if (c && c !== 'undefined' && c !== 'null') {
          return c;
        }
      }
    }

    return null;
  }
}
