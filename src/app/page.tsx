'use client';

import { useState } from 'react';
import { Shield, Lock, FileText, ChevronRight, BarChart3, Database, Mail, Phone, MapPin } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function LandingPage() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* Navbar - Muted Palette */}
      <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-lg"><Shield className="h-6 w-6 text-white" /></div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">e-Malkhana</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-indigo-700 transition">About System</a>
            <a href="#features" className="hover:text-indigo-700 transition">Modules</a>
            <a href="#contact" className="hover:text-indigo-700 transition">Help Desk</a>
          </div>
          <button onClick={() => setAuthModalOpen(true)} className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-700 transition shadow-sm">
            Officer Login
          </button>
        </div>
      </nav>

      {/* Hero Section - Cleaner Look */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Official Portal
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Secure Evidence Management <br />
            <span className="text-indigo-700">Digital & Transparent.</span>
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            A state-of-the-art digital solution replacing physical registers. 
            Track Chain of Custody, automate disposal, and ensure complete accountability.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setAuthModalOpen(true)} className="px-8 py-3.5 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition shadow-lg shadow-indigo-700/20 flex items-center justify-center gap-2">
              Access Dashboard <ChevronRight className="h-4 w-4" />
            </button>
            <a href="#about" className="px-8 py-3.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition flex items-center justify-center">
              System Overview
            </a>
          </div>
        </div>
      </section>

      {/* About Section - Fixed Image */}
      <section id="about" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
             <div className="absolute -inset-2 bg-slate-100 rounded-xl transform rotate-2 transition-transform group-hover:rotate-1"></div>
             {/* Reliable Image Source */}
             <img 
               src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200" 
               alt="Law and Order" 
               className="relative rounded-lg shadow-xl border border-slate-100" 
             />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">About the Initiative</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The e-Malkhana project is a digital transformation initiative designed to modernize police evidence rooms. 
              By moving away from paper-based logs, we eliminate data redundancy, prevent evidence tampering, and speed up court proceedings.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
               <div className="border-l-4 border-indigo-600 pl-4">
                  <h4 className="font-bold text-slate-900">Zero Tampering</h4>
                  <p className="text-sm text-slate-500 mt-1">Immutable digital logs track every movement.</p>
               </div>
               <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-bold text-slate-900">Fast Retrieval</h4>
                  <p className="text-sm text-slate-500 mt-1">QR Code scanning for instant identification.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Muted Colors */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Core Modules</h2>
            <p className="text-slate-500 mt-4">Designed for operational efficiency and legal compliance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={Database} title="Central Database" desc="Secure, cloud-based storage for all case property data." />
            <FeatureCard icon={BarChart3} title="Audit Analytics" desc="Real-time insights into pending and disposed cases." />
            <FeatureCard icon={FileText} title="Automated Reports" desc="Generate printable PDFs for court submissions instantly." />
          </div>
        </div>
      </section>

      {/* NEW: Footer Section with Contact Info */}
      <footer id="contact" className="bg-slate-900 text-slate-300 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
               <Shield className="h-8 w-8 text-white" />
               <span className="text-xl font-bold text-white">e-Malkhana</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Official Digital Evidence Management System built for modern policing. 
              Secure, transparent, and efficient.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Contact Support</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-indigo-400" /> +91 1800-111-2222</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-indigo-400" /> support@emalkhana.gov.in</li>
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-indigo-400" /> IT Cell, Police HQ, New Delhi</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white">Officer Guidelines</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 e-Malkhana System. Govt of India. All rights reserved.
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
        <Icon className="h-6 w-6 text-slate-600 group-hover:text-indigo-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}