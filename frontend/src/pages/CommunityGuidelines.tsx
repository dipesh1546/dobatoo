import React from 'react';
import { LegalPageLayout } from '../components/common/LegalPageLayout/LegalPageLayout';
import { COMMUNITY_GUIDELINES } from '../content/legal/legalContent';

export const CommunityGuidelinesPage: React.FC = () => {
  return <LegalPageLayout document={COMMUNITY_GUIDELINES} />;
};
