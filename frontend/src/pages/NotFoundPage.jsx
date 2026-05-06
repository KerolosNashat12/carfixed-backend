import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const NotFoundPage = () => (
  <div className="min-h-screen bg-ink-900 flex items-center justify-center p-6">
    <div className="text-center max-w-md">
      <div className="font-display text-9xl tracking-tight text-amber mb-4 tabular">404</div>
      <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-ink-300 mb-6">
        Page not found
      </div>
      <h1 className="font-display text-3xl text-ink-50 mb-3">
        We couldn't locate that page.
      </h1>
      <p className="text-sm text-ink-200 mb-6">
        The page may have been moved, removed, or the address may be incorrect.
      </p>
      <Link to="/">
        <Button>Return to overview</Button>
      </Link>
    </div>
  </div>
);
