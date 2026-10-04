import React, { useState, useEffect } from 'react';
import { checklogApi } from '../../services/api';
import { History, LogIn, LogOut, Calendar, User, MapPin } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function CheckLogs() {
  const [logs, setLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const res = await checklogApi.getLogs({ action: actionFilter });
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load check logs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Security Check-In / Check-Out Logs</h2>
          <p className="text-xs text-slate-500">Real-time audit log of all visitor entries and exits</p>
        </div>

        <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-semibold text-slate-600 gap-1">
          {['all', 'CHECK_IN', 'CHECK_OUT'].map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                actionFilter === act ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              {act === 'all' ? 'All Logs' : act.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No check logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Action</th>
                  <th className="px-6 py-3.5">Visitor</th>
                  <th className="px-6 py-3.5">Pass Number</th>
                  <th className="px-6 py-3.5">Scanned By / Location</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          log.action === 'CHECK_IN'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {log.action === 'CHECK_IN' ? <LogIn size={13} /> : <LogOut size={13} />}
                        <span>{log.action.replace('_', ' ')}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">
                        {log.visitor?.fullName || 'N/A'}
                      </p>
                      <p className="text-[10px] text-slate-400">{log.visitor?.company || 'Individual'}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-blue-600">
                        {log.pass?.passNumber || 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-4 space-y-0.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-slate-400" />
                        <span>{log.scannedBy?.name || 'Security Officer'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <MapPin size={12} />
                        <span>{log.location || 'Main Gate'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
