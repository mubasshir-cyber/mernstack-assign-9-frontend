import React, { useState, useEffect } from 'react';
import { reportApi } from '../../services/api';
import { FileBarChart, Download, Filter, Calendar, Building, User } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const res = await reportApi.getReports({
        status: statusFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [statusFilter, startDate, endDate]);

  const handleExportCSV = () => {
    const downloadUrl = reportApi.getExportCsvUrl({
      status: statusFilter,
      startDate: startDate || '',
      endDate: endDate || '',
    });
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Visitor Reports & Analytics</h2>
          <p className="text-xs text-slate-500">Filter visit history and export audit records</p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <span className="font-bold text-slate-700">Filters:</span>
        </div>

        <div>
          <select
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">From:</span>
          <input
            type="date"
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">To:</span>
          <input
            type="date"
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {(startDate || endDate || statusFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setStatusFilter('all');
            }}
            className="text-blue-600 hover:underline text-xs font-semibold ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Generating reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No records match the selected date range and filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Visitor</th>
                  <th className="px-6 py-3.5">Host / Dept</th>
                  <th className="px-6 py-3.5">Purpose & Location</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {reports.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{row.visitorName}</p>
                      <p className="text-[10px] text-slate-400">{row.visitorCompany}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{row.hostName}</p>
                      <p className="text-[10px] text-slate-400">{row.hostDepartment}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{row.purpose}</p>
                      <p className="text-[10px] text-slate-400">{row.location}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <p className="font-semibold">{row.date}</p>
                      <p className="text-[10px] text-slate-400">{row.time}</p>
                    </td>

                    <td className="px-6 py-4">
                      <Badge status={row.status} />
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
