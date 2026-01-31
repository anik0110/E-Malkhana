

'use client';

import { useEffect, useState } from 'react';
import { Package, CheckCircle, Clock, Search, ArrowUpRight, ShieldAlert, Activity } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardHome() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ totalCases: 0, disposedCases: 0, pendingCases: 0 });
  
  useEffect(() => {
    fetch('/api/dashboard').then(res => res.json()).then(setStats);
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, <span className="font-semibold text-indigo-700">{session?.user?.name || 'Officer'}</span></p>
        </div>
        <div className="hidden md:block text-sm text-slate-500 font-medium bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard title="Total Evidence" count={stats.totalCases} icon={Package} color="blue" />
        <StatCard title="Pending Review" count={stats.pendingCases} icon={Clock} color="orange" />
        <StatCard title="Disposed Items" count={stats.disposedCases} icon={CheckCircle} color="emerald" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Quick Actions Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600"/> Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionCard href="/cases/create" title="Register New Case" desc="Add seizure details & generate QR" />
            <ActionCard href="/cases" title="Search Records" desc="Find evidence by Case ID or Name" />
            
          </div>
        </div>

        {/* System Status Panel */}
        <div className="bg-slate-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold mb-6 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-emerald-400"/> System Health
            </h3>
            <div className="space-y-6">
               <div className="flex justify-between text-sm items-center border-b border-white/10 pb-3">
                 <span className="text-slate-400">Database</span>
                 <span className="text-emerald-400 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Connected</span>
               </div>
               <div className="flex justify-between text-sm items-center border-b border-white/10 pb-3">
                 <span className="text-slate-400">Server Status</span>
                 <span className="text-emerald-400 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> 99.9% Uptime</span>
               </div>
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-400">Last Sync</span>
                 <span className="text-white font-mono opacity-80">Just now</span>
               </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-500 mb-2">STORAGE USAGE</p>
                <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>35% Used</span>
                    <span>500GB Total</span>
                </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ title, count, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };
  return (
    <div className={`p-6 rounded-2xl border ${colors[color].split(' ')[2]} bg-white shadow-sm flex items-center justify-between`}>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{count}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

function ActionCard({ href, title, desc }: any) {
  return (
    <Link href={href} className="group p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-800 group-hover:text-indigo-700">{title}</h4>
        <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
      </div>
      <p className="text-xs text-slate-500 line-clamp-2">{desc}</p>
    </Link>
  );
}