import React from 'react';
import { User, UserRole } from '../types';
import {
  LogOut,
  HeartHandshake,
  LogIn,
} from 'lucide-react';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick?: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  user,
  onLogout,
  onLoginClick,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => !user && onLogout()}
            >
              <HeartHandshake className="h-8 w-8 text-emerald-300 mr-2" />
              <span className="text-2xl font-bold tracking-tight">
                UniAid
              </span>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-sm font-semibold">
                    {user.name}
                  </span>
                  <span className="text-xs text-emerald-200 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>

                {user.role === UserRole.DONOR && (
                  <div className="bg-emerald-800 px-3 py-1 rounded-full text-sm border border-emerald-600">
                    Wallet: $
                    {user.walletBalance.toLocaleString()}
                  </div>
                )}

                <button
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-800 focus:ring-white"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center mb-4">
              <HeartHandshake className="h-6 w-6 text-emerald-600 mr-2" />
              <span className="text-lg font-bold text-slate-800">
                UniAid
              </span>
            </div>
            <p className="text-slate-500">
              Empowering the next generation through secure,
              transparent, and community-driven
              crowdfunding.
            </p>
            <p className="text-slate-500 mt-4">
              Design & Developed By : <b>Sirish Titaju</b>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600"
                >
                  Trust & Safety
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600"
                >
                  Fundraiser Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
          &copy; {new Date().getFullYear()} UniAid Platform.
          All rights reserved.
        </div>
      </footer>
    </div>
  );
};
