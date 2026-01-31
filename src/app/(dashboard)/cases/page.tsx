'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, FileText, Plus, Filter, Loader2, Printer } from 'lucide-react';

export default function ManageCases() {
  const [cases, setCases] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [printingId, setPrintingId] = useState<string | null>(null);

  const fetchCases = async (search = '') => {
    setLoading(true);
    const res = await fetch(`/api/cases?q=${search}`);
    const data = await res.json();
    setCases(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCases(query);
  };

  // ==============================
  // 🖨️ PDF REPORT GENERATOR
  // ==============================
  const handlePrintReport = async (caseId: string) => {
    setPrintingId(caseId);
    try {
      // 1. Fetch full details for this specific case
      const res = await fetch(`/api/cases/${caseId}`);
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to load case data");

      // 2. Create a hidden print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Please allow popups to print reports.");
        return;
      }

      // 3. Generate the HTML Report
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Case Report #${data.crimeNumber}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #000; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
            .sub-header { font-size: 14px; margin-top: 5px; }
            .section-title { font-size: 16px; font-weight: bold; background: #eee; padding: 5px 10px; margin-top: 20px; border-left: 5px solid #333; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; font-size: 14px; }
            .label { font-weight: bold; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; border-top: 1px solid #ccc; padding-top: 10px; }
            .stamp-box { margin-top: 40px; display: flex; justify-content: space-between; }
            .sign-area { width: 200px; border-top: 1px solid #000; text-align: center; padding-top: 5px; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Official Police Report</div>
            <div class="sub-header">e-Malkhana Digital Evidence Record</div>
            <div style="margin-top: 10px; font-size: 12px;">Generated on: ${new Date().toLocaleString()}</div>
          </div>

          <div class="section-title">CASE DETAILS</div>
          <div class="grid">
            <div><span class="label">Case ID:</span> ${data.crimeNumber}/${data.crimeYear}</div>
            <div><span class="label">Status:</span> ${data.status}</div>
            <div><span class="label">Police Station:</span> ${data.stationName}</div>
            <div><span class="label">Investigating Officer:</span> ${data.ioName} (${data.ioId || 'N/A'})</div>
            <div><span class="label">FIR Date:</span> ${new Date(data.firDate).toLocaleDateString()}</div>
            <div><span class="label">Act & Section:</span> ${data.actSection}</div>
          </div>

          <div class="section-title">SEIZED PROPERTIES (${data.properties?.length || 0})</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Location</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.properties?.map((p: any) => `
                <tr>
                  <td>${p.category}</td>
                  <td>${p.description}</td>
                  <td>${p.location}</td>
                  <td>${p.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="section-title">CHAIN OF CUSTODY LOG</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Action/Purpose</th>
                <th>Movement</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${data.chainOfCustody?.length > 0 ? data.chainOfCustody.map((log: any) => `
                <tr>
                  <td>${new Date(log.date).toLocaleString()}</td>
                  <td>${log.purpose}</td>
                  <td>${log.from} &rarr; ${log.to}</td>
                  <td>${log.remarks || '-'}</td>
                </tr>
              `).join('') : '<tr><td colspan="4" style="text-align:center; color:#888;">No movements recorded.</td></tr>'}
            </tbody>
          </table>

          <div class="stamp-box">
             <div class="sign-area">Signature of IO</div>
             <div class="sign-area">Malkhana In-Charge</div>
          </div>

          <div class="footer">
            This is a system-generated report from the e-Malkhana Portal.<br/>
            Valid for official use only.
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (error) {
      alert("Error generating report. Please try again.");
    } finally {
      setPrintingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Entries</h1>
          <p className="text-slate-500 text-sm mt-1">Search, view, and print case reports.</p>
        </div>
        <Link href="/cases/create" className="bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Case
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Crime Number or IO Name..." 
            className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition">
          Search
        </button>
      </form>

      {/* Modern Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Case ID</th>
                  <th className="p-5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Station</th>
                  <th className="p-5 font-semibold text-xs text-slate-500 uppercase tracking-wider">IO Name</th>
                  <th className="p-5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="p-5 font-semibold text-xs text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 italic">No cases found matching your search.</td>
                  </tr>
                ) : (
                  cases.map((c: any) => (
                    <tr key={c._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-5">
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">
                          #{c.crimeNumber}/{c.crimeYear}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-slate-700">{c.stationName}</td>
                      <td className="p-5 text-sm text-slate-700 font-medium">{c.ioName}</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          c.status === 'Active' 
                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="p-5 flex justify-end gap-2">
                        <Link href={`/cases/${c._id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handlePrintReport(c._id)}
                          disabled={printingId === c._id}
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition disabled:opacity-50" 
                          title="Print / Save PDF"
                        >
                          {printingId === c._id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Printer className="h-4 w-4" />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="text-center text-xs text-slate-400 mt-4">
        Showing {cases.length} entries. Use the search bar to filter results.
      </div>
    </div>
  );
}