import React from 'react';

export default function Badge({ status, type = 'status' }) {
  const statusLower = String(status || '').toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['approved', 'active', 'completed', 'check_in'].includes(statusLower)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['pending', 'check_out'].includes(statusLower)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['rejected', 'cancelled', 'expired', 'revoked'].includes(statusLower)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (statusLower === 'admin') {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (statusLower === 'security') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (statusLower === 'employee') {
    colorClasses = 'bg-teal-50 text-teal-700 border-teal-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}
    >
      {String(status || '').toUpperCase()}
    </span>
  );
}
