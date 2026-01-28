
import React, { useState } from 'react';
import { ArrowLeft, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (user: string, pass: string) => boolean;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-md">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Login</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Plaxonic Systems</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Username</label>
              <div className="relative">
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-semibold text-slate-700 pl-14"
                  placeholder="Enter username"
                />
                <User className="w-5 h-5 text-slate-300 absolute left-5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-semibold text-slate-700 pl-14"
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 text-slate-300 absolute left-5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold text-center animate-in slide-in-from-top-2 duration-200">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#1d4ed8] hover:bg-blue-700 text-white font-black py-5 rounded-2xl text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-10 text-center">
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Demo Credentials</span>
            <div className="mt-2 flex justify-center gap-4 text-xs font-bold text-slate-400">
               <span>U: <span className="text-slate-600">Admin</span></span>
               <span>P: <span className="text-slate-600">12345</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
