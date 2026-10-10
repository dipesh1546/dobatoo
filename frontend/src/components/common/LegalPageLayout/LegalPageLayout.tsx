import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../../ui/Section/Section';
import { Container } from '../../ui/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { Badge } from '../../ui/Badge/Badge';
import { Card } from '../../ui/Card/Card';
import type { LegalDocument } from '../../../content/legal/legalContent';
import { Shield, ChevronRight, Calendar, Mail, FileText } from 'lucide-react';
import './LegalPageLayout.css';

interface LegalPageLayoutProps {
  document: LegalDocument;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ document }) => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Dynamic document title & meta description update
    if (document.seoTitle) {
      window.document.title = document.seoTitle;
    }

    let metaDesc = window.document.querySelector('meta[name="description"]');
    if (document.seoDescription) {
      if (!metaDesc) {
        metaDesc = window.document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        window.document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', document.seoDescription);
    }
  }, [document]);

  return (
    <div className="legal-page-wrapper">
      <Section variant="dark" padding="md" className="legal-header-section">
        <Container size="md">
          {/* Breadcrumb */}
          <nav className="legal-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="legal-breadcrumb-link">
              Home
            </Link>
            <ChevronRight size={14} className="legal-breadcrumb-separator" />
            <span className="legal-breadcrumb-current">{document.title}</span>
          </nav>

          <div style={{ marginTop: '1.25rem', marginBottom: '0.75rem' }}>
            <Badge variant="romantic" size="sm" icon={<Shield size={14} />}>
              Dobatoo Official Guidelines
            </Badge>
          </div>

          <Heading as="h1" fontFamily="sans" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>
            {document.title}
          </Heading>

          <div className="legal-meta-row">
            <span className="legal-meta-item">
              <Calendar size={14} />
              <span>Last Updated: {document.lastUpdated}</span>
            </span>
            <span className="legal-meta-item">
              <FileText size={14} />
              <span>Dobatoo Official Legal Terms</span>
            </span>
          </div>
        </Container>
      </Section>

      <Section variant="dark" padding="lg" className="legal-content-section">
        <Container size="md">
          <div className="legal-content-container">
            {/* Introductory Card */}
            <Card variant="glass" glow style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <p className="legal-intro-text">{document.introduction}</p>
            </Card>

            {/* Document Sections */}
            <div className="legal-sections-stack">
              {document.sections.map((sec) => (
                <Card key={sec.id} variant="glass" className="legal-section-card" id={sec.id}>
                  <Heading as="h2" fontFamily="sans" className="legal-section-heading">
                    {sec.title}
                  </Heading>

                  <div className="legal-section-body">
                    {sec.content.map((p, idx) => (
                      <p key={idx} className="legal-paragraph">
                        {p}
                      </p>
                    ))}

                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="legal-bullet-list">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="legal-bullet-item">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Bottom Support Banner */}
            <Card variant="elevated" className="legal-support-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="legal-support-icon">
                  <Mail size={24} color="#F472B6" />
                </div>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dobato-white)', margin: 0 }}>
                    Have questions about {document.title}?
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--dobato-muted)', margin: '0.25rem 0 0 0' }}>
                    Contact our official team at <strong>support@dobatoo.app</strong> or visit the Dobatoo Grand Launch help desk.
                  </p>
                </div>
                <Link to="/#about" className="dobato-btn dobato-btn-secondary dobato-btn-sm">
                  Contact Support
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
};
