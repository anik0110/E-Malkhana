'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, Key, ArrowRight, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AuthModalProps { isOpen: boolean; onClose: () => void; }
type AuthView = 'login' | 'signup' | 'forgot';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form States
  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false); // For Forgot Password flow

  if (!isOpen) return null;

  const resetState = () => { setError(''); setSuccess(''); setLoading(false); };

  // --- HANDLERS ---
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState(); setLoading(true);
    const res = await signIn('credentials', { redirect: false, username: formData.email, password: formData.password });
    if (res?.error) setError('Invalid credentials.');
    else { onClose(); router.push('/dashboard'); }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState(); setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST', body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
    });
    const data = await res.json();
    if (res.ok) { setSuccess('Account created! Please login.'); setTimeout(() => setView('login'), 2000); }
    else setError(data.error);
    setLoading(false);
  };

  const handleForgotPass = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState(); setLoading(true);
    
    // Step 1: Send OTP
    if (!otpSent) {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST', body: JSON.stringify({ action: 'SEND_OTP', email: formData.email })
      });
      if (res.ok) { setOtpSent(true); setSuccess('OTP Sent! Check console/email.'); }
      else setError('Email not found.');
    } 
    // Step 2: Verify & Reset
    else {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST', body: JSON.stringify({ 
          action: 'RESET_PASSWORD', email: formData.email, otp: formData.otp, newPassword: formData.password 
        })
      });
      if (res.ok) { setSuccess('Password Reset! Login now.'); setTimeout(() => setView('login'), 2000); }
      else setError('Invalid OTP.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>

        <div className="p-8 pb-0 text-center">
          <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-indigo-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            {view === 'login' ? 'Officer Login' : view === 'signup' ? 'New Registration' : 'Reset Password'}
          </h2>
          <p className="text-sm text-slate-500 mt-2">Secure Evidence Management Portal</p>
        </div>

        {error && <div className="mx-8 mt-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}
        {success && <div className="mx-8 mt-6 p-3 bg-green-50 text-green-600 text-sm rounded-lg text-center">{success}</div>}

        <div className="p-8">
          {/* LOGIN FORM */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input icon={Mail} type="email" placeholder="Official Email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
              <Input icon={Lock} type="password" placeholder="Password" value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} />
              <div className="text-right"><button type="button" onClick={() => { setView('forgot'); setOtpSent(false); resetState(); }} className="text-xs text-indigo-700 hover:underline">Forgot Password?</button></div>
              <Button loading={loading}>Access Portal</Button>
              <p className="text-center text-xs text-slate-500 mt-4">New User? <span onClick={() => setView('signup')} className="text-indigo-700 font-bold cursor-pointer hover:underline">Register Here</span></p>
            </form>
          )}

          {/* SIGNUP FORM */}
          {view === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <Input icon={User} placeholder="Full Name" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
              <Input icon={Mail} type="email" placeholder="Official Email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
              <Input icon={Lock} type="password" placeholder="Create Password" value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} />
              <Button loading={loading}>Create Account</Button>
              <p className="text-center text-xs text-slate-500 mt-4">Has account? <span onClick={() => setView('login')} className="text-indigo-700 font-bold cursor-pointer hover:underline">Login</span></p>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPass} className="space-y-4">
              <Input icon={Mail} type="email" placeholder="Enter Registered Email" disabled={otpSent} value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
              {otpSent && (
                <>
                  <Input icon={Key} placeholder="Enter 6-digit OTP" value={formData.otp} onChange={(e: any) => setFormData({...formData, otp: e.target.value})} />
                  <Input icon={Lock} type="password" placeholder="New Password" value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} />
                </>
              )}
              <Button loading={loading}>{otpSent ? 'Reset Password' : 'Send Verification OTP'}</Button>
              <button type="button" onClick={() => setView('login')} className="w-full text-center text-xs text-slate-500 hover:text-slate-800 mt-2">Back to Login</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// UI Helpers
const Input = ({ icon: Icon, ...props }: any) => (
  <div className="relative group">
    <Icon className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
    <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-slate-700" required {...props} />
  </div>
);
const Button = ({ children, loading }: any) => (
  <button disabled={loading} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-70">
    {loading && <Loader2 className="h-4 w-4 animate-spin" />} {children} {!loading && <ArrowRight className="h-4 w-4" />}
  </button>
);