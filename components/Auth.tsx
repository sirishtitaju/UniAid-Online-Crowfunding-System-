import React, { useState } from 'react';
import { UserRole } from '../types';
import { mockService } from '../services/mockService';
import { User, Lock, Mail, UserPlus, LogIn, Shield, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (user: any) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.DONOR,
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const user = mockService.login(formData.email, formData.password);
        if (user) {
          onLoginSuccess(user);
        } else {
          setError('Invalid credentials');
        }
      } else {
        const user = mockService.register(formData.name, formData.email, formData.password, formData.role);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDemoLogin = (email: string) => {
      try {
        const user = mockService.login(email, 'password');
        if (user) onLoginSuccess(user);
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden md:max-w-2xl m-4 border border-slate-100 relative">
        <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-colors"
            title="Back to Home"
        >
            <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="md:flex">
            <div className="p-8 w-full">
                <div className="text-center mb-6 pt-6">
                    <h2 className="text-3xl font-bold text-slate-800">{isLogin ? 'Welcome Back' : 'Join UniAid'}</h2>
                    <p className="text-slate-500 mt-2">
                        {isLogin ? 'Sign in to your account' : 'Create an account to verify campaigns or donate'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                             <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 block">I am a:</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, role: UserRole.DONOR})}
                                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${formData.role === UserRole.DONOR ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Donor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, role: UserRole.FUNDRAISER})}
                                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${formData.role === UserRole.FUNDRAISER ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Fundraiser
                                </button>
                            </div>
                        </div>
                    )}

                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {isLogin ? <LogIn className="h-5 w-5"/> : <UserPlus className="h-5 w-5"/>}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium hover:underline"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>

                {/* Demo Shortcuts */}
                {isLogin && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 text-center mb-3 uppercase tracking-wider">Demo Access (One-Click Login)</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => handleDemoLogin('admin@uniaid.com')}
                                className="flex flex-col items-center justify-center p-2 rounded border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group"
                            >
                                <Shield className="h-4 w-4 text-slate-400 group-hover:text-purple-600 mb-1" />
                                <span className="text-xs text-slate-600 font-medium">Admin</span>
                            </button>
                             <button
                                onClick={() => handleDemoLogin('john@fund.com')}
                                className="flex flex-col items-center justify-center p-2 rounded border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group"
                            >
                                <User className="h-4 w-4 text-slate-400 group-hover:text-orange-600 mb-1" />
                                <span className="text-xs text-slate-600 font-medium">Fundraiser</span>
                            </button>
                             <button
                                onClick={() => handleDemoLogin('alice@donate.com')}
                                className="flex flex-col items-center justify-center p-2 rounded border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group"
                            >
                                <User className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 mb-1" />
                                <span className="text-xs text-slate-600 font-medium">Donor</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};