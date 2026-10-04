import React, { useState, useEffect } from 'react';
import { checklogApi, passApi } from '../../services/api';
import {
  QrCode,
  CheckCircle2,
  LogOut,
  LogIn,
  Search,
  AlertCircle,
  ShieldCheck,
  Building,
  User,
} from 'lucide-react';
import AlertToast from '../../components/common/AlertToast';

export default function QRScanner() {
  const [passInput, setPassInput] = useState('');
  const [scannedPass, setScannedPass] = useState(null);
  const [passesList, setPassesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Load available active passes for fast 1-click test scanning
  useEffect(() => {
    const loadActivePasses = async () => {
      try {
        const res = await passApi.getPasses({ status: 'active' });
        if (res.data.success) {
          setPassesList(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load passes for scanner quick list:', err);
      }
    };

    loadActivePasses();
  }, []);

  const handleLookup = async (idToLookup) => {
    const targetId = idToLookup || passInput.trim();
    if (!targetId) return;

    try {
      setIsLoading(true);
      // If it looks like a JSON string from QR code, parse it
      let passId = targetId;
      if (targetId.startsWith('{')) {
        try {
          const parsed = JSON.parse(targetId);
          passId = parsed.passId || passId;
        } catch (e) {}
      }

      // Check if user entered passNumber like VP-2026-000001
      if (passId.startsWith('VP-')) {
        const matching = passesList.find((p) => p.passNumber === passId);
        if (matching) {
          passId = matching._id;
        }
      }

      const res = await passApi.getPass(passId);
      if (res.data.success) {
        setScannedPass(res.data.data);
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Visitor pass not found or invalid format',
        type: 'error',
      });
      setScannedPass(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!scannedPass) return;
    try {
      setIsProcessing(true);
      const res = await checklogApi.checkIn({
        passId: scannedPass._id,
        location: 'Security Main Gate',
      });
      if (res.data.success) {
        setToast({
          message: `✅ Check-In successful for ${scannedPass.visitor?.fullName}!`,
          type: 'success',
        });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Check-in failed',
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (!scannedPass) return;
    try {
      setIsProcessing(true);
      const res = await checklogApi.checkOut({
        passId: scannedPass._id,
        location: 'Security Main Gate',
      });
      if (res.data.success) {
        setToast({
          message: `👋 Check-Out successful for ${scannedPass.visitor?.fullName}!`,
          type: 'success',
        });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Check-out failed',
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AlertToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-slate-800">Security QR Check-In / Check-Out Station</h2>
        <p className="text-xs text-slate-500">Scan visitor QR codes or enter Pass Number to log entry & exit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scanner / Input Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold text-sm">
              <QrCode className="text-blue-600" size={18} />
              <span>Scan QR Code or Enter Pass #</span>
            </div>

            {/* Input box */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl border-2 border-blue-500/30 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600 bg-slate-50/50"
                  placeholder="Paste QR payload or VP-2026-XXXXXX..."
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                />
                <button
                  type="button"
                  onClick={() => handleLookup()}
                  disabled={isLoading}
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Search size={15} />
                </button>
              </div>

              {/* Quick Select for Testing */}
              {passesList.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Quick Select Active Pass for Testing:
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {passesList.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => {
                          setPassInput(p._id);
                          handleLookup(p._id);
                        }}
                        className="w-full p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 text-left flex items-center justify-between transition-colors text-xs"
                      >
                        <span className="font-mono font-bold text-slate-700">{p.passNumber}</span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {p.visitor?.fullName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scanned Result Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" size={18} />
              <span>Pass Validation & Action</span>
            </h3>

            {scannedPass ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-800">
                      {scannedPass.passNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900 text-[10px] font-bold uppercase">
                      VALID PASS
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mt-2">
                    {scannedPass.visitor?.fullName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {scannedPass.visitor?.company || 'Individual'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span>Host: <strong>{scannedPass.host?.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building size={14} className="text-slate-400" />
                    <span>Department: {scannedPass.host?.department || 'General'}</span>
                  </div>
                </div>

                {/* Check-In / Check-Out Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    disabled={isProcessing}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    <LogIn size={16} />
                    <span>Check IN</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCheckOut}
                    disabled={isProcessing}
                    className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    <LogOut size={16} />
                    <span>Check OUT</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs font-medium border-2 border-dashed border-slate-100 rounded-2xl">
                Scan or select a pass on the left to verify and perform check-in / check-out.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
