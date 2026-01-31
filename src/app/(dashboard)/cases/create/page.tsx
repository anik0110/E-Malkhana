

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Save, Plus, Trash2, Info, CheckCircle, Loader2 } from 'lucide-react';

export default function CreateCase() {
  const router = useRouter();
  const { data: session }: any = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addPropertyNow, setAddPropertyNow] = useState(true);

  const [form, setForm] = useState({
    stationName: '', 
    ioName: '', 
    ioId: '', 
    crimeNumber: '', 
    crimeYear: new Date().getFullYear().toString(),
    firDate: '', 
    seizureDate: '', 
    actSection: '',
    properties: [{ category: '', description: '', quantity: '', location: '', nature: '', belongingTo: 'Unknown', imageUrl: '' }]
  });

  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({ 
        ...prev, 
        ioName: session.user.name || '', 
        ioId: session.user.badgeId || '' 
      }));
    }
  }, [session]);

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        const newProps: any = [...form.properties];
        newProps[index].imageUrl = data.secure_url;
        setForm({ ...form, properties: newProps });
      }
    } catch (err) { alert("Image upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (addPropertyNow) {
        const missingImage = form.properties.some(p => !p.imageUrl);
        if (missingImage) {
            alert("Please upload images for all properties.");
            setSubmitting(false);
            return;
        }
    }
    const payload = { ...form, properties: addPropertyNow ? form.properties : [] };
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) router.push('/cases');
    else alert("Failed to register case.");
    setSubmitting(false);
  };

  const handlePropChange = (index: number, field: string, value: string) => {
    const newProps: any = [...form.properties];
    newProps[index][field] = value;
    setForm({ ...form, properties: newProps });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">New Case Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4">
              <InputField label="Station" value={form.stationName} onChange={(v:any)=>setForm({...form, stationName: v})} />
              <InputField label="IO Name" value={form.ioName} onChange={(v:any)=>setForm({...form, ioName: v})} readOnly />
              <InputField label="IO ID" value={form.ioId} onChange={(v:any)=>setForm({...form, ioId: v})} readOnly />
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4">
              <InputField label="Crime No" value={form.crimeNumber} onChange={(v:any)=>setForm({...form, crimeNumber: v})} />
              <InputField label="Year" value={form.crimeYear} onChange={(v:any)=>setForm({...form, crimeYear: v})} />
              <InputField label="FIR Date" type="date" value={form.firDate} onChange={(v:any)=>setForm({...form, firDate: v})} />
              <InputField label="Seizure Date" type="date" value={form.seizureDate} onChange={(v:any)=>setForm({...form, seizureDate: v})} />
           </div>
           <InputField label="Act & Section" value={form.actSection} onChange={(v:any)=>setForm({...form, actSection: v})} />
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-600" /> Seized Properties
            </h2>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200">
              <input type="checkbox" checked={addPropertyNow} onChange={e => setAddPropertyNow(e.target.checked)} className="rounded text-indigo-600" />
              Add Property Details Now?
            </label>
          </div>

          {addPropertyNow ? (
            <div className="space-y-6">
              {form.properties.map((prop, idx) => (
                <div key={idx} className="bg-slate-50 p-4 md:p-5 rounded-lg border border-slate-200 relative">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <InputField label="Category" value={prop.category} onChange={(v:any) => handlePropChange(idx, 'category', v)} />
                     <InputField label="Description" value={prop.description} onChange={(v:any) => handlePropChange(idx, 'description', v)} />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                     <InputField label="Quantity" value={prop.quantity} onChange={(v:any) => handlePropChange(idx, 'quantity', v)} />
                     <InputField label="Location" value={prop.location} onChange={(v:any) => handlePropChange(idx, 'location', v)} />
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Belonging To</label>
                       <select className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm" value={prop.belongingTo} onChange={e => handlePropChange(idx, 'belongingTo', e.target.value)}>
                         <option>Unknown</option><option>Accused</option><option>Complainant</option>
                       </select>
                     </div>
                   </div>

                   <div className="mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Evidence Photo <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-4">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(idx, e)} className="text-sm text-slate-500 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        {uploading && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
                        {prop.imageUrl && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><CheckCircle className="h-4 w-4"/> Uploaded</span>}
                      </div>
                      {prop.imageUrl && <img src={prop.imageUrl} className="h-20 w-20 object-cover mt-2 rounded border" alt="Preview"/>}
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
              <button type="button" onClick={() => setForm({...form, properties: [...form.properties, { category: '', description: '', quantity: '', location: '', nature: '', belongingTo: 'Unknown', imageUrl: '' }]})} className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Another Item
              </button>
            </div>
          ) : (
             <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                You can add properties later from the Case Details page.
             </div>
          )}
        </div>

        <button disabled={submitting} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition flex justify-center items-center gap-2">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Registering...' : 'Register Case'}
        </button>
      </form>
    </div>
  );
}

const InputField = ({ label, onChange, ...props }: any) => (
  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
  <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-slate-200 outline-none" onChange={e => onChange(e.target.value)} required {...props} />
  </div>
);