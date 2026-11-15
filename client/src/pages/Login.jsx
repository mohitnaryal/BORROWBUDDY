import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Repeat,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DEMO_USERS } from '../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleQuickDemoLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    setEmail(demoEmail);
    setPassword('password123');

    const result = await login(demoEmail, 'password123');
    setLoading(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
          <Repeat className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back to BorrowBuddy
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Sign in to discover, borrow, or lend items within your local community
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@borrowbuddy.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all active:scale-95 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Shelf */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Demo Accounts (Instant Testing)</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickDemoLogin(demo.email)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={demo.avatar}
                      alt={demo.name}
                      className="w-7 h-7 rounded-full object-cover border"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                        {demo.name} ({demo.city})
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {demo.roleLabel}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 opacity-80 group-hover:opacity-100">
                    Sign in →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom link to Register */}
          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-emerald-600 hover:text-emerald-700 underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
