import React, { useEffect } from 'react';
import type { PageMetaProps } from '../../../types/meta';
import { SITE_CONFIG } from '../../../config/site';

interface ExtendedSEOProps extends PageMetaProps {
  noindex?: boolean;
}

export const SEO: React.FC<ExtendedSEOProps> = ({
  title,
  description,
  keywords = ['DOBATO', 'DOBATO Grand Launch', 'Nepali Dating Platform', 'Poetry Event Nepal', 'Meaningful Connections', '16 October 2026'],
  ogImage,
  canonicalUrl,
  noindex = false,
}) => {
  const isHomepage = typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '');
  
  const metaTitle = title
    ? title.includes('DOBATO')
      ? title
      : `${title} | ${SITE_CONFIG.name}`
    : isHomepage
    ? 'DOBATO — Two Paths. One Connection.'
    : 'DOBATO Grand Launch — Poetry, Music & Connections';

  const metaDescription =
    description ||
    (isHomepage
      ? 'DOBATO is a platform for meaningful connections. Join the DOBATO Grand Launch for an evening of poetry, music and new connections.'
      : 'Join DOBATO for an evening of poetry, music and meaningful connections. Register for the Grand Launch on 16 October 2026.');

  const image = ogImage || SITE_CONFIG.defaultOgImage || '/assets/dobato-share-preview.png';
  const url = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://dobato.app');

  useEffect(() => {
    document.title = metaTitle;

    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attr, val] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(attr, val.replace(/"/g, ''));
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('meta[name="description"]', metaDescription);
    updateMetaTag('meta[name="keywords"]', keywords.join(', '));
    updateMetaTag('meta[property="og:title"]', metaTitle);
    updateMetaTag('meta[property="og:description"]', metaDescription);
    updateMetaTag('meta[property="og:image"]', image);
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[property="og:type"]', 'website');
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', metaTitle);
    updateMetaTag('meta[name="twitter:description"]', metaDescription);
    updateMetaTag('meta[name="twitter:image"]', image);

    const isPrivatePath =
      noindex ||
      (typeof window !== 'undefined' &&
        (window.location.pathname.startsWith('/admin') ||
          window.location.pathname === '/thank-you' ||
          window.location.pathname === '/verify'));

    if (isPrivatePath) {
      updateMetaTag('meta[name="robots"]', 'noindex, nofollow');
    } else {
      updateMetaTag('meta[name="robots"]', 'index, follow');
    }

    if (canonicalUrl) {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }

    // Inject JSON-LD Structured Data for Event & Organization
    if (!isPrivatePath) {
      let script = document.querySelector('#dobato-json-ld');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('id', 'dobato-json-ld');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://dobato.app/#organization',
            'name': 'DOBATO',
            'url': 'https://dobato.app',
            'slogan': 'Two Paths. One Connection.',
            'description': 'Nepali meaningful-connection and dating platform.',
          },
          {
            '@type': 'Event',
            '@id': 'https://dobato.app/#event',
            'name': 'DOBATO Grand Launch',
            'startDate': '2026-10-16',
            'eventStatus': 'https://schema.org/EventScheduled',
            'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
            'description': 'An evening of poetry, music and meaningful connections.',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'NPR',
              'availability': 'https://schema.org/InStock',
              'url': 'https://dobato.app/register',
            },
            'organizer': {
              '@type': 'Organization',
              'name': 'DOBATO',
              'url': 'https://dobato.app',
            },
          },
        ],
      };

      script.textContent = JSON.stringify(structuredData);
    }
  }, [metaTitle, metaDescription, keywords, image, url, canonicalUrl, noindex, isHomepage]);

  return null;
};
