import React, { useState, useEffect } from 'react';
import { appointmentApi, visitorApi, userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AppointmentForm({ onSaved, onCancel }) {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [visitorId, setVisitorId] = useState('');
  const [hostId, setHostId] = useState(user?._id || '');
  const [purpose, setPurpose] = useState('');
  const [location, setLocation] = useState('Main Office');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledStartTime, setScheduledStartTime] = useState('10:00 AM');
  const [scheduledEndTime, setScheduledEndTime] = useState('11:00 AM');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [visRes, hostRes] = await Promise.all([
          visitorApi.getVisitors(),
          userApi.getHosts(),
        ]);
        if (visRes.data.success) {
          setVisitors(visRes.data.data);
          if (visRes.data.data.length > 0) {
            setVisitorId(visRes.data.data[0]._id);
          }
        }
        if (hostRes.data.success) {
          setHosts(hostRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load dropdowns:', err);
      }
    };

    loadDropdowns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!visitorId || !purpose.trim() || !scheduledDate) {
      setError('Please select a visitor, purpose, and date');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await appointmentApi.createAppointment({
        visitor: visitorId,
        host: hostId || user._id,
        purpose: purpose.trim(),
        location: location.trim(),
        scheduledDate,
        scheduledStartTime,
        scheduledEndTime,
      });

      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 font-medium border border-rose-100">
          {error}
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Select Visitor *
        </label>
        <select
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
          value={visitorId}
          onChange={(e) => setVisitorId(e.target.value)}
        >
          {visitors.map((v) => (
            <option key={v._id} value={v._id}>
              {v.fullName} ({v.company || 'Individual'}) - {v.email}
            </option>
          ))}
        </select>
      </div>

      {user?.role === 'ADMIN' && (
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Assign Host (Employee) *
          </label>
          <select
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
            value={hostId}
            onChange={(e) => setHostId(e.target.value)}
          >
            {hosts.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name} ({h.department})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Purpose of Visit *
        </label>
        <input
          type="text"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
          placeholder="e.g. Technical discussion, Interview, Vendor pitch"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Meeting Location
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
            placeholder="e.g. Conf Room B"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Scheduled Date *
          </label>
          <input
            type="date"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Start Time
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
            placeholder="10:00 AM"
            value={scheduledStartTime}
            onChange={(e) => setScheduledStartTime(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            End Time
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
            placeholder="11:30 AM"
            value={scheduledEndTime}
            onChange={(e) => setScheduledEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Scheduling...' : 'Create Appointment'}
        </button>
      </div>
    </form>
  );
}
