import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  Users,
  UserCheck,
  Clock,
  CreditCard,
  QrCode,
  CalendarPlus,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await reportApi.getDashboardStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wider uppercase">
            {user?.role} Portal
          </span>
          <h1 className="text-2xl font-bold mt-2">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-blue-100 mt-1">
            TaskMaster Visitor Management & Pass Authorization System
          </p>
        </div>

        <div className="flex gap-2">
          {user?.role === 'SECURITY' && (
            <Link
              to="/scanner"
              className="px-4 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 text-xs font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <QrCode size={16} />
              <span>Quick Scan</span>
            </Link>
          )}

          {['ADMIN', 'EMPLOYEE'].includes(user?.role) && (
            <Link
              to="/appointments"
              className="px-4 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 text-xs font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <CalendarPlus size={16} />
              <span>New Appointment</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value={stats?.totalVisitors ?? '...'}
          icon={Users}
          color="blue"
          subtitle="Registered in system"
        />

        <StatCard
          title="Currently Inside"
          value={stats?.currentlyInside ?? '0'}
          icon={UserCheck}
          color="green"
          subtitle="Checked in now"
        />

        <StatCard
          title="Pending Appointments"
          value={stats?.pendingAppointments ?? '0'}
          icon={Clock}
          color="amber"
          subtitle="Awaiting authorization"
        />

        <StatCard
          title="Active Passes"
          value={stats?.activePasses ?? '0'}
          icon={CreditCard}
          color="purple"
          subtitle="Ready for entry"
        />
      </div>

      {/* Status Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown Bar */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              <span>Appointment & Entry Summary</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Real-time counts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <p className="text-xs text-emerald-700 font-semibold uppercase">Approved</p>
              <p className="text-xl font-bold text-emerald-800 mt-1">
                {stats?.statusBreakdown?.approved ?? 0}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
              <p className="text-xs text-amber-700 font-semibold uppercase">Pending</p>
              <p className="text-xl font-bold text-amber-800 mt-1">
                {stats?.statusBreakdown?.pending ?? 0}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-center">
              <p className="text-xs text-rose-700 font-semibold uppercase">Rejected</p>
              <p className="text-xl font-bold text-rose-800 mt-1">
                {stats?.statusBreakdown?.rejected ?? 0}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
              <p className="text-xs text-blue-700 font-semibold uppercase">Today Check-Ins</p>
              <p className="text-xl font-bold text-blue-800 mt-1">
                {stats?.todayCheckIns ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Navigation</h3>
            <div className="space-y-2">
              <Link
                to="/visitors"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-semibold text-slate-700"
              >
                <span>View All Visitors</span>
                <ArrowUpRight size={15} className="text-slate-400" />
              </Link>

              <Link
                to="/passes"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-semibold text-slate-700"
              >
                <span>Issued Passes & QR Badges</span>
                <ArrowUpRight size={15} className="text-slate-400" />
              </Link>

              {['ADMIN', 'SECURITY'].includes(user?.role) && (
                <Link
                  to="/reports"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-semibold text-slate-700"
                >
                  <span>Export Reports (CSV)</span>
                  <ArrowUpRight size={15} className="text-slate-400" />
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-medium">
              TaskMaster Enterprise • Security Level 1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
