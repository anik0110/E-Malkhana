'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save } from 'lucide-react';

export default function CaseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    stationName: '',
    ioName: '',
    crimeNumber: '',
    crimeYear: new Date().getFullYear().toString(),
    firDate: '',
    seizureDate: '',
    actSection: '',
    properties: [
      { category: '', description: '', quantity: '', location: '', nature: '', belongingTo: 'Unknown' }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        router.push('/cases');
        router.refresh(); 
      } else {
        alert('Failed to register case');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyChange = (index: number, field: string, value: string) => {
    const newProps: any = [...form.properties];
    newProps[index][field] = value;
    setForm({ ...form, properties: newProps });
  };

  const addProperty = () => {
    setForm({
      ...form,
      properties: [...form.properties, { category: '', description: '', quantity: '', location: '', nature: '', belongingTo: 'Unknown' }]
    });
  };

  const removeProperty = (index: number) => {
    if (form.properties.length > 1) {
      const newProps = form.properties.filter((_, i) => i !== index);
      setForm({ ...form, properties: newProps });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-bold text-slate-800">Case Information</h2>
        <p className="text-sm text-slate-500">Enter the core details of the FIR and Seizure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Police Station</label>
          <input required type="text" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.stationName} onChange={e => setForm({...form, stationName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">IO Name & Rank</label>
          <input required type="text" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.ioName} onChange={e => setForm({...form, ioName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Act & Section</label>
          <input required type="text" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.actSection} onChange={e => setForm({...form, actSection: e.target.value})} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Crime Number</label>
          <input required type="text" placeholder="e.g. 102" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.crimeNumber} onChange={e => setForm({...form, crimeNumber: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
          <input required type="number" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.crimeYear} onChange={e => setForm({...form, crimeYear: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">FIR Date</label>
          <input required type="date" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.firDate} onChange={e => setForm({...form, firDate: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Seizure Date</label>
          <input required type="date" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={form.seizureDate} onChange={e => setForm({...form, seizureDate: e.target.value})} />
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Seized Properties</h2>
            <p className="text-sm text-slate-500">Add all items seized in this case.</p>
          </div>
          <button type="button" onClick={addProperty} className="flex items-center text-sm bg-slate-100 text-slate-700 px-3 py-2 rounded hover:bg-slate-200">
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </button>
        </div>

        <div className="space-y-4">
          {form.properties.map((prop, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <input placeholder="Category (e.g. Mobile, Gold)" className="border p-2 rounded text-sm" 
                  value={prop.category} onChange={e => handlePropertyChange(idx, 'category', e.target.value)} />
                <input placeholder="Quantity/Weight" className="border p-2 rounded text-sm" 
                  value={prop.quantity} onChange={e => handlePropertyChange(idx, 'quantity', e.target.value)} />
                <select className="border p-2 rounded text-sm"
                  value={prop.belongingTo} onChange={e => handlePropertyChange(idx, 'belongingTo', e.target.value)}>
                  <option value="Unknown">Belongs To: Unknown</option>
                  <option value="Accused">Belongs To: Accused</option>
                  <option value="Complainant">Belongs To: Complainant</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Full Description (Color, Model, Serial No)" className="border p-2 rounded text-sm" 
                  value={prop.description} onChange={e => handlePropertyChange(idx, 'description', e.target.value)} />
                <input placeholder="Storage Location (Rack/Locker ID)" className="border p-2 rounded text-sm" 
                  value={prop.location} onChange={e => handlePropertyChange(idx, 'location', e.target.value)} />
              </div>
              
              {form.properties.length > 1 && (
                <button type="button" onClick={() => removeProperty(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button disabled={loading} type="submit" className="w-full flex items-center justify-center bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300">
        {loading ? 'Registering...' : <><Save className="mr-2 h-5 w-5" /> Register Case & Generate QRs</>}
      </button>
    </form>
  );
}