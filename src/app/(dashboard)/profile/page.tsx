

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { BadgeCheck, Camera, Loader2, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, update }: any = useSession();
  const [uploading, setUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState(session?.user?.image || '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      
      if (uploadData.secure_url) {
        const newImageUrl = uploadData.secure_url;
        await fetch('/api/user/update', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: newImageUrl })
        });
        setImgUrl(newImageUrl);
        await update({ ...session, user: { ...session?.user, image: newImageUrl } });
        alert("Profile picture saved!");
      }
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero Banner */}
      <div className="h-32 md:h-48 bg-slate-900 w-full relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-100/10 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-50 px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Profile Card */}
          <div className="relative -mt-16 md:-mt-20 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              
              {/* Profile Picture */}
              <div className="relative group shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-white shadow-lg">
                  <div className="w-full h-full rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-4xl md:text-5xl font-bold text-white relative">
                    {imgUrl ? (
                      <img src={imgUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{session?.user?.name?.[0]}</span>
                    )}
                  </div>
                </div>

                <label className="absolute bottom-1 right-1 bg-slate-900 text-white p-2.5 rounded-full cursor-pointer hover:bg-indigo-600 transition shadow-lg border-4 border-white flex items-center justify-center">
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                </label>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left space-y-3 pt-2 md:pt-4">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">{session?.user?.name}</h1>
                  <p className="text-base md:text-lg text-slate-500 font-medium">Investigating Officer (IO)</p>
                </div>

                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-sm text-sm md:text-base">
                    <BadgeCheck className="h-4 w-4 md:h-5 md:w-5" />
                    {session?.user?.badgeId || 'ID-PENDING'}
                  </span>
                </div>
              </div>

              {/* Contact Info Box */}
              <div className="w-full md:w-auto bg-slate-50 rounded-xl p-5 md:p-6 border border-slate-100 min-w-[280px]">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Official Contact</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 font-medium">Email Address</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{session?.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Current Status</p>
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Duty
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}