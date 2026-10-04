import React, { useState } from 'react';
import { visitorApi } from '../../services/api';

export default function VisitorForm({ onSaved, onCancel, visitorToEdit }) {
  const [fullName, setFullName] = useState(visitorToEdit?.fullName || '');
  const [email, setEmail] = useState(visitorToEdit?.email || '');
  const [phone, setPhone] = useState(visitorToEdit?.phone || '');
  const [company, setCompany] = useState(visitorToEdit?.company || '');
  const [governmentIdType, setGovernmentIdType] = useState(visitorToEdit?.governmentIdType || 'Other');
  const [governmentIdNumber, setGovernmentIdNumber] = useState(visitorToEdit?.governmentIdNumber || '');
  const [address, setAddress] = useState(visitorToEdit?.address || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill out Name, Email, and Phone');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim() || 'Individual',
        governmentIdType,
        governmentIdNumber: governmentIdNumber.trim(),
        address: address.trim(),
      };

      if (visitorToEdit) {
        await visitorApi.updateVisitor(visitorToEdit._id, payload);
      } else {
        await visitorApi.createVisitor(payload);
      }

      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save visitor');
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
          Full Name *
        </label>
        <input
          type="text"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
          placeholder="e.g. Alice Johnson"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Email *
          </label>
          <input
            type="email"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
            placeholder="alice@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Phone *
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
            placeholder="+1-555-0199"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Company / Organization
        </label>
        <input
          type="text"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
          placeholder="e.g. Partner Corp"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Govt. ID Type
          </label>
          <select
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
            value={governmentIdType}
            onChange={(e) => setGovernmentIdType(e.target.value)}
          >
            <option value="Aadhaar">Aadhaar</option>
            <option value="Passport">Passport</option>
            <option value="Driving License">Driving License</option>
            <option value="National ID">National ID</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Govt. ID Number
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
            placeholder="ID Number"
            value={governmentIdNumber}
            onChange={(e) => setGovernmentIdNumber(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
          Address / Location
        </label>
        <input
          type="text"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
          placeholder="City, State"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
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
          {isSubmitting ? 'Saving...' : visitorToEdit ? 'Save Changes' : 'Register Visitor'}
        </button>
      </div>
    </form>
  );
}
