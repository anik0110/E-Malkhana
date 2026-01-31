

'use client';

import { useEffect, useState, use } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 
import { 
  X, AlertTriangle, Gavel, ArrowRightLeft, Truck, Lock, 
  BadgeCheck, UserCheck, Package, Plus, Image as ImageIcon, 
  Loader2, CheckCircle 
} from 'lucide-react'; 

type Props = { params: Promise<{ id: string }> };

export default function CaseDetail({ params }: Props) {
  const router = useRouter();
  const { data: session }: any = useSession(); 
  
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Modals
  const [isDisposeModalOpen, setDisposeModalOpen] = useState(false);
  const [isMoveModalOpen, setMoveModalOpen] = useState(false);
  const [isAddPropModalOpen, setAddPropModalOpen] = useState(false);

  // Selections
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [selectedPropName, setSelectedPropName] = useState<string>(''); 

  // Forms
  const [disposalForm, setDisposalForm] = useState({ type: 'Returned to Owner', orderRef: '', remarks: '' });
  const [moveForm, setMoveForm] = useState({ to: '', purpose: 'Forensic Analysis (FSL)', remarks: '' });
  const [newPropForm, setNewPropForm] = useState({
    category: '', description: '', quantity: '1', location: '', nature: '', belongingTo: 'Unknown', imageUrl: ''
  });

  const fetchCase = () => {
    fetch(`/api/cases/${id}`).then(res => res.json()).then(d => { setData(d); setLoading(false); });
  };

  useEffect(() => { fetchCase(); }, [id]);

  const isAuthorizedIO = (session?.user?.badgeId && session?.user?.badgeId === data?.ioId) || 
                         (!data?.ioId && session?.user?.name === data?.ioName);

  // Handlers
  const handleMoveClick = (propName: string, propCategory: string) => {
    if (!isAuthorizedIO) return alert("Access Denied");
    setSelectedPropName(`${propCategory} (${propName})`); 
    setMoveForm({ to: '', purpose: 'Forensic Analysis (FSL)', remarks: '' });
    setMoveModalOpen(true);
  };

  const handleDisposeClick = (propId: string) => {
    if (!isAuthorizedIO) return alert("Access Denied");
    setSelectedPropId(propId);
    setDisposeModalOpen(true);
  };

  const submitAction = async (endpointBody: any, closeModal: Function) => {
    if (!isAuthorizedIO) return; 
    setSubmitting(true);
    try {
      const res = await fetch(`/api/cases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpointBody)
      });
      if (res.ok) { closeModal(false); fetchCase(); router.refresh(); }
      else { alert("Action failed."); }
    } catch(e) { alert("Error occurred"); }
    finally { setSubmitting(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) setNewPropForm({ ...newPropForm, imageUrl: data.secure_url });
    } catch (err) { alert("Upload failed"); } 
    finally { setUploading(false); }
  };

  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropForm.imageUrl) return alert("Property image is required.");
    await submitAction({ action: 'ADD_PROPERTY', ...newPropForm }, setAddPropModalOpen);
    setNewPropForm({ category: '', description: '', quantity: '1', location: '', nature: '', belongingTo: 'Unknown', imageUrl: '' });
  };

  const handleCloseCase = async () => {
     if (!confirm("Are you sure? This marks the case as Closed.")) return;
     await submitAction({ action: 'CLOSE_CASE' }, () => {}); 
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading...</div>;
  if (!data || data.error) return <div className="p-8 text-red-500">Case not found.</div>;

  const allDisposed = data.properties?.length > 0 && data.properties.every((p: any) => p.status === 'Disposed');

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
      
      {/* Header */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
             <h1 className="text-xl md:text-2xl font-bold text-slate-800">Case #{data.crimeNumber}/{data.crimeYear}</h1>
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${data.status === 'Active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {data.status}
             </span>
          </div>
          <p className="text-slate-500 text-sm">Station: {data.stationName}</p>
          <div className="mt-4 flex gap-2 md:gap-4 text-xs text-slate-500 flex-wrap">
             <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200"><BadgeCheck className="h-3 w-3"/> IO: {data.ioName}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {isAuthorizedIO && data.status === 'Active' && (
               <button onClick={() => setAddPropModalOpen(true)} className="flex-1 md:flex-none justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 text-sm transition">
                  <Plus className="h-4 w-4" /> Add Property
               </button>
            )}
            {isAuthorizedIO && allDisposed && data.status !== 'Disposed' && (
               <button onClick={handleCloseCase} className="flex-1 md:flex-none justify-center bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center gap-2 text-sm transition animate-pulse">
                  <CheckCircle className="h-4 w-4" /> Close Case
               </button>
            )}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {data.properties?.map((prop: any, i: number) => (
          <div key={i} className={`relative rounded-xl border flex flex-col sm:flex-row group overflow-hidden ${prop.status === 'Disposed' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${prop.status === 'Disposed' ? 'bg-slate-300' : 'bg-indigo-500'}`}></div>

            {/* Image Section */}
            <div className="p-4 pb-0 sm:pb-4 sm:pr-0">
               <div className="w-full sm:w-24 h-40 sm:h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  {prop.imageUrl ? (
                    <img src={prop.imageUrl} alt="Evid" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400"><ImageIcon className="h-6 w-6"/></div>
                  )}
               </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 truncate">{prop.category}</h3>
                  {prop.status === 'Disposed' && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold">DISPOSED</span>}
                </div>
                <p className="text-sm text-slate-600 mb-2 line-clamp-2">{prop.description}</p>
                <p className="text-xs font-mono text-slate-400 bg-slate-50 p-1 rounded w-fit mb-3">Loc: {prop.location}</p>
              </div>
              
              {isAuthorizedIO && prop.status !== 'Disposed' && (
                <div className="flex gap-2 mt-auto">
                   <button onClick={() => handleMoveClick(prop.description, prop.category)} className="flex-1 sm:flex-none justify-center px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded hover:bg-slate-700 flex items-center gap-2">
                     <Truck className="h-3 w-3" /> Move
                   </button>
                   <button onClick={() => handleDisposeClick(prop._id)} className="flex-1 sm:flex-none justify-center px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50 flex items-center gap-2">
                     <Gavel className="h-3 w-3" /> Dispose
                   </button>
                </div>
              )}
            </div>

            {/* QR Code - FIX: Removed 'hidden' class, added background and border for mobile separation */}
             <div className="flex sm:flex-col items-center justify-center p-4 border-t sm:border-t-0 sm:border-l border-slate-100 bg-slate-50 sm:bg-transparent">
                <div className="p-1 bg-white rounded shadow-sm border border-slate-100">
                  <QRCodeSVG value={prop.qrCodeData || "N/A"} size={60} />
                </div>
                <span className="ml-3 sm:ml-0 sm:mt-2 text-[9px] text-slate-400 tracking-widest uppercase">SCAN</span>
            </div>
          </div>
        ))}
      </div>

      {/* Custody Timeline */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-indigo-500"/> Custody Timeline
        </h3>
        <div className="space-y-8 border-l-2 border-slate-100 pl-6 md:pl-8 relative">
          {[...data.chainOfCustody].reverse().map((log: any, i: number) => (
            <div key={i} className="relative">
              <div className="absolute -left-[33px] md:-left-[41px] top-1 h-4 w-4 rounded-full bg-indigo-50 border-2 border-indigo-500"></div>
              <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{log.purpose}</span>
                    {log.propertyName && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded border border-indigo-100 flex items-center gap-1">
                            <Package className="h-3 w-3" /> {log.propertyName}
                        </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-2 font-mono break-all">{log.from} → {log.to}</p>
                  {log.remarks && <p className="text-sm text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100 inline-block">"{log.remarks}"</p>}
                  <div className="mt-1 text-[10px] text-slate-400 uppercase tracking-wide">{new Date(log.date).toLocaleString()}</div>
              </div>
            </div>
          ))}
          {data.chainOfCustody.length === 0 && <p className="text-slate-400 text-sm italic">No movements recorded yet.</p>}
        </div>
      </div>

      {/* --- MODALS (Responsive Wrappers) --- */}
      
      {/* 1. MOVE MODAL */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-[95%] md:w-full max-w-md rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2"><Truck className="h-5 w-5 text-indigo-600"/> Update Movement</h3>
               <button onClick={() => setMoveModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-bold text-indigo-900 line-clamp-1">{selectedPropName}</span>
            </div>
            <div className="space-y-4">
               <InputField label="Destination" placeholder="e.g. FSL Lab" onChange={(v: string) => setMoveForm({...moveForm, to: v})} />
               <SelectField label="Purpose" options={['Forensic Analysis (FSL)', 'Court Hearing', 'Inspection', 'Transfer']} onChange={(v: string) => setMoveForm({...moveForm, purpose: v})} />
               <TextAreaField label="Remarks" onChange={(v: string) => setMoveForm({...moveForm, remarks: v})} />
               <button onClick={() => submitAction({ action: 'ADD_LOG', from: 'Malkhana', propertyName: selectedPropName, ...moveForm }, setMoveModalOpen)} className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Confirm Move'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DISPOSE MODAL */}
      {isDisposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-[95%] md:w-full max-w-md rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-rose-600"/> Dispose Property</h3>
               <button onClick={() => setDisposeModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
               <SelectField label="Method" options={['Returned to Owner', 'Auctioned', 'Destroyed']} onChange={(v: string) => setDisposalForm({...disposalForm, type: v})} />
               <InputField label="Order Reference" placeholder="Court Order #123" onChange={(v: string) => setDisposalForm({...disposalForm, orderRef: v})} />
               <TextAreaField label="Remarks" onChange={(v: string) => setDisposalForm({...disposalForm, remarks: v})} />
               <button onClick={() => submitAction({ action: 'DISPOSE_PROPERTY', propertyId: selectedPropId, disposalType: disposalForm.type, ...disposalForm }, setDisposeModalOpen)} className="w-full py-3 bg-rose-700 text-white rounded-lg font-bold hover:bg-rose-800 transition" disabled={submitting}>
                 {submitting ? 'Processing...' : 'Confirm Disposal'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADD PROPERTY MODAL */}
      {isAddPropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-[95%] md:w-full max-w-lg rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2"><Plus className="h-5 w-5 text-indigo-600"/> Add New Property</h3>
               <button onClick={() => setAddPropModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddPropertySubmit} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <InputField label="Category" placeholder="e.g. Gold" value={newPropForm.category} onChange={(v: string) => setNewPropForm({...newPropForm, category: v})} required />
                  <InputField label="Quantity" placeholder="e.g. 1" value={newPropForm.quantity} onChange={(v: string) => setNewPropForm({...newPropForm, quantity: v})} required />
               </div>
               <InputField label="Description" placeholder="Details..." value={newPropForm.description} onChange={(v: string) => setNewPropForm({...newPropForm, description: v})} required />
               <div className="grid grid-cols-2 gap-4">
                  <InputField label="Location" placeholder="Rack/Locker" value={newPropForm.location} onChange={(v: string) => setNewPropForm({...newPropForm, location: v})} required />
                  <SelectField label="Belonging To" options={['Unknown', 'Accused', 'Complainant']} onChange={(v: string) => setNewPropForm({...newPropForm, belongingTo: v})} />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Evidence Image (Required)</label>
                  <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                     <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-slate-500 w-full" />
                     {uploading && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
                     {newPropForm.imageUrl && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>
                  {newPropForm.imageUrl && <img src={newPropForm.imageUrl} className="mt-2 h-20 w-20 object-cover rounded border" alt="Preview"/>}
               </div>
               <button disabled={uploading || submitting} type="submit" className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Save Property'}
               </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Reusable Components
const InputField = ({ label, onChange, ...props }: any) => (
  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
  <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-slate-200 outline-none" onChange={e => onChange(e.target.value)} {...props} /></div>
);
const SelectField = ({ label, options, onChange }: any) => (
  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none" onChange={e => onChange(e.target.value)} >
    {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
  </select></div>
);
const TextAreaField = ({ label, onChange }: any) => (
  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
  <textarea rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none" onChange={e => onChange(e.target.value)} /></div>
);