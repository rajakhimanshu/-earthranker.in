import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home        from './pages/Home';
import Quiz        from './pages/Quiz';
import Result      from './pages/Result';
import Compare     from './pages/Compare';
import Leaderboard from './pages/Leaderboard';
import About       from './pages/About';
import NotFound    from './pages/NotFound';
import AdminPanel  from './pages/AdminPanel';
import Contact     from './pages/Contact';
import FAQ         from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms       from './pages/Terms';
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

        {/* z-index: 9999 — install prompt & modals, above everything */}
        <InstallPrompt />
      </BrowserRouter>
    </LanguageProvider>
  );
}
