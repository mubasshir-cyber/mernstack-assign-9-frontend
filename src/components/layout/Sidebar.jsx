import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  QrCode,
  History,
  FileBarChart,
  UserCheck,
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'SECURITY', 'EMPLOYEE', 'VISITOR'],
    },
    {
      label: 'Visitors',
      path: '/visitors',
      icon: Users,
      roles: ['ADMIN', 'SECURITY', 'EMPLOYEE'],
    },
    {
      label: 'Appointments',
      path: '/appointments',
      icon: CalendarCheck,
      roles: ['ADMIN', 'SECURITY', 'EMPLOYEE', 'VISITOR'],
    },
    {
      label: 'Visitor Passes',
      path: '/passes',
      icon: CreditCard,
      roles: ['ADMIN', 'SECURITY', 'EMPLOYEE', 'VISITOR'],
    },
    {
      label: 'QR Scanner',
      path: '/scanner',
      icon: QrCode,
      roles: ['ADMIN', 'SECURITY'],
    },
    {
      label: 'Check Logs',
      path: '/checklogs',
      icon: History,
      roles: ['ADMIN', 'SECURITY'],
    },
    {
      label: 'Reports & Export',
      path: '/reports',
      icon: FileBarChart,
      roles: ['ADMIN', 'SECURITY'],
    },
    {
      label: 'Manage Users',
      path: '/users',
      icon: UserCheck,
      roles: ['ADMIN'],
    },
  ];

  const allowedNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {allowedNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
        <p className="text-[11px] font-bold text-slate-700">Assignment 9</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Visitor Pass System (MERN)</p>
      </div>
    </aside>
  );
}
