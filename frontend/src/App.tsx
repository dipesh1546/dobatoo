import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/common/ErrorBoundary/ErrorBoundary';
import { OfflineBanner } from './components/common/OfflineBanner/OfflineBanner';
import { CookieConsent } from './components/common/CookieConsent/CookieConsent';
import { ScrollToTop } from './components/common/ScrollToTop/ScrollToTop';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <OfflineBanner />
        <AppRoutes />
        <CookieConsent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
