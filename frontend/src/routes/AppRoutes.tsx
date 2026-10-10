import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { AdminLayout } from '../components/admin/AdminLayout';
import { RequireAdminAuth } from '../components/admin/RequireAdminAuth';
import { LoadingSpinner } from '../components/ui/LoadingSpinner/LoadingSpinner';

// Public Pages
const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })));
const EventPage = lazy(() => import('../pages/Event').then((m) => ({ default: m.EventPage })));
const PoetryPage = lazy(() => import('../pages/Poetry').then((m) => ({ default: m.PoetryPage })));
const RegisterPage = lazy(() => import('../pages/Register').then((m) => ({ default: m.RegisterPage })));
const ThankYouPage = lazy(() => import('../pages/ThankYou').then((m) => ({ default: m.ThankYouPage })));
const VerifyPage = lazy(() => import('../pages/Verify').then((m) => ({ default: m.VerifyPage })));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsAndConditionsPage = lazy(() => import('../pages/TermsAndConditions').then((m) => ({ default: m.TermsAndConditionsPage })));
const CommunityGuidelinesPage = lazy(() => import('../pages/CommunityGuidelines').then((m) => ({ default: m.CommunityGuidelinesPage })));
const NotFoundPage = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFoundPage })));

// Admin Core Pages
const AdminLoginPage = lazy(() =>
  import('../pages/admin/AdminLogin').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import('../pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminRegistrationsPage = lazy(() =>
  import('../pages/admin/AdminRegistrations').then((m) => ({ default: m.AdminRegistrationsPage }))
);
const AdminRegistrationDetailPage = lazy(() =>
  import('../pages/admin/AdminRegistrationDetail').then((m) => ({ default: m.AdminRegistrationDetailPage }))
);
const AdminJudgesPage = lazy(() =>
  import('../pages/admin/AdminJudges').then((m) => ({ default: m.AdminJudgesPage }))
);
const AdminUsersPage = lazy(() =>
  import('../pages/admin/AdminUsers').then((m) => ({ default: m.AdminUsersPage }))
);
const AdminSettingsPage = lazy(() =>
  import('../pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettingsPage }))
);

// Poetry Judging Pages
const AdminPoetryDashboardPage = lazy(() =>
  import('../pages/admin/AdminPoetryDashboard').then((m) => ({ default: m.AdminPoetryDashboardPage }))
);
const AdminPoetryDetailPage = lazy(() =>
  import('../pages/admin/AdminPoetryDetail').then((m) => ({ default: m.AdminPoetryDetailPage }))
);
const AdminPoetryCriteriaPage = lazy(() =>
  import('../pages/admin/AdminPoetryCriteria').then((m) => ({ default: m.AdminPoetryCriteriaPage }))
);
const AdminPoetryScoringPage = lazy(() =>
  import('../pages/admin/AdminPoetryScoring').then((m) => ({ default: m.AdminPoetryScoringPage }))
);
const AdminPoetryResultsPage = lazy(() =>
  import('../pages/admin/AdminPoetryResults').then((m) => ({ default: m.AdminPoetryResultsPage }))
);
const AdminPoetryWinnersPage = lazy(() =>
  import('../pages/admin/AdminPoetryWinners').then((m) => ({ default: m.AdminPoetryWinnersPage }))
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner size="lg" label="Loading Dobatoo..." />
        </div>
      }
    >
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="event" element={<EventPage />} />
          <Route path="poetry" element={<PoetryPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="thank-you" element={<ThankYouPage />} />
          <Route path="verify" element={<VerifyPage />} />
          
          {/* Legal & Community Pages */}
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="community-guidelines" element={<CommunityGuidelinesPage />} />
          
          {/* Aliases / Short routes */}
          <Route path="privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="terms" element={<Navigate to="/terms-and-conditions" replace />} />
          <Route path="guidelines" element={<Navigate to="/community-guidelines" replace />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAdminAuth>
              <AdminLayout />
            </RequireAdminAuth>
          }
        >
          {/* 1. Dashboard */}
          <Route index element={<AdminDashboardPage />} />

          {/* 2. Registrations */}
          <Route path="registrations" element={<AdminRegistrationsPage />} />
          <Route path="registrations/:id" element={<AdminRegistrationDetailPage />} />

          {/* 3. Poetry */}
          <Route path="poetry" element={<AdminPoetryDashboardPage />} />
          <Route path="poetry/:id" element={<AdminPoetryDetailPage />} />
          <Route path="poetry/judges" element={<Navigate to="/admin/judges" replace />} />
          <Route path="poetry/criteria" element={<AdminPoetryCriteriaPage />} />
          <Route path="poetry/scoring" element={<AdminPoetryScoringPage />} />
          <Route path="poetry/results" element={<AdminPoetryResultsPage />} />
          <Route path="poetry/winners" element={<AdminPoetryWinnersPage />} />

          {/* 4. Judges */}
          <Route path="judges" element={<AdminJudgesPage />} />

          {/* 5. Admin Users */}
          <Route path="users" element={<AdminUsersPage />} />

          {/* 6. Settings */}
          <Route path="settings" element={<AdminSettingsPage />} />

          {/* Deprecated route redirects to ensure no broken links */}
          <Route path="check-in" element={<Navigate to="/admin/registrations" replace />} />
          <Route path="communications/*" element={<Navigate to="/admin" replace />} />
          <Route path="referrals" element={<Navigate to="/admin" replace />} />
          <Route path="analytics" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
