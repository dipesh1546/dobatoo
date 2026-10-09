/**
 * DOBATO Privacy-Safe Analytics Tracker (Phase 10)
 * Sends non-sensitive telemetry events only when tracking consent is granted.
 */

type AnalyticsEvent =
  | 'page_view'
  | 'event_view'
  | 'register_started'
  | 'register_completed'
  | 'poetry_selected'
  | 'share_clicked'
  | 'referral_clicked'
  | 'qr_pass_viewed';

const ANALYTICS_ID = import.meta.env.VITE_ANALYTICS_ID;
const CONSENT_KEY = 'dobato_analytics_consent';

export const analyticsService = {
  hasConsent(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  },

  setConsent(granted: boolean): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
  },

  trackEvent(event: AnalyticsEvent, meta?: Record<string, string | number | boolean>): void {
    // Admin and private routes should never trigger marketing analytics
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return;
    }

    if (!this.hasConsent() || !ANALYTICS_ID) {
      return;
    }

    // Strip any inadvertent PII fields before tracking
    const safeMeta = { ...meta };
    delete (safeMeta as any).email;
    delete (safeMeta as any).phone;
    delete (safeMeta as any).password;
    delete (safeMeta as any).registrationId;
    delete (safeMeta as any).verificationToken;

    if (import.meta.env.DEV) {
      console.log(`[DOBATO Analytics]: ${event}`, safeMeta);
    }

    // Example GTAG / Telemetry dispatcher if configured
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', event, safeMeta);
    }
  },

  trackPageView(path: string): void {
    this.trackEvent('page_view', { path });
  },
};
