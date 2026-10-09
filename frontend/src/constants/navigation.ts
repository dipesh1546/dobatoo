import type { NavItem, FooterLinkGroup, SocialLink } from '../types/navigation';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'The Event', path: '/event' },
  { label: 'Poetry', path: '/poetry' },
  { label: 'About DOBATO', path: '/#about' },
];

export const NAV_CTA: NavItem = {
  label: 'Register Free',
  path: '/register',
  isCTA: true,
};

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', path: '/' },
      { label: 'The Event', path: '/event' },
      { label: 'Poetry Competition', path: '/poetry' },
      { label: 'Register Free', path: '/register' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'About DOBATO', path: '/#about' },
      { label: 'Our Story', path: '/#story' },
      { label: 'Upcoming Events', path: '/event' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms & Conditions', path: '/terms-and-conditions' },
      { label: 'Community Guidelines', path: '/community-guidelines' },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'Instagram',
    url: '#',
    icon: 'instagram',
    ariaLabel: 'Follow DOBATO on Instagram',
  },
  {
    platform: 'Facebook',
    url: '#',
    icon: 'facebook',
    ariaLabel: 'Follow DOBATO on Facebook',
  },
  {
    platform: 'TikTok',
    url: '#',
    icon: 'tiktok',
    ariaLabel: 'Follow DOBATO on TikTok',
  },
  {
    platform: 'YouTube',
    url: '#',
    icon: 'youtube',
    ariaLabel: 'Subscribe to DOBATO on YouTube',
  },
];
