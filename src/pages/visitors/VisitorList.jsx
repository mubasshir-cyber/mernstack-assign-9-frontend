import React, { useState, useEffect } from 'react';
import { visitorApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Search, Edit2, Trash2, Building, Mail, Phone, Shield } from 'lucide-react';
import Modal from '../../components/common/Modal';
import VisitorForm from './VisitorForm';
import AlertToast from '../../components/common/AlertToast';

export default function VisitorList() {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const { hasRole } = useAuth();

  const loadVisitors = async () => {
    try {
      setIsLoading(true);
      const res = await visitorApi.getVisitors({ search });
      if (res.data.success) {
        setVisitors(res.data.data);
      }
    } catch (err) {
      setToast({ message: 'Failed to fetch visitors', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadVisitors();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete visitor '${name}'?`)) return;
    try {
      await visitorApi.deleteVisitor(id);
      setToast({ message: 'Visitor deleted successfully', type: 'success' });
      loadVisitors();
    } catch (err) {
      setToast({ message: 'Failed to delete visitor', type: 'error' });
    }
  };

  return (
    <div className="space-y-5">
      <AlertToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Visitors Directory</h2>
          <p className="text-xs text-slate-500">View and manage registered visitors</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-blue-600"
              placeholder="Search visitor, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingVisitor(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
          >
            <UserPlus size={16} />
            <span>Register Visitor</span>
          </button>
        </div>
      </div>

      {/* Visitors Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading visitors...</div>
        ) : visitors.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No visitors found. Click &quot;Register Visitor&quot; to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Visitor Name</th>
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Contact Info</th>
                  <th className="px-6 py-3.5">Govt. ID</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {visitors.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">{v.fullName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{v.address || 'Address not specified'}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs">
                        <Building size={13} className="text-slate-400" />
                        <span>{v.company || 'Individual'}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail size={13} className="text-slate-400" />
                        <span>{v.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone size={13} className="text-slate-400" />
                        <span>{v.phone}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Shield size={13} className="text-blue-500" />
                        <span className="font-mono text-xs font-semibold text-slate-600">
                          {v.governmentIdType}: {v.maskedId || '••••'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      {hasRole('ADMIN', 'SECURITY') && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVisitor(v);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                      )}

                      {hasRole('ADMIN') && (
                        <button
                          type="button"
                          onClick={() => handleDelete(v._id, v.fullName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visitor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVisitor ? 'Edit Visitor Details' : 'Register New Visitor'}
        maxWidth="max-w-lg"
      >
        <VisitorForm
          visitorToEdit={editingVisitor}
          onSaved={() => {
            setIsModalOpen(false);
            setToast({
              message: editingVisitor ? 'Visitor updated!' : 'Visitor registered successfully!',
              type: 'success',
            });
            loadVisitors();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
