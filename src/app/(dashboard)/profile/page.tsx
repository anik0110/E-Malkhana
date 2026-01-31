'use client';

import { useSession } from 'next-auth/react';
import { User, Mail, Shield, BadgeCheck, MapPin, Hash } from 'lucide-react';

export default function ProfilePage() {
  const { data: session }: any = useSession(); // Access extended session

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Officer Profile</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* ID Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="h-32 bg-slate-900 flex items-center justify-center relative">
               <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-blue-600 to-slate-900"></div>
            </div>
            
            <div className="relative px-6 -mt-12 text-center pb-6">
              <div className="w-24 h-24 mx-auto bg-white p-1 rounded-full shadow-lg">
                <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {session?.user?.name?.[0] || 'O'}
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{session?.user?.name}</h2>
              
              {/* DISPLAY BADGE ID HERE */}
              <div className="mt-2 inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded text-sm font-mono font-bold text-slate-600">
                <Hash className="h-3 w-3" /> {session?.user?.badgeId || "N/A"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Details */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Shield className="text-blue-600 h-5 w-5" /> Official Information
            </h3>
            <div className="space-y-4">
                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <Mail className="text-blue-600 h-5 w-5" />
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Official Email</p>
                        <p className="font-semibold text-slate-800">{session?.user?.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <BadgeCheck className="text-blue-600 h-5 w-5" />
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Officer Badge ID</p>
                        <p className="font-semibold text-slate-800">{session?.user?.badgeId}</p>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}