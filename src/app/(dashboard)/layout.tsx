

'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      
      <div className="md:ml-64 transition-all duration-200">
        
        
        <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
           <div className="font-bold text-slate-800 text-lg">e-Malkhana</div>
           <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
             <Menu className="h-6 w-6" />
           </button>
        </div>

        
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}