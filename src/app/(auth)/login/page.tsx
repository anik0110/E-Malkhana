'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      username: form.username,
      password: form.password,
    });

    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">e-Malkhana</h1>
          <p className="text-slate-500 mt-2">Police Evidence Management System</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your ID"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Secure Login
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          Authorized Personnel Only. Access is monitored.
        </p>
      </div>
    </div>
  );
}