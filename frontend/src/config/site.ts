import { BRAND_NAME, BRAND_SLOGAN, BRAND_DESCRIPTION } from '../constants/brand';

export const SITE_CONFIG = {
  name: BRAND_NAME,
  slogan: BRAND_SLOGAN,
  description: BRAND_DESCRIPTION,
  url: 'https://dobato.app', // Placeholder domain
  defaultTitle: `${BRAND_NAME} — ${BRAND_SLOGAN}`,
  defaultDescription: BRAND_DESCRIPTION,
  defaultOgImage: '/og-image.png',
  locale: 'en_NP',
};
