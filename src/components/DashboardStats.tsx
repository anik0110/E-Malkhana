'use client';
import { Package, CheckCircle, Clock } from 'lucide-react';

export default function DashboardStats({ stats }: any) {
  const StatCard = ({ title, count, icon: Icon, gradient }: any) => (
    <div className={`relative overflow-hidden p-6 rounded-2xl shadow-lg text-white ${gradient} transition-transform hover:-translate-y-1`}>
      <div className="absolute right-0 top-0 opacity-10 p-4 transform translate-x-2 -translate-y-2">
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="p-3 bg-white/20 w-fit rounded-lg backdrop-blur-sm mb-4">
            <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-4xl font-bold mb-1">{count}</h3>
        <p className="text-sm font-medium opacity-90 uppercase tracking-wide">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="Total Cases" 
        count={stats.totalCases} 
        icon={Package} 
        gradient="bg-gradient-to-br from-blue-500 to-blue-700" 
      />
      <StatCard 
        title="Pending Items" 
        count={stats.pendingCases} 
        icon={Clock} 
        gradient="bg-gradient-to-br from-orange-400 to-red-500" 
      />
      <StatCard 
        title="Disposed Cases" 
        count={stats.disposedCases} 
        icon={CheckCircle} 
        gradient="bg-gradient-to-br from-emerald-400 to-teal-600" 
      />
    </div>
  );
}