import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../common/Logo/Logo';
import { Container } from '../../ui/Container/Container';
import { BRAND_SLOGAN, BRAND_DESCRIPTION } from '../../../constants/brand';
import { FOOTER_LINK_GROUPS } from '../../../constants/navigation';
import { Heart, Mail } from 'lucide-react';
import './Footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="dobato-footer">
      <Container size="xl">
        <div className="dobato-footer-grid">
          {/* Brand Column */}
          <div className="dobato-footer-brand-col">
            <Logo variant="default" size="lg" showTagline />
            <p className="dobato-footer-description">
              {BRAND_DESCRIPTION}
            </p>
            <div className="dobato-footer-socials">
              {/* Instagram */}
              <a
                href="#"
                className="dobato-footer-social-icon"
                aria-label="Dobatoo on Instagram"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                className="dobato-footer-social-icon"
                aria-label="Dobatoo on Facebook"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                className="dobato-footer-social-icon"
                aria-label="Dobatoo on YouTube"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="#"
                className="dobato-footer-social-icon"
                aria-label="Dobatoo on TikTok"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:contact@dobato.app"
                className="dobato-footer-social-icon"
                aria-label="Email Dobatoo Team"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title} className="dobato-footer-column">
              <h4 className="dobato-footer-column-title">{group.title}</h4>
              <ul className="dobato-footer-links">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.path.startsWith('/#') ? (
                      <a href={link.path} className="dobato-footer-link">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.path} className="dobato-footer-link">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom Bar */}
        <div className="dobato-footer-bottom">
          <p>
            © {currentYear} Dobatoo. {BRAND_SLOGAN} All rights reserved.
          </p>
          <div className="dobato-footer-legal-links">
            <Link to="/privacy-policy" className="dobato-footer-link" style={{ fontSize: '0.8rem' }}>
              Privacy Policy
            </Link>
            <span style={{ opacity: 0.4 }}>•</span>
            <Link to="/terms-and-conditions" className="dobato-footer-link" style={{ fontSize: '0.8rem' }}>
              Terms & Conditions
            </Link>
            <span style={{ opacity: 0.4 }}>•</span>
            <Link to="/community-guidelines" className="dobato-footer-link" style={{ fontSize: '0.8rem' }}>
              Community Guidelines
            </Link>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Crafted with <Heart size={14} color="#F472B6" fill="#F472B6" /> for Nepal
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
