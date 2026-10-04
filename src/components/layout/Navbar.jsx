import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';
import Badge from '../common/Badge';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-none">TaskMaster Pass</h1>
            <p className="text-[10px] text-slate-400 font-medium">Visitor Management System</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{user.name}</p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <Badge status={user.role} />
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold border border-slate-200">
              <User size={18} />
            </div>

            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
