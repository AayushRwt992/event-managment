import React from 'react';
import { Users } from 'lucide-react';

export default function UserDirectory() {
  const storedUsers = JSON.parse(localStorage.getItem('registered_users_db') || '[]');
  const totalUsersCount = storedUsers.length + 1; // Includes default demo user

  return (
    <div className="mb-8 space-y-6">
      {/* Admin Analytics Summary Banner */}
      <div className="bg-gradient-to-r from-[#FF5500]/10 via-[#0C0D0E] to-[#0C0D0E] border border-[#FF5500]/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF5500]/20 border border-[#FF5500]/40 rounded-xl flex items-center justify-center text-[#FF5500]">
            <Users size={24} />
          </div>
          <div>
            <span className="text-[11px] text-[#FF5500] font-medium tracking-wider uppercase">Database User Analytics</span>
            <h2 className="text-2xl font-bold text-white">
              {totalUsersCount} Registered {totalUsersCount === 1 ? 'User' : 'Users'}
            </h2>
          </div>
        </div>
        <div className="text-xs text-gray-400 bg-[#121316] border border-[#1F2937] px-4 py-2.5 rounded-xl">
          Active Admin Session: <span className="text-white font-medium">admin@crowdmind.ai</span>
        </div>
      </div>

      {/* User Directory List */}
      <div className="bg-[#0C0D0E] border border-[#1F2937] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={16} className="text-[#FF5500]" /> Registered Users Directory
        </h3>
        <div className="divide-y divide-[#16181D]">
          {/* Default User */}
          <div className="py-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-medium text-white block">Demo User</span>
              <span className="text-gray-500">user@crowdmind.ai</span>
            </div>
            <span className="bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/30 px-2.5 py-0.5 rounded-full text-[10px]">
              Default
            </span>
          </div>

          {/* Dynamically Registered Users */}
          {storedUsers.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-medium text-white block">{u.name}</span>
                <span className="text-gray-500">{u.email}</span>
              </div>
              <span className="text-gray-400 bg-[#16181D] border border-[#2D3139] px-2.5 py-0.5 rounded-full text-[10px]">
                {u.createdAt || 'Just now'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}