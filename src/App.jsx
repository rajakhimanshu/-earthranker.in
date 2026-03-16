import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home        from './pages/Home';
import Quiz        from './pages/Quiz';
import Result      from './pages/Result';
import Compare     from './pages/Compare';
import Leaderboard from './pages/Leaderboard';
import About       from './pages/About';
import NotFound    from './pages/NotFound';
import InstallPrompt from './components/InstallPrompt';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageToggle from './components/LanguageToggle';

export default function App() {
  return (
    <LanguageProvider>
      <div className="mesh-background" aria-hidden="true" />
      <BrowserRouter>
        <LanguageToggle />
        <Routes>
          <Route path="/"            element={<Home />}        />
          <Route path="/quiz"        element={<Quiz />}        />
          <Route path="/result"      element={<Result />}      />
          <Route path="/compare"     element={<Compare />}     />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about"       element={<About />}       />
          <Route path="*"            element={<NotFound />}    />
        </Routes>
        <InstallPrompt />
      </BrowserRouter>
    </LanguageProvider>
  );
}
