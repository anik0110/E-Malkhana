
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, FolderOpen, PlusSquare, 
  User, LogOut, X, Shield 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Manage Entries', href: '/cases', icon: FolderOpen },
    { name: 'New Entry', href: '/cases/create', icon: PlusSquare },
    { name: 'My Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => pathname === path;

  
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">e-Malkhana</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Official Portal</p>
        </div>
        
        <button onClick={onClose} className="md:hidden ml-auto text-slate-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            onClick={onClose} 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
              isActive(link.href) 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <link.icon className={`h-5 w-5 ${isActive(link.href) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            <span className="font-medium text-sm">{link.name}</span>
          </Link>
        ))}
      </nav>

      
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
          
          
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}