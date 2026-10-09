import React from 'react';
import { LegalPageLayout } from '../components/common/LegalPageLayout/LegalPageLayout';
import { TERMS_AND_CONDITIONS } from '../content/legal/legalContent';

export const TermsAndConditionsPage: React.FC = () => {
  return <LegalPageLayout document={TERMS_AND_CONDITIONS} />;
};
