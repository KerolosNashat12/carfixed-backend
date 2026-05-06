import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Form';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 text-ink-50 flex flex-col lg:flex-row">
      {/* Left — editorial hero */}
      <div className="lg:w-1/2 relative overflow-hidden bg-ink-800 border-r border-ink-500/40 flex flex-col justify-between p-8 lg:p-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-amber/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-plum/8 blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber to-amber-deep flex items-center justify-center shadow-lg shadow-amber/20">
            <svg viewBox="0 0 32 32" className="w-6 h-6">
              <path
                d="M8 22L12 10L16 18L20 10L24 22"
                stroke="#0a0e14"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="font-display text-2xl tracking-tight">Meridian</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-amber mb-6">
            Issue №01 · MMXXVI
          </div>
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl tracking-tight leading-[1.05] text-balance">
            The administrative <em className="text-amber not-italic">interface</em> for modern software businesses.
          </h2>
          <p className="mt-6 text-ink-200 text-base leading-relaxed max-w-md text-balance">
            Customer accounts, recurring revenue, transactional ledger, and operational telemetry — assembled in a single calm surface.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-6 border-t border-ink-500/40">
            <div>
              <div className="text-2xl font-display tabular text-ink-50">99.99%</div>
              <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300 mt-1">
                Uptime
              </div>
            </div>
            <div>
              <div className="text-2xl font-display tabular text-ink-50">SOC 2</div>
              <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300 mt-1">
                Compliant
              </div>
            </div>
            <div>
              <div className="text-2xl font-display tabular text-ink-50">24/7</div>
              <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300 mt-1">
                Support
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] uppercase tracking-widest font-mono text-ink-300">
          © {new Date().getFullYear()} Meridian Systems · All rights reserved
        </div>
      </div>

      {/* Right — login form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-14">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-amber mb-3">
            §01 · Authentication
          </div>
          <h1 className="font-display text-3xl tracking-tight mb-2">Sign in</h1>
          <p className="text-sm text-ink-200 mb-8">
            Continue to your administration console.
          </p>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <Button type="submit" loading={loading} size="lg" className="mt-2">
              Sign in →
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-500/40">
            <p className="text-xs text-ink-200 text-center">
              No account?{' '}
              <Link to="/register" className="text-amber hover:text-amber-glow font-medium">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-ink-700/40 border border-ink-500/40 text-[11px] font-mono">
            <div className="text-amber mb-2 uppercase tracking-widest">Demo credentials</div>
            <div className="space-y-1 text-ink-200">
              <div>admin@example.com / password123</div>
              <div>manager@example.com / password123</div>
              <div>user@example.com / password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
