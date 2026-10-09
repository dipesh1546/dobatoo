import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JudgeAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token required.');
    }

    const token = authHeader.split(' ')[1];
    let payload: any;

    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'dobato_super_secret_jwt_key_2026';
      payload = this.jwtService.verify(token, { secret });
    } catch {
      throw new UnauthorizedException('Invalid or expired authentication token.');
    }

    if (payload.role !== 'JUDGE') {
      throw new ForbiddenException('Access restricted to authorized judges.');
    }

    const judge = await this.prisma.judge.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!judge || !judge.isActive) {
      throw new UnauthorizedException('Judge account is inactive or no longer exists.');
    }

    request.user = judge;
    return true;
  }
}
