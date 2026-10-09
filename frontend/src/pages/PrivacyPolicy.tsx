import React from 'react';
import { LegalPageLayout } from '../components/common/LegalPageLayout/LegalPageLayout';
import { PRIVACY_POLICY } from '../content/legal/legalContent';

export const PrivacyPolicyPage: React.FC = () => {
  return <LegalPageLayout document={PRIVACY_POLICY} />;
};
