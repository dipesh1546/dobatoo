export interface LegalSection {
  id: string;
  title: string;
  content: string[];
  bullets?: string[];
}

export interface LegalDocument {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  lastUpdated: string;
  introduction: string;
  sections: LegalSection[];
}

export const LEGAL_LAST_UPDATED = '16 October 2026';

export const PRIVACY_POLICY: LegalDocument = {
  title: 'Privacy Policy',
  slug: '/privacy-policy',
  seoTitle: 'Dobatoo Privacy Policy',
  seoDescription: 'Learn how Dobatoo handles user information, privacy, communication and event participation.',
  lastUpdated: LEGAL_LAST_UPDATED,
  introduction:
    'Dobatoo ("Two Paths. One Connection.") is committed to protecting your personal privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you register for the Dobatoo Grand Launch, participate in our events or poetry competition, or interact with our platform.',
  sections: [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: [
        'Welcome to Dobatoo. We respect your privacy and are committed to keeping your personal details secure. This policy applies to all visitors, attendees, and performers participating in Dobatoo events and digital services.',
        'By accessing Dobatoo services or registering for our events, you agree to the collection and use of information in accordance with this Privacy Policy.',
      ],
    },
    {
      id: 'information-collected',
      title: '2. Information We Collect',
      content: [
        'We collect information necessary to provide seamless event registration, manage poetry performances, issue event passes, and communicate platform updates.',
      ],
      bullets: [
        'Personal identification information (Full Name, Email Address, Phone Number)',
        'Optional demographic details (Gender preference)',
        'Event performance details (Stage Introduction Name, Performance Type, Description)',
        'Event discovery details (Where you heard about Dobatoo)',
        'Technical data (IP addresses, browser type, device information via cookies/analytics)',
      ],
    },
    {
      id: 'information-provided',
      title: '3. Information You Provide',
      content: [
        'When you register for Dobatoo Grand Launch or sign up on our platform, you directly provide us with information. All provided information must be accurate and truthful to ensure smooth check-in and stage introduction.',
      ],
    },
    {
      id: 'event-registration-info',
      title: '4. Event Registration Information',
      content: [
        'During free event registration, we collect your contact details and performance choices. This information is used strictly to issue your digital QR Event Pass, verify your entry at the venue, and coordinate stage performances.',
      ],
    },
    {
      id: 'how-we-use-info',
      title: '5. How We Use Information',
      content: [
        'We use the collected information for specific operational and community purposes:',
      ],
      bullets: [
        'Generating and verifying digital QR event passes',
        'Managing poetry and performance schedules and stage introductions',
        'Sending event reminders, confirmation tickets, and venue updates',
        'Processing referral reward points and discount eligibilities',
        'Improving event safety, attendee experience, and platform performance',
      ],
    },
    {
      id: 'photography-video',
      title: '6. Event Photography & Video',
      content: [
        'By submitting your registration, you agree that Dobatoo may capture photographs and video recordings of your participation during the Dobatoo Grand Launch and associated events.',
        'These media materials may be used for Dobatoo promotional activities, official social media campaigns, recap videos, and promotional website features.',
      ],
    },
    {
      id: 'communications',
      title: '7. Communications',
      content: [
        'We may contact you via SMS, Email, or WhatsApp regarding your event pass, schedule updates, or important announcements. You can opt out of promotional emails at any time by contacting support or using the provided unsubscribe mechanism.',
      ],
    },
    {
      id: 'cookies-analytics',
      title: '8. Cookies and Analytics',
      content: [
        'Dobatoo uses session storage, local storage, and cookies to remember user preferences, referral codes, and analyze traffic patterns. You can control cookie settings in your web browser.',
      ],
    },
    {
      id: 'data-sharing',
      title: '9. Data Sharing',
      content: [
        'Dobatoo does not sell, rent, or trade your personal information to third parties for marketing purposes. We only share information with trusted infrastructure providers (e.g., SMS gateways, hosting services) required to operate the service.',
      ],
    },
    {
      id: 'data-security',
      title: '10. Data Security',
      content: [
        'We implement industry-standard security measures including SSL encryption, secure access controls, and rate-limiting to protect your data against unauthorized access, alteration, or disclosure.',
      ],
    },
    {
      id: 'data-retention',
      title: '11. Data Retention',
      content: [
        'We retain event registration records for as long as necessary to fulfill event management, referral reward verification, legal obligations, and platform account services.',
      ],
    },
    {
      id: 'user-rights',
      title: '12. User Rights',
      content: [
        'You have the right to request access to, correction of, or deletion of your personal data stored by Dobatoo. Contact our support team to exercise these rights.',
      ],
    },
    {
      id: 'third-party-services',
      title: '13. Third-Party Services',
      content: [
        'Our platform may contain links to social media channels (Instagram, TikTok, Facebook). Dobatoo is not responsible for the privacy practices of external third-party services.',
      ],
    },
    {
      id: 'childrens-privacy',
      title: '14. Children\'s Privacy',
      content: [
        'Dobatoo services and event registrations are intended for individuals who have reached the age of majority or participating with guardian awareness. We do not knowingly collect personal data from children under 13.',
      ],
    },
    {
      id: 'policy-changes',
      title: '15. Changes to This Policy',
      content: [
        'Dobatoo reserves the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date.',
      ],
    },
    {
      id: 'contact-info',
      title: '16. Contact Information',
      content: [
        'If you have questions, concerns, or data requests regarding this Privacy Policy, please reach out to the Dobatoo team via our official event desk or contact channels at support@dobatoo.app.',
      ],
    },
  ],
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  title: 'Terms & Conditions',
  slug: '/terms-and-conditions',
  seoTitle: 'Dobatoo Terms & Conditions',
  seoDescription: 'Review the terms that apply to Dobatoo platform use, event participation and community activities.',
  lastUpdated: LEGAL_LAST_UPDATED,
  introduction:
    'These Terms & Conditions govern your access to Dobatoo platform, event registration for the Dobatoo Grand Launch, participation in poetry and music competitions, and referral reward programs. Please read these terms carefully before registering or participating.',
  sections: [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: [
        'By registering for the Dobatoo Grand Launch or accessing the Dobatoo website, you agree to be bound by these Terms & Conditions and our Community Guidelines. If you do not agree, please do not use our services.',
      ],
    },
    {
      id: 'about-dobato',
      title: '2. About Dobatoo',
      content: [
        'Dobatoo ("Two Paths. One Connection.") is a meaningful connection and social dating platform designed in Nepal. Our launch event brings together poetry, live acoustic music, and curated social mixers.',
      ],
    },
    {
      id: 'event-registration',
      title: '3. Event Registration',
      content: [
        'Event registration for the Dobatoo Grand Launch is free of charge. Each registrant receives a unique digital QR Event Pass required for venue entry.',
        'Each attendee may register once. Providing false contact details may result in cancellation of your event pass.',
      ],
    },
    {
      id: 'event-participation',
      title: '4. Event Participation',
      content: [
        'Attendees may choose to attend only or register as performers (Poetry, Story Telling, Music, or Other). Organizers reserve the right to schedule stage time based on event flow.',
      ],
    },
    {
      id: 'poetry-competition',
      title: '5. Poetry Competition',
      content: [
        'Performers compete under the core event theme "Finding the Right Person — जहाँ दुई बाटो भेटिन्छन्".',
        'Official competition prizes consist of 1st Prize (NPR 2,500 cash + Lifetime Free Dobatoo Access + Trophy + T-shirt), 2nd Prize (NPR 1,000 cash + 6 Months Free Dobatoo Access + Trophy + T-shirt), and 3rd Prize (3 Months Free Dobatoo Access + Trophy + T-shirt).',
        'Judging decisions rendered by assigned judges are final.',
      ],
    },
    {
      id: 'participant-responsibilities',
      title: '6. Participant Responsibilities',
      content: [
        'Participants must arrive on time, adhere to stage schedules, and maintain respectful conduct toward fellow attendees, performers, and organizers.',
      ],
    },
    {
      id: 'user-conduct',
      title: '7. User Conduct',
      content: [
        'Hate speech, harassment, vulgarity, political agitation, or offensive behavior will not be tolerated. Violation of user conduct standards will result in immediate removal from the venue and platform disqualification.',
      ],
    },
    {
      id: 'intellectual-property',
      title: '8. Intellectual Property',
      content: [
        'Performers retain ownership of their original poetry and stories. By performing at Dobatoo events, you grant Dobatoo a non-exclusive license to record, broadcast, and feature your performance for promotional purposes.',
      ],
    },
    {
      id: 'photography-video-terms',
      title: '9. Photography and Video Consent',
      content: [
        'By registering, attendees and performers agree that Dobatoo may record photographs and video clips of the event and use them across official media channels.',
      ],
    },
    {
      id: 'event-changes',
      title: '10. Event Changes / Cancellation',
      content: [
        'Dobatoo reserves the right to adjust event timing, venue capacity, schedule, or lineup if necessary due to weather, safety, or administrative requirements. Registrants will be notified promptly.',
      ],
    },
    {
      id: 'prizes-awards',
      title: '11. Prizes and Awards',
      content: [
        'Cash prizes and merchandise awards will be distributed to validated competition winners following the event. Prizes are non-transferable and non-exchangeable.',
      ],
    },
    {
      id: 'referral-rewards',
      title: '12. Referral Rewards',
      content: [
        'Users who invite friends via valid Dobatoo referral links earn Referral Points. Points balance and subscription discounts are subject to backend verification and platform reward terms.',
      ],
    },
    {
      id: 'platform-availability',
      title: '13. Platform Availability',
      content: [
        'Dobatoo strives to maintain continuous platform availability but does not guarantee uninterrupted operation during system maintenance or unforeseen network interruptions.',
      ],
    },
    {
      id: 'limitation-liability',
      title: '14. Limitation of Liability',
      content: [
        'Dobatoo and its organizers shall not be held liable for any indirect, incidental, or consequential damages resulting from event attendance, venue transit, or platform usage.',
      ],
    },
    {
      id: 'changes-to-terms',
      title: '15. Changes to Terms',
      content: [
        'We reserve the right to revise these Terms & Conditions at any time. Continued participation signifies acceptance of updated terms.',
      ],
    },
    {
      id: 'terms-contact',
      title: '16. Contact Information',
      content: [
        'For inquiries regarding these Terms & Conditions, please contact Dobatoo at support@dobatoo.app.',
      ],
    },
  ],
};

export const COMMUNITY_GUIDELINES: LegalDocument = {
  title: 'Community Guidelines',
  slug: '/community-guidelines',
  seoTitle: 'Dobatoo Community Guidelines',
  seoDescription: 'Learn how Dobatoo promotes respectful, safe and meaningful connections.',
  lastUpdated: LEGAL_LAST_UPDATED,
  introduction:
    'Dobatoo ("Two Paths. One Connection.") was created to foster genuine, respectful, and meaningful connections. These Community Guidelines set the standard of behavior expected across Dobatoo events, open-mic performances, and digital interactions.',
  sections: [
    {
      id: 'be-respectful',
      title: '1. Be Respectful',
      content: [
        'Treat every person with kindness, courtesy, and empathy. Dobatoo brings together individuals from diverse paths and backgrounds; respect different perspectives, stories, and creative expressions.',
      ],
    },
    {
      id: 'no-harassment',
      title: '2. No Harassment',
      content: [
        'Harassment in any form — online or in person — is strictly prohibited. This includes persistent unwanted communication, intimidation, stalking, offensive comments, or non-consensual behavior.',
      ],
    },
    {
      id: 'no-hate-speech',
      title: '3. No Hate Speech',
      content: [
        'Dobatoo has zero tolerance for hate speech. Discrimination, derogatory remarks, or slurs based on ethnicity, gender, sexual orientation, religion, age, or disability are strictly forbidden.',
      ],
    },
    {
      id: 'no-threats',
      title: '4. No Threats or Violence',
      content: [
        'Threats of physical harm, violence, or dangerous behavior will result in immediate event ejection, permanent account termination, and reporting to authorities if necessary.',
      ],
    },
    {
      id: 'no-sexual-harassment',
      title: '5. No Sexual Harassment',
      content: [
        'All social mixers and performances must remain safe and consensual. Unwelcome sexual advances, explicit comments, inappropriate touching, or boundary violations are forbidden.',
      ],
    },
    {
      id: 'no-spam-scams',
      title: '6. No Spam or Scams',
      content: [
        'Do not use Dobatoo events or platforms for unauthorized commercial advertising, financial solicitation, multi-level marketing, or distribution of spam.',
      ],
    },
    {
      id: 'respect-privacy',
      title: '7. Respect Privacy',
      content: [
        'Respect the private contact information of fellow attendees. Do not share personal phone numbers, photos, or private conversations without explicit consent.',
      ],
    },
    {
      id: 'no-impersonation',
      title: '8. No Impersonation',
      content: [
        'Be authentic. Do not impersonate other individuals, public figures, or Dobatoo organizers in person or online.',
      ],
    },
    {
      id: 'event-behavior',
      title: '9. Appropriate Event Behavior',
      content: [
        'During Dobatoo Grand Launch and open-mic sessions, listen attentively to performers, avoid disruptive behavior, follow venue instructions, and keep the atmosphere warm and supportive.',
      ],
    },
    {
      id: 'content-standards',
      title: '10. Poetry & Event Content Standards',
      content: [
        'Performers should embrace the theme "Finding the Right Person". Artistic expressions must not contain sexually explicit content, defamation, or hate speech.',
      ],
    },
    {
      id: 'reporting',
      title: '11. Reporting Problems',
      content: [
        'If you experience or witness behavior that violates these guidelines, report it immediately to a Dobatoo event organizer on site or email us at support@dobatoo.app. All reports are handled confidentially.',
      ],
    },
    {
      id: 'enforcement',
      title: '12. Enforcement',
      content: [
        'Violations of these guidelines may lead to warnings, stage disqualification, immediate venue removal, event pass cancellation, or permanent platform bans.',
      ],
    },
  ],
};
