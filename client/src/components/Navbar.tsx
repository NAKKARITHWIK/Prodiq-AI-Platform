import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, User as UserIcon, ShieldCheck, Bookmark, Heart, History, BarChart2, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="p-2 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-black tracking-tight text-white">ProdIQ</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.1
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">AI Product Intelligence Platform</span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 border border-slate-800/80 p-1.5 rounded-2xl text-xs">
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                location.pathname === '/dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Catalog
            </Link>
            <Link
              to="/wishlist"
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                location.pathname === '/wishlist' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Wishlist</span>
            </Link>
            <Link
              to="/history"
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                location.pathname === '/history' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>AI History</span>
            </Link>
            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  location.pathname === '/admin' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                <BarChart2 className="h-3.5 w-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </nav>
        )}

        {/* Right User Actions */}
        {user && (
          <div className="flex items-center space-x-3">
            <Link
              to="/reports"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
            >
              <Bookmark className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Saved Reports</span>
            </Link>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="h-7 w-7 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center">
                <UserIcon className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
