import React from 'react';
import { Card } from '../../ui/Card/Card';
import { Badge } from '../../ui/Badge/Badge';
import { Clock, Users, Feather } from 'lucide-react';
import { PERFORMANCE_DURATION, PERFORMANCE_AGE_LIMIT, EVENT_POETRY_THEME } from '../../../constants/brand';
import './PerformanceDetailsCard.css';

interface PerformanceDetailsCardProps {
  className?: string;
  showTypes?: boolean;
}

export const PerformanceDetailsCard: React.FC<PerformanceDetailsCardProps> = ({
  className = '',
  showTypes = true,
}) => {
  return (
    <Card variant="glass" glow className={`performance-details-card ${className}`}>
      <div className="performance-details-header">
        <Badge variant="romantic" size="md" icon={<Feather size={14} />}>
          OFFICIAL PERFORMANCE RULES
        </Badge>
        <h3 className="performance-details-title">
          PERFORMANCE DETAILS
        </h3>
        <p className="performance-details-subtitle">
          Theme: "{EVENT_POETRY_THEME}"
        </p>
      </div>

      <div className="performance-details-grid">
        {/* 1. Duration */}
        <div className="performance-rule-box">
          <div className="performance-rule-icon-wrap">
            <Clock size={24} color="#F472B6" />
          </div>
          <div className="performance-rule-content">
            <span className="performance-rule-label">⏱ Performance Duration</span>
            <div className="performance-rule-value">{PERFORMANCE_DURATION}</div>
            <p className="performance-rule-hint">Each participant will have 5 minutes to perform on stage.</p>
          </div>
        </div>

        {/* 2. Age Limit */}
        <div className="performance-rule-box">
          <div className="performance-rule-icon-wrap">
            <Users size={24} color="#D946EF" />
          </div>
          <div className="performance-rule-content">
            <span className="performance-rule-label">🎭 Age Limit</span>
            <div className="performance-rule-value">{PERFORMANCE_AGE_LIMIT}</div>
            <p className="performance-rule-hint">Participants and performers of all ages are welcome to join.</p>
          </div>
        </div>
      </div>

      {showTypes && (
        <div className="performance-types-row">
          <span className="performance-types-label">Confirmed Performance Types:</span>
          <div className="performance-types-tags">
            <span className="performance-type-tag">Poetry</span>
            <span className="performance-type-tag">Story Telling</span>
            <span className="performance-type-tag">Music</span>
            <span className="performance-type-tag">Other</span>
          </div>
        </div>
      )}
    </Card>
  );
};
