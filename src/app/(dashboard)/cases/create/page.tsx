'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Save, Plus, Trash2, Info } from 'lucide-react';

export default function CreateCase() {
  const router = useRouter();
  const { data: session }: any = useSession();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    stationName: '', 
    ioName: '', 
    ioId: '', // Separate ID field
    crimeNumber: '', 
    crimeYear: new Date().getFullYear().toString(),
    firDate: '', 
    seizureDate: '', 
    actSection: '',
    properties: [{ category: '', description: '', quantity: '', location: '', nature: '', belongingTo: 'Unknown' }]
  });

  // Auto-fill IO details from logged-in session
  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({
        ...prev,
        ioName: session.user.name || '',
        ioId: session.user.badgeId || ''
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Strict Validation happens via 'required' attributes in HTML
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    if (res.ok) router.push('/cases');
    else alert("Failed. Please check all fields.");
    setSubmitting(false);
  };

  const handlePropChange = (index: number, field: string, value: string) => {
    const newProps: any = [...form.properties];
    newProps[index][field] = value;
    setForm({ ...form, properties: newProps });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">New Case Entry</h1>
        <p className="text-slate-500 text-sm">Fill in all mandatory fields to generate the Chain of Custody log.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Officer Details */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-600" /> IO Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Police Station Name" value={form.stationName} onChange={(v: string) => setForm({...form, stationName: v})} />
            <InputField label="Investigating Officer (IO) Name" value={form.ioName} onChange={(v: string) => setForm({...form, ioName: v})} readOnly />
            <InputField label="IO Badge ID (Unique)" value={form.ioId} onChange={(v: string) => setForm({...form, ioId: v})} readOnly />
          </div>
        </div>

        {/* Section 2: Case Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-600" /> Case Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
            <InputField label="Crime Number" placeholder="e.g. 145" value={form.crimeNumber} onChange={(v: string) => setForm({...form, crimeNumber: v})} />
            <InputField label="Year" type="number" value={form.crimeYear} onChange={(v: string) => setForm({...form, crimeYear: v})} />
            <InputField label="FIR Date" type="date" value={form.firDate} onChange={(v: string) => setForm({...form, firDate: v})} />
            <InputField label="Seizure Date" type="date" value={form.seizureDate} onChange={(v: string) => setForm({...form, seizureDate: v})} />
          </div>
          <InputField label="Act & Section of Law" placeholder="e.g. IPC 378, NDPS Act" className="w-full" value={form.actSection} onChange={(v: string) => setForm({...form, actSection: v})} />
        </div>

        {/* Section 3: Properties */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-600" /> Seized Properties
            </h2>
            <button type="button" onClick={() => setForm({...form, properties: [...form.properties, { category: '', description: '', quantity: '', location: '', nature: '', belongingTo: 'Unknown' }]})} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </div>

          {form.properties.map((prop, idx) => (
            <div key={idx} className="bg-slate-50 p-5 rounded-lg border border-slate-200 mb-4 relative">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <InputField label="Category" placeholder="e.g. Electronics, Gold" value={prop.category} onChange={(v: string) => handlePropChange(idx, 'category', v)} />
                 <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-1">Belongs To <span className="text-red-500">*</span></label>
                   <select className="w-full p-2.5 bg-white border border-slate-300 rounded text-sm text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none"
                     value={prop.belongingTo} onChange={e => handlePropChange(idx, 'belongingTo', e.target.value)}>
                     <option value="Unknown">Unknown</option>
                     <option value="Accused">Accused</option>
                     <option value="Complainant">Complainant</option>
                   </select>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <InputField label="Description" placeholder="Color, Model, Serial No" value={prop.description} onChange={(v: string) => handlePropChange(idx, 'description', v)} />
                 <InputField label="Storage Location" placeholder="Rack 4, Locker B" value={prop.location} onChange={(v: string) => handlePropChange(idx, 'location', v)} />
               </div>
               
               {form.properties.length > 1 && (
                 <button type="button" onClick={() => {
                    const newProps = form.properties.filter((_, i) => i !== idx);
                    setForm({ ...form, properties: newProps });
                 }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                   <Trash2 className="h-4 w-4" />
                 </button>
               )}
            </div>
          ))}
        </div>

        <div className="pt-4">
          <button disabled={submitting} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex justify-center items-center gap-2">
            <Save className="h-5 w-5" /> {submitting ? 'Registering...' : 'Register Case & Generate QR'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Helper for cleaner code
const InputField = ({ label, onChange, ...props }: any) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <input 
      required
      className="w-full p-2.5 bg-white border border-slate-300 rounded text-sm text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  </div>
);