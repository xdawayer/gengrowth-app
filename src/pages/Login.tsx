import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);
  const { mockLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd use supabase.auth.signInWithPassword
    // For this preview, we'll use mockLogin
    mockLogin();
    navigate('/en/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">GenGrowth Growth OS</h1>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Enterprise Growth Engine</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Welcome back</h2>
          <p className="text-sm text-zinc-500">Sign in to manage your growth portfolios and automated strategies.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email address"
                  className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-0 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all"
                  required
                />
              </div>

              {!isMagicLink && (
                <div className="relative group">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-0 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsMagicLink(!isMagicLink)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
              >
                {isMagicLink ? 'Use Password' : 'Use Magic Link'}
              </button>
              <a href="#" className="text-xs font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <LogIn size={18} />
              {isMagicLink ? 'SEND MAGIC LINK' : 'SIGN IN TO DASHBOARD'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-100">
            <div className="flex items-center gap-2 text-zinc-400 mb-4">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Security Enabled</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              GenGrowth uses industry-standard encryption and security protocols to protect your data. 
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
