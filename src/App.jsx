import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Home        from './pages/Home';
const Quiz        = lazy(() => import('./pages/Quiz'));
const Result      = lazy(() => import('./pages/Result'));
const Compare     = lazy(() => import('./pages/Compare'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const About       = lazy(() => import('./pages/About'));
const NotFound    = lazy(() => import('./pages/NotFound'));
const AdminPanel  = lazy(() => import('./pages/AdminPanel'));
const Contact     = lazy(() => import('./pages/Contact'));
const FAQ         = lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms       = lazy(() => import('./pages/Terms'));
import InstallPrompt from './components/InstallPrompt';
import Navbar      from './components/Navbar';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      {/* z-index: 0 — decorative animated mesh, fixed behind everything */}
      <div className="mesh-background" aria-hidden="true" />

      <BrowserRouter>
        {/* z-index: 50 — sticky navbar, above all page content */}
        <Navbar />

        {/* z-index: 10 — page content */}
        <Suspense fallback={
          <div style={{
            minHeight: '100vh',
            background: '#0a0a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              border: '3px solid rgba(108,71,255,0.2)',
              borderTopColor: '#6C47FF',
              animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        }>
          <div className="page-transition">
            <Routes>
              <Route path="/"            element={<Home />}          />
              <Route path="/quiz"        element={<Quiz />}          />
              <Route path="/result"      element={<Result />}        />
              <Route path="/compare"     element={<Compare />}       />
              <Route path="/leaderboard" element={<Leaderboard />}   />
              <Route path="/about"       element={<About />}         />
              <Route path="/contact"     element={<Contact />}       />
              <Route path="/faq"         element={<FAQ />}           />
              <Route path="/privacy"     element={<PrivacyPolicy />} />
              <Route path="/terms"       element={<Terms />}         />
              <Route path="/admin-er-panel-9x7" element={<AdminPanel />} />
              <Route path="*"            element={<NotFound />}      />
            </Routes>
          </div>
        </Suspense>

        {/* z-index: 9999 — install prompt & modals, above everything */}
        <InstallPrompt />
      </BrowserRouter>
    </LanguageProvider>
  );
}
