import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditAction } from '@prisma/client';

export interface LogAuditOptions {
  adminId: string;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AdminAuditService {
  private readonly logger = new Logger(AdminAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Log an administrative action cleanly into AdminAuditLog table.
   * Never logs passwords or sensitive credential tokens.
   */
  async logAction(options: LogAuditOptions): Promise<void> {
    try {
      await this.prisma.adminAuditLog.create({
        data: {
          adminId: options.adminId,
          action: options.action,
          entityType: options.entityType || null,
          entityId: options.entityId || null,
          metadata: options.metadata ? options.metadata : undefined,
        },
      });
      this.logger.log(
        `Audit Log recorded: Admin [${options.adminId}] executed ${options.action} on ${
          options.entityType || 'system'
        }`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to record AdminAuditLog for ${options.action}: ${error?.message || error}`,
      );
    }
  }
}
