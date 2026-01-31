'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';
import { useRef } from 'react';

interface QRProps {
  data: string;
  label: string;
  subLabel?: string;
}

export default function QRCodeGenerator({ data, label, subLabel }: QRProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    
    const printContent = qrRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      
      const printWindow = window.open('', '', 'height=500, width=500');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print QR</title>');
        printWindow.document.write('</head><body style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 20px;">');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white border rounded shadow-sm w-fit">
      <div ref={qrRef} className="flex flex-col items-center text-center">
        <div className="border-4 border-white shadow-sm mb-2">
          <QRCodeSVG value={data} size={120} level={"H"} />
        </div>
        <span className="text-xs font-bold text-slate-800 uppercase">{label}</span>
        {subLabel && <span className="text-[10px] text-slate-500">{subLabel}</span>}
      </div>
      
      <button 
        onClick={handlePrint} 
        className="mt-3 flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
      >
        <Printer className="h-3 w-3 mr-1" /> Print Sticker
      </button>
    </div>
  );
}