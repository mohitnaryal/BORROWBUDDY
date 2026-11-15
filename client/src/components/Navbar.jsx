import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Repeat,
  PlusCircle,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Star,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-navy-800 flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform duration-200 border border-slate-700/30">
              <Repeat className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                Borrow<span className="text-emerald-600">Buddy</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-wider uppercase text-slate-400 -mt-1">
                Borrow More. Buy Less.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              to="/explore"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                isActive('/explore')
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Explore Items
            </Link>
            <a
              href="/#how-it-works"
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-slate-900 hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="/#community"
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-slate-900 hover:bg-slate-50"
            >
              Community
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/items/add"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm hover:shadow-md hover:shadow-emerald-600/20 transition-all duration-200 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List Item</span>
                </Link>

                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                    location.pathname.startsWith('/dashboard')
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Dashboard</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all focus:outline-none"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-100"
                    />
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      onMouseLeave={() => setDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                          <span className="flex items-center text-amber-500 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                            {user?.rating || '5.0'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">{user?.city}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          User Dashboard
                        </Link>
                        <Link
                          to={`/users/${user?._id}`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Public Profile
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  Join Community
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/items/add"
                className="p-2 rounded-xl bg-emerald-600 text-white"
                title="List an Item"
              >
                <PlusCircle className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-2">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.city} • ⭐ {user?.rating || '5.0'}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Explore Items
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              How It Works
            </a>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/items/add"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50"
                >
                  + List an Item
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl border border-slate-200 text-slate-800 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl bg-slate-900 text-white font-medium"
                >
                  Join Community
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
