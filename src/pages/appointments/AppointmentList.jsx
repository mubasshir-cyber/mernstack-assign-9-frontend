import React, { useState, useEffect } from 'react';
import { appointmentApi, passApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarPlus,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  User,
  MapPin,
  CreditCard,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import AppointmentForm from './AppointmentForm';
import AlertToast from '../../components/common/AlertToast';
import { useNavigate } from 'react-router-dom';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const res = await appointmentApi.getAppointments({ status: statusFilter });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      setToast({ message: 'Failed to fetch appointments', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter]);

  const handleApprove = async (id) => {
    try {
      await appointmentApi.approveAppointment(id, 'Approved by host/admin');
      setToast({ message: 'Appointment approved successfully!', type: 'success' });
      loadAppointments();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Approval failed', type: 'error' });
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (reason === null) return;

    try {
      await appointmentApi.rejectAppointment(id, reason || 'Schedule conflict');
      setToast({ message: 'Appointment rejected', type: 'success' });
      loadAppointments();
    } catch (err) {
      setToast({ message: 'Rejection failed', type: 'error' });
    }
  };

  const handleIssuePass = async (appointmentId) => {
    try {
      const res = await passApi.issuePass({ appointmentId });
      if (res.data.success) {
        setToast({ message: 'Pass issued with QR Code!', type: 'success' });
        navigate('/passes');
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to issue pass', type: 'error' });
    }
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
          <h2 className="text-xl font-bold text-slate-800">Visitor Appointments</h2>
          <p className="text-xs text-slate-500">Manage visit schedules and authorizations</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter Tabs */}
          <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-semibold text-slate-600 gap-1">
            {['all', 'pending', 'approved', 'rejected'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
          >
            <CalendarPlus size={16} />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Appointment Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs font-medium">
          No appointments found matching this status filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{apt.visitor?.fullName || 'N/A'}</h3>
                  <p className="text-xs text-slate-500 font-medium">{apt.visitor?.company || 'Individual'}</p>
                </div>
                <Badge status={apt.status} />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <span>
                    Host: <strong>{apt.host?.name}</strong> ({apt.host?.department})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <span>
                    {new Date(apt.scheduledDate).toLocaleDateString()} • {apt.scheduledStartTime} - {apt.scheduledEndTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{apt.location || 'Main Office'}</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Purpose</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5">{apt.purpose}</p>
              </div>

              {/* Actions row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {apt.status === 'pending' && hasRole('ADMIN', 'EMPLOYEE', 'SECURITY') && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(apt._id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(apt._id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {apt.status === 'approved' && hasRole('ADMIN', 'SECURITY') && (
                  <button
                    type="button"
                    onClick={() => handleIssuePass(apt._id)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm ml-auto"
                  >
                    <CreditCard size={14} />
                    <span>Issue Pass & QR</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Appointment"
        maxWidth="max-w-lg"
      >
        <AppointmentForm
          onSaved={() => {
            setIsModalOpen(false);
            setToast({ message: 'Appointment invitation created!', type: 'success' });
            loadAppointments();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
