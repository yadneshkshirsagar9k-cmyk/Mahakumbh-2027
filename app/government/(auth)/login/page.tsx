'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { governmentAuthService } from '@/services/auth/GovernmentAuthService';

export default function GovernmentLogin() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await governmentAuthService.login(employeeId, password);
    if (success) {
      router.push('/government/dashboard');
    } else {
      setError('Invalid credentials or unauthorized access.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <div className="p-3 bg-red-900/50 text-red-400 rounded text-sm border border-red-800/50">{error}</div>}
      
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Official Employee ID</label>
        <input 
          type="text" 
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Secure Password</label>
        <input 
          type="password" 
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors mt-4">
        Authenticate Session
      </button>

      <div className="text-center mt-6">
        <a href="/government/register" className="text-sm text-blue-400 hover:text-blue-300">Request Official Access</a>
      </div>
    </form>
  );
}
