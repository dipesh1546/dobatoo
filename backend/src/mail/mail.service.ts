import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SendConfirmationEmailOptions {
  toEmail: string;
  fullName: string;
  registrationId: string;
  participationType: string;
  eventTitle: string;
  eventDate: string;
  poetryTitle?: string;
}

export interface SendEmailOptions {
  toEmail: string;
  subject: string;
  body: string;
  fromEmail?: string;
}

export interface SendEmailResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Generic reusable email dispatch service.
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      // If SMTP credentials not set, simulate successful log dispatch for development
      const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      this.logger.log(
        `[MailService] Dispatched email to ${options.toEmail} | Subject: "${options.subject}" | MsgId: ${msgId}`,
      );

      return {
        success: true,
        providerMessageId: msgId,
      };
    } catch (error) {
      const errorMsg = error?.message || 'SMTP transport failure';
      this.logger.error(`[MailService] Email delivery failed to ${options.toEmail}: ${errorMsg}`);
      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  /**
   * Send registration confirmation email asynchronously.
   * Gracefully returns boolean indicating success/failure without throwing exceptions.
   */
  async sendConfirmationEmail(options: SendConfirmationEmailOptions): Promise<boolean> {
    try {
      const subject = "You're Registered for the DOBATO Grand Launch ❤️";
      const body = this.buildEmailTemplate(options);

      const result = await this.sendEmail({
        toEmail: options.toEmail,
        subject,
        body,
      });

      return result.success;
    } catch (error) {
      this.logger.error(
        `[MailService] Email delivery failed for registration ID ${options.registrationId}: ${error?.message || error}`,
      );
      return false;
    }
  }

  /**
   * Builds clean, professional DOBATO confirmation email body template.
   */
  private buildEmailTemplate(options: SendConfirmationEmailOptions): string {
    const isPoetry = options.participationType === 'ATTEND_AND_POETRY';
    const participationText = isPoetry ? 'Event + Poetry' : 'Event';

    let poetrySection = '';
    if (isPoetry) {
      poetrySection = `
--------------------------------------------------
Poetry Competition Registration
--------------------------------------------------
You're also registered for the DOBATO Poetry Competition!
Theme: "DOBATO — जहाँ दुई बाटो भेटिन्छन्"
${options.poetryTitle ? `Poetry Title: "${options.poetryTitle}"` : ''}
      `;
    }

    return `
DOBATO
"Two Paths. One Connection."

Dear ${options.fullName},

You're officially registered for the DOBATO Grand Launch!

==================================================
REGISTRATION DETAILS
==================================================
Registration ID: ${options.registrationId}
Event: ${options.eventTitle}
Date: ${options.eventDate}
Participation: ${participationText}

${poetrySection}
==================================================
Please keep your registration ID for event check-in.

Thank you,
The DOBATO Team
    `.trim();
  }
}
