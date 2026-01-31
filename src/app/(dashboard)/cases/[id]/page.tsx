// 'use client';

// import { useEffect, useState, use } from 'react';
// import { QRCodeSVG } from 'qrcode.react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react'; 
// import { X, AlertTriangle, Gavel, ArrowRightLeft, Truck, Lock, BadgeCheck, UserCheck } from 'lucide-react'; 

// type Props = { params: Promise<{ id: string }> };

// export default function CaseDetail({ params }: Props) {
//   const router = useRouter();
//   const { data: session }: any = useSession(); 
  
//   const resolvedParams = use(params);
//   const id = resolvedParams.id;

//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
  
//   // Modals
//   const [isDisposeModalOpen, setDisposeModalOpen] = useState(false);
//   const [isMoveModalOpen, setMoveModalOpen] = useState(false);
//   const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
//   const [disposalForm, setDisposalForm] = useState({ type: 'Returned to Owner', orderRef: '', remarks: '' });
//   const [moveForm, setMoveForm] = useState({ to: '', purpose: 'Forensic Analysis (FSL)', remarks: '' });

//   useEffect(() => {
//     fetch(`/api/cases/${id}`).then(res => res.json()).then(d => { setData(d); setLoading(false); });
//   }, [id]);

//   // --- IMPROVED PERMISSION LOGIC ---
//   const currentUserBadge = session?.user?.badgeId;
//   const currentUserName = session?.user?.name;
  
//   const caseOwnerBadge = data?.ioId;
//   const caseOwnerName = data?.ioName;

//   // 1. Strict Match: Badges match
//   const isStrictMatch = currentUserBadge && caseOwnerBadge && (currentUserBadge === caseOwnerBadge);
  
//   // 2. Legacy Fallback: If Case has NO ID, match by Name
//   const isLegacyMatch = !caseOwnerBadge && (currentUserName === caseOwnerName);

//   const isAuthorizedIO = isStrictMatch || isLegacyMatch;

//   const handleAction = (type: 'MOVE' | 'DISPOSE', propId: string) => {
//     if (!isAuthorizedIO) {
//         alert("ACCESS DENIED: Only the Investigating Officer (IO) assigned to this case can modify it.");
//         return; 
//     }
//     setSelectedPropId(propId);
//     if (type === 'MOVE') setMoveModalOpen(true);
//     if (type === 'DISPOSE') setDisposeModalOpen(true);
//   };

//   const submitAction = async (endpointBody: any, closeModal: Function) => {
//     if (!isAuthorizedIO) return; 

//     await fetch(`/api/cases/${id}`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(endpointBody)
//     });
//     closeModal(false);
//     const updated = await fetch(`/api/cases/${id}`).then(res => res.json());
//     setData(updated);
//     router.refresh();
//   };

//   if (loading) return <div className="p-8 text-slate-400">Loading Case...</div>;
//   if (!data) return <div className="p-8">Case not found</div>;

//   return (
//     <div className="p-8 max-w-6xl mx-auto space-y-8">
      
//       {/* Header Card */}
//       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
//         <div>
//           <div className="flex items-center gap-3 mb-1">
//              <h1 className="text-2xl font-bold text-slate-800">Case #{data.crimeNumber}/{data.crimeYear}</h1>
//              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${data.status === 'Active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
//                 {data.status}
//              </span>
//           </div>
//           <p className="text-slate-500 text-sm">Station: {data.stationName}</p>
          
//           <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
//              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs">
//                 <BadgeCheck className="h-3 w-3" /> Assigned IO: <strong>{data.ioName} {data.ioId ? `(${data.ioId})` : '(No ID)'}</strong>
//              </span>
             
//              {isAuthorizedIO ? (
//                 <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-emerald-100">
//                     <UserCheck className="h-3 w-3" /> You have Edit Access
//                 </span>
//              ) : (
//                 <span className="text-slate-500 bg-slate-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-slate-200">
//                     <Lock className="h-3 w-3" /> Read-Only View
//                 </span>
//              )}
//           </div>
//         </div>
//       </div>

//       {/* Properties List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {data.properties?.map((prop: any, i: number) => (
//           <div key={i} className={`relative p-6 rounded-xl border flex justify-between group overflow-hidden ${prop.status === 'Disposed' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm'}`}>
//             <div className={`absolute left-0 top-0 bottom-0 w-1 ${prop.status === 'Disposed' ? 'bg-slate-300' : 'bg-indigo-500'}`}></div>

//             <div className="flex-1 pr-6">
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="font-bold text-slate-800">{prop.category}</h3>
//                 {prop.status === 'Disposed' && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold">DISPOSED</span>}
//               </div>
//               <p className="text-sm text-slate-600 mb-3">{prop.description}</p>
//               <p className="text-xs font-mono text-slate-400 bg-slate-50 p-1 rounded w-fit mb-4">Loc: {prop.location}</p>
              
//               {isAuthorizedIO && prop.status !== 'Disposed' && (
//                 <div className="flex gap-2">
//                    <button onClick={() => handleAction('MOVE', prop.category)} className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded hover:bg-slate-700 transition flex items-center gap-2">
//                      <Truck className="h-3 w-3" /> Move
//                    </button>
//                    <button onClick={() => handleAction('DISPOSE', prop._id)} className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50 transition flex items-center gap-2">
//                      <Gavel className="h-3 w-3" /> Dispose
//                    </button>
//                 </div>
//               )}
//             </div>
            
//              <div className="flex flex-col items-center justify-center pl-6 border-l border-slate-100">
//                <div className="p-2 bg-white rounded shadow-sm border border-slate-100">
//                   <QRCodeSVG value={prop.qrCodeData || "N/A"} size={70} />
//                </div>
//                <span className="text-[9px] text-slate-400 mt-2 tracking-widest uppercase">SCAN</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Custody Timeline */}
//       <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
//         <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
//             <ArrowRightLeft className="h-5 w-5 text-indigo-500"/> Custody Timeline
//         </h3>
//         <div className="space-y-6 border-l-2 border-slate-100 pl-8 relative">
//           {[...data.chainOfCustody].reverse().map((log: any, i: number) => (
//             <div key={i} className="relative">
//               <div className="absolute -left-[39px] top-1 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-white"></div>
//               <div>
//                   <p className="text-sm font-bold text-slate-800">{log.purpose}</p>
//                   <p className="text-xs text-slate-500 mt-1 mb-2">
//                     {log.from} <span className="text-slate-300 mx-1">→</span> {log.to}
//                   </p>
//                   <span className="text-[10px] text-slate-400 uppercase tracking-wide">{new Date(log.date).toLocaleString()}</span>
//                   {log.remarks && <p className="text-xs text-slate-500 mt-1 italic border-l-2 border-slate-200 pl-2">"{log.remarks}"</p>}
//               </div>
//             </div>
//           ))}
//           {data.chainOfCustody.length === 0 && <p className="text-slate-400 text-sm italic">No movements recorded yet.</p>}
//         </div>
//       </div>

//       {/* --- MOVEMENT MODAL --- */}
//       {isMoveModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
//             <div className="flex justify-between items-center mb-6">
//                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Truck className="h-5 w-5 text-indigo-600"/> Update Movement</h3>
//                <button onClick={() => setMoveModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
//             </div>
//             <div className="space-y-4">
//                <InputField label="Destination" placeholder="e.g. FSL Lab" onChange={(v: string) => setMoveForm({...moveForm, to: v})} />
//                <SelectField label="Purpose" options={['Forensic Analysis (FSL)', 'Court Hearing', 'Inspection', 'Transfer']} onChange={(v: string) => setMoveForm({...moveForm, purpose: v})} />
//                <TextAreaField label="Remarks" onChange={(v: string) => setMoveForm({...moveForm, remarks: v})} />
//                <button onClick={() => submitAction({ action: 'ADD_LOG', from: 'Malkhana', ...moveForm }, setMoveModalOpen)} className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition">Confirm Move</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- DISPOSE MODAL --- */}
//       {isDisposeModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
//              <div className="flex justify-between items-center mb-6">
//                <h3 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-rose-600"/> Dispose Property</h3>
//                <button onClick={() => setDisposeModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
//             </div>
//             <div className="space-y-4">
//                <SelectField label="Method" options={['Returned to Owner', 'Auctioned', 'Destroyed']} onChange={(v: string) => setDisposalForm({...disposalForm, type: v})} />
//                <InputField label="Order Reference" placeholder="Court Order #123" onChange={(v: string) => setDisposalForm({...disposalForm, orderRef: v})} />
//                <TextAreaField label="Remarks" onChange={(v: string) => setDisposalForm({...disposalForm, remarks: v})} />
//                <button onClick={() => submitAction({ action: 'DISPOSE_PROPERTY', propertyId: selectedPropId, disposalType: disposalForm.type, ...disposalForm }, setDisposeModalOpen)} className="w-full py-3 bg-rose-700 text-white rounded-lg font-bold hover:bg-rose-800 transition">Confirm Disposal</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Reusable Components
// const InputField = ({ label, onChange, ...props }: any) => (
//   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
//   <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-slate-200 outline-none" onChange={e => onChange(e.target.value)} {...props} /></div>
// );
// const SelectField = ({ label, options, onChange }: any) => (
//   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
//   <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none" onChange={e => onChange(e.target.value)}>
//     {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
//   </select></div>
// );
// const TextAreaField = ({ label, onChange }: any) => (
//   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
//   <textarea rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none" onChange={e => onChange(e.target.value)} /></div>
// );

'use client';

import { useEffect, useState, use } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 
import { X, AlertTriangle, Gavel, ArrowRightLeft, Truck, Lock, BadgeCheck, UserCheck, Package } from 'lucide-react'; 

type Props = { params: Promise<{ id: string }> };

export default function CaseDetail({ params }: Props) {
  const router = useRouter();
  const { data: session }: any = useSession(); 
  
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isDisposeModalOpen, setDisposeModalOpen] = useState(false);
  const [isMoveModalOpen, setMoveModalOpen] = useState(false);
  
  // State to track WHICH item is being moved
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [selectedPropName, setSelectedPropName] = useState<string>(''); // <--- New State

  // Forms
  const [disposalForm, setDisposalForm] = useState({ type: 'Returned to Owner', orderRef: '', remarks: '' });
  const [moveForm, setMoveForm] = useState({ to: '', purpose: 'Forensic Analysis (FSL)', remarks: '' });

  useEffect(() => {
    fetch(`/api/cases/${id}`).then(res => res.json()).then(d => { setData(d); setLoading(false); });
  }, [id]);

  // Permissions Logic
  const currentUserBadge = session?.user?.badgeId;
  const currentUserName = session?.user?.name;
  const caseOwnerBadge = data?.ioId;
  const caseOwnerName = data?.ioName;
  
  // Strict Match: Badges match
  const isStrictMatch = currentUserBadge && caseOwnerBadge && (currentUserBadge === caseOwnerBadge);
  // Legacy Fallback: If Case has NO ID, match by Name
  const isLegacyMatch = !caseOwnerBadge && (currentUserName === caseOwnerName);

  const isAuthorizedIO = isStrictMatch || isLegacyMatch;

  // HANDLERS
  const handleMoveClick = (propName: string, propCategory: string) => {
    if (!isAuthorizedIO) {
        alert("ACCESS DENIED: Only the Investigating Officer (IO) assigned to this case can modify it.");
        return;
    }
    
    // Combine Category + Name for clarity (e.g. "Electronics - Red Phone")
    const fullName = `${propCategory} (${propName})`;
    setSelectedPropName(fullName); 
    
    setMoveForm({ to: '', purpose: 'Forensic Analysis (FSL)', remarks: '' });
    setMoveModalOpen(true);
  };

  const handleDisposeClick = (propId: string) => {
    if (!isAuthorizedIO) {
        alert("ACCESS DENIED: Only the Investigating Officer (IO) assigned to this case can modify it.");
        return;
    }
    setSelectedPropId(propId);
    setDisposeModalOpen(true);
  };

  const submitAction = async (endpointBody: any, closeModal: Function) => {
    if (!isAuthorizedIO) return; 

    await fetch(`/api/cases/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(endpointBody)
    });
    closeModal(false);
    const updated = await fetch(`/api/cases/${id}`).then(res => res.json());
    setData(updated);
    router.refresh();
  };

  if (loading) return <div className="p-8 text-slate-400">Loading Case...</div>;
  if (!data) return <div className="p-8">Case not found</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-2xl font-bold text-slate-800">Case #{data.crimeNumber}/{data.crimeYear}</h1>
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${data.status === 'Active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {data.status}
             </span>
          </div>
          <p className="text-slate-500 text-sm">Station: {data.stationName}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
             <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs">
                <BadgeCheck className="h-3 w-3" /> Assigned IO: <strong>{data.ioName}</strong>
             </span>
             {isAuthorizedIO ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-emerald-100">
                    <UserCheck className="h-3 w-3" /> Edit Access
                </span>
             ) : (
                <span className="text-slate-500 bg-slate-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-slate-200">
                    <Lock className="h-3 w-3" /> Read-Only
                </span>
             )}
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.properties?.map((prop: any, i: number) => (
          <div key={i} className={`relative p-6 rounded-xl border flex justify-between group overflow-hidden ${prop.status === 'Disposed' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${prop.status === 'Disposed' ? 'bg-slate-300' : 'bg-indigo-500'}`}></div>

            <div className="flex-1 pr-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800">{prop.category}</h3>
                {prop.status === 'Disposed' && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold">DISPOSED</span>}
              </div>
              <p className="text-sm text-slate-600 mb-3">{prop.description}</p>
              <p className="text-xs font-mono text-slate-400 bg-slate-50 p-1 rounded w-fit mb-4">Loc: {prop.location}</p>
              
              {isAuthorizedIO && prop.status !== 'Disposed' && (
                <div className="flex gap-2">
                   {/* Pass description and category to helper */}
                   <button onClick={() => handleMoveClick(prop.description, prop.category)} className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded hover:bg-slate-700 transition flex items-center gap-2">
                     <Truck className="h-3 w-3" /> Move
                   </button>
                   <button onClick={() => handleDisposeClick(prop._id)} className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50 transition flex items-center gap-2">
                     <Gavel className="h-3 w-3" /> Dispose
                   </button>
                </div>
              )}
            </div>
             <div className="flex flex-col items-center justify-center pl-6 border-l border-slate-100">
               <div className="p-2 bg-white rounded shadow-sm border border-slate-100">
                  <QRCodeSVG value={prop.qrCodeData || "N/A"} size={70} />
               </div>
               <span className="text-[9px] text-slate-400 mt-2 tracking-widest uppercase">SCAN</span>
            </div>
          </div>
        ))}
      </div>

      {/* Custody Timeline */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-indigo-500"/> Custody Timeline
        </h3>
        <div className="space-y-8 border-l-2 border-slate-100 pl-8 relative">
          {[...data.chainOfCustody].reverse().map((log: any, i: number) => (
            <div key={i} className="relative">
              <div className="absolute -left-[41px] top-1 h-4 w-4 rounded-full bg-indigo-50 border-2 border-indigo-500"></div>
              <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{log.purpose}</span>
                    {/* DISPLAY ITEM NAME BADGE */}
                    {log.propertyName && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded border border-indigo-100 flex items-center gap-1">
                            <Package className="h-3 w-3" /> {log.propertyName}
                        </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-500 mb-2 font-mono">
                    {log.from} <span className="text-slate-300 mx-1">→</span> {log.to}
                  </p>
                  
                  {log.remarks && <p className="text-sm text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100 inline-block">"{log.remarks}"</p>}
                  
                  <div className="mt-1 text-[10px] text-slate-400 uppercase tracking-wide">{new Date(log.date).toLocaleString()}</div>
              </div>
            </div>
          ))}
          {data.chainOfCustody.length === 0 && <p className="text-slate-400 text-sm italic">No movements recorded yet.</p>}
        </div>
      </div>

      {/* --- MOVEMENT MODAL --- */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2"><Truck className="h-5 w-5 text-indigo-600"/> Update Movement</h3>
               <button onClick={() => setMoveModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            
            {/* Show which item is being moved */}
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-bold text-indigo-900">{selectedPropName}</span>
            </div>

            <div className="space-y-4">
               <InputField label="Destination" placeholder="e.g. FSL Lab" onChange={(v: string) => setMoveForm({...moveForm, to: v})} />
               <SelectField label="Purpose" options={['Forensic Analysis (FSL)', 'Court Hearing', 'Inspection', 'Transfer']} onChange={(v: string) => setMoveForm({...moveForm, purpose: v})} />
               <TextAreaField label="Remarks" onChange={(v: string) => setMoveForm({...moveForm, remarks: v})} />
               
               <button 
                  onClick={() => submitAction({ 
                      action: 'ADD_LOG', 
                      from: 'Malkhana', 
                      propertyName: selectedPropName, // <--- SEND ITEM NAME TO API
                      ...moveForm 
                  }, setMoveModalOpen)} 
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition"
               >
                  Confirm Move
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DISPOSE MODAL --- */}
      {isDisposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-rose-600"/> Dispose Property</h3>
               <button onClick={() => setDisposeModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
               <SelectField label="Method" options={['Returned to Owner', 'Auctioned', 'Destroyed']} onChange={(v: string) => setDisposalForm({...disposalForm, type: v})} />
               <InputField label="Order Reference" placeholder="Court Order #123" onChange={(v: string) => setDisposalForm({...disposalForm, orderRef: v})} />
               <TextAreaField label="Remarks" onChange={(v: string) => setDisposalForm({...disposalForm, remarks: v})} />
               <button onClick={() => submitAction({ action: 'DISPOSE_PROPERTY', propertyId: selectedPropId, disposalType: disposalForm.type, ...disposalForm }, setDisposeModalOpen)} className="w-full py-3 bg-rose-700 text-white rounded-lg font-bold hover:bg-rose-800 transition">Confirm Disposal</button>
            </div>
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