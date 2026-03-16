import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-6xl font-bold font-heading text-white mb-4">404</h1>
        <p className="text-xl font-body text-white/80 mb-8">Page not found — take the quiz instead</p>
        <Link 
          to="/quiz" 
          className="px-8 py-4 rounded-xl font-heading font-bold text-white bg-gradient-to-r from-purple-600 to-rose-500 hover:-translate-y-1 transition-transform shadow-[0_8px_32px_rgba(108,71,255,0.4)]"
        >
          Take the Quiz
        </Link>
      </main>
      <Footer />
    </>
  );
}
