import React, { useState, useEffect } from 'react';
import { passApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { QrCode, FileText, Ban, Search, Calendar, User, Building } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import DigitalBadge from '../../components/passes/DigitalBadge';
import AlertToast from '../../components/common/AlertToast';

export default function PassList() {
  const [passes, setPasses] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const { hasRole } = useAuth();

  const loadPasses = async () => {
    try {
      setIsLoading(true);
      const res = await passApi.getPasses({ status: statusFilter, search });
      if (res.data.success) {
        setPasses(res.data.data);
      }
    } catch (err) {
      setToast({ message: 'Failed to load passes', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPasses();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleRevoke = async (id, passNumber) => {
    if (!window.confirm(`Revoke pass #${passNumber}? This cannot be undone.`)) return;
    try {
      await passApi.revokePass(id);
      setToast({ message: `Pass #${passNumber} revoked`, type: 'success' });
      loadPasses();
    } catch (err) {
      setToast({ message: 'Failed to revoke pass', type: 'error' });
    }
  };

  const handleViewBadge = (pass) => {
    setSelectedPass(pass);
    setIsBadgeModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <AlertToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Visitor Passes</h2>
          <p className="text-xs text-slate-500">Active passes, QR codes, and digital badges</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-blue-600"
              placeholder="Search pass number (e.g. VP-2026)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-semibold text-slate-600 gap-1">
            {['all', 'active', 'revoked'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  statusFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Passes Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading passes...</div>
      ) : passes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs font-medium">
          No passes found. Passes are created automatically when appointments are approved.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {passes.map((pass) => (
            <div
              key={pass._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600 tracking-wider">
                      {pass.passNumber}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm mt-0.5">
                      {pass.visitor?.fullName || 'N/A'}
                    </h3>
                  </div>
                  <Badge status={pass.status} />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building size={14} className="text-slate-400" />
                    <span>Company: {pass.visitor?.company || 'Individual'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span>Host: {pass.host?.name || 'Front Desk'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Valid: {new Date(pass.validFrom).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleViewBadge(pass)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5"
                >
                  <QrCode size={15} />
                  <span>Digital Badge & QR</span>
                </button>

                {pass.status === 'active' && hasRole('ADMIN', 'SECURITY') && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(pass._id, pass.passNumber)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Revoke Pass"
                  >
                    <Ban size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital Badge Modal */}
      <Modal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        title="Visitor Digital Pass & Badge"
        maxWidth="max-w-md"
      >
        <DigitalBadge pass={selectedPass} />
      </Modal>
    </div>
  );
}
