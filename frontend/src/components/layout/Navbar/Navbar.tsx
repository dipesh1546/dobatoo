import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../../common/Logo/Logo';
import { Button } from '../../ui/Button/Button';
import { Container } from '../../ui/Container/Container';
import { NAV_ITEMS, NAV_CTA } from '../../../constants/navigation';
import { useScroll } from '../../../hooks/useScroll';
import { Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { isScrolled } = useScroll(20);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`dobato-navbar-header ${
          isScrolled ? 'dobato-navbar-scrolled' : 'dobato-navbar-transparent'
        }`}
      >
        <Container size="xl" className="dobato-navbar-container">
          {/* Logo Link */}
          <Link to="/" aria-label="Dobatoo Home">
            <Logo variant="default" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="dobato-navbar-desktop-nav" aria-label="Main Navigation">
            <ul className="dobato-navbar-links">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <li key={item.label}>
                    {item.path.startsWith('/#') ? (
                      <a href={item.path} className="dobato-navbar-link">
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        className={`dobato-navbar-link ${
                          isActive ? 'dobato-navbar-link-active' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Primary Action Button */}
            <div className="dobato-navbar-actions">
              <Link to={NAV_CTA.path}>
                <Button variant="primary" size="md" icon={<Sparkles size={16} />}>
                  {NAV_CTA.label}
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            className="dobato-navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </Container>
      </header>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="dobato-navbar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`dobato-navbar-mobile-drawer ${
          mobileMenuOpen ? 'dobato-navbar-mobile-drawer-open' : ''
        }`}
        aria-label="Mobile Navigation"
      >
        <div className="dobato-navbar-mobile-header">
          <Logo variant="default" size="sm" />
          <button
            className="dobato-navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="dobato-navbar-mobile-links">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.label}>
                {item.path.startsWith('/#') ? (
                  <a
                    href={item.path}
                    className="dobato-navbar-mobile-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={18} opacity={0.5} />
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className={`dobato-navbar-mobile-link ${
                      isActive ? 'dobato-navbar-mobile-link-active' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={18} opacity={0.5} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="dobato-navbar-mobile-footer">
          <Link
            to={NAV_CTA.path}
            style={{ width: '100%' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Button variant="primary" size="lg" fullWidth icon={<Sparkles size={18} />}>
              {NAV_CTA.label}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
