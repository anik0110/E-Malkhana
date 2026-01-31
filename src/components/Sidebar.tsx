'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FilePlus, Search, UserCircle, LogOut, ShieldAlert } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const NavItem = ({ href, icon: Icon, label }: any) => (
    <Link 
      href={href} 
      className={`relative flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-200 group overflow-hidden ${
        isActive(href) 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
      }`}
    >
      <Icon className={`h-5 w-5 mr-3 transition-transform group-hover:scale-110 ${isActive(href) ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
      <span className="font-medium">{label}</span>
      
      {/* Active Indicator Glow */}
      {isActive(href) && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full blur-sm"></div>
      )}
    </Link>
  );

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800/50 min-h-screen p-6 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[20%] w-64 h-64 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -right-[20%] w-40 h-40 bg-indigo-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20">
          <ShieldAlert className="h-6 w-6 text-white" />
        </div>
        <div>
           <h1 className="text-xl font-bold text-white tracking-tight">e-Malkhana</h1>
           <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Official Portal</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="relative z-10 flex-1 space-y-1">
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/cases/create" icon={FilePlus} label="New Entry" />
        <NavItem href="/cases" icon={Search} label="Search & Manage" />
        <NavItem href="/profile" icon={UserCircle} label="My Profile" />
      </nav>

      {/* Logout */}
      <div className="relative z-10 mt-auto pt-6 border-t border-slate-800/50">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
        >
          <LogOut className="mr-3 h-5 w-5" /> 
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}