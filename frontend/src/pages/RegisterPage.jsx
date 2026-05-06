import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Form';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-amber/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-plum/8 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-ink-800/80 border border-ink-500/60 rounded-2xl p-8 lg:p-10 backdrop-blur-sm animate-fade-up">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber to-amber-deep flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-5 h-5">
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
          <span className="font-display text-xl tracking-tight">Meridian</span>
        </div>

        <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-amber mb-3">
          §02 · New Account
        </div>
        <h1 className="font-display text-3xl tracking-tight mb-2">Create your account</h1>
        <p className="text-sm text-ink-200 mb-8">Begin your administrative journey.</p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Jane Doe"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="you@company.com"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
            placeholder="At least 6 characters"
          />
          <Button type="submit" loading={loading} size="lg" className="mt-2">
            Create account →
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-ink-500/40 text-center">
          <p className="text-xs text-ink-200">
            Already have an account?{' '}
            <Link to="/login" className="text-amber hover:text-amber-glow font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
