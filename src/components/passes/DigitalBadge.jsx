import React from 'react';
import { QrCode, Calendar, Clock, User, Building, ShieldCheck, Printer, Download } from 'lucide-react';
import { passApi } from '../../services/api';

export default function DigitalBadge({ pass }) {
  if (!pass) return null;

  const handlePrint = () => {
    window.print();
  };

  const pdfUrl = passApi.getPdfUrl(pass._id);

  return (
    <div className="flex flex-col items-center">
      {/* Digital Badge Card */}
      <div id="printable-badge" className="w-full max-w-sm bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden text-slate-800">
        {/* Badge Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldCheck size={22} className="text-blue-200" />
            <h2 className="text-lg font-bold tracking-wider uppercase">VISITOR PASS</h2>
          </div>
          <p className="text-xs text-blue-100 font-medium">TaskMaster Security System</p>
          <div className="mt-3 inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider">
            {pass.passNumber}
          </div>
        </div>

        {/* QR Code Container */}
        <div className="p-6 flex flex-col items-center border-b border-dashed border-slate-200 bg-slate-50/50">
          {pass.qrCode ? (
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
              <img src={pass.qrCode} alt="Visitor Pass QR" className="w-44 h-44 object-contain" />
            </div>
          ) : (
            <div className="w-44 h-44 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
              <QrCode size={48} />
            </div>
          )}
          <p className="text-[11px] text-slate-400 font-medium mt-2">Scan at security checkpoint</p>
        </div>

        {/* Visitor Details */}
        <div className="p-6 space-y-3.5 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <User size={15} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Visitor</p>
              <p className="font-bold text-slate-800 text-sm">{pass.visitor?.fullName || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building size={15} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Company / Host</p>
              <p className="font-medium text-slate-700">
                {pass.visitor?.company || 'Individual'} • Host: {pass.host?.name || 'Front Desk'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Calendar size={15} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Valid Until</p>
              <p className="font-medium text-slate-700">
                {pass.validUntil ? new Date(pass.validUntil).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 text-center text-[10px] text-slate-400 border-t border-slate-100">
          Must be worn visibly at all times inside the premises.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={handlePrint}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Printer size={16} />
          <span>Print Badge</span>
        </button>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex items-center gap-2"
        >
          <Download size={16} />
          <span>Download Official PDF</span>
        </a>
      </div>
    </div>
  );
}
