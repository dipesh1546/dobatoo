export interface NavItem {
  label: string;
  path: string;
  isExternal?: boolean;
  isCTA?: boolean;
  badge?: string;
}

export interface FooterLink {
  label: string;
  path: string;
  isExternal?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  ariaLabel: string;
}
