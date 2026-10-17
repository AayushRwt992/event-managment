import React, { useState } from 'react';
import { Users, Search, CheckCircle2, ShieldCheck, Clock, Check, ChevronDown } from 'lucide-react';

export default function EventSeatingTable({ seats, onStatusChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);

  const filteredSeats = seats.filter(s => 
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.seatNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0C0D0E] border border-[#1F2937] rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1F2937]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif">
            <Users size={18} className="text-[#FF5500]" /> Row-Wise Seating & Student Allocations
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Inspect row seat assignments, attendee details, and manage ticket status.</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or seat..."
            className="w-full bg-[#121316] border border-[#2D3139] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5500]"
          />
          <Search size={13} className="absolute left-2.5 top-2.5 text-gray-500" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1F2937] text-gray-400 font-medium">
              <th className="pb-3 pl-2">Row & Seat Number</th>
              <th className="pb-3">Participant Details</th>
              <th className="pb-3">Email Address</th>
              <th className="pb-3">Reservation Timestamp</th>
              <th className="pb-3 text-right pr-4">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16181D]">
            {filteredSeats.map((seat) => (
              <tr key={seat.id} className="hover:bg-[#121316]/80 transition-colors">
                <td className="py-3.5 pl-2 font-mono font-semibold text-[#FF5500]">{seat.seatNumber}</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <img src={seat.avatar} alt={seat.studentName} className="w-7 h-7 rounded-full object-cover border border-[#2D3139]" />
                    <div>
                      <span className="font-semibold text-white block leading-tight">{seat.studentName}</span>
                      <span className="text-[10px] text-gray-500">{seat.roleTitle}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 text-gray-300">
                  <span className="flex items-center gap-1.5">{seat.email} <CheckCircle2 size={12} className="text-emerald-500" /></span>
                </td>
                <td className="py-3.5 text-gray-400 font-mono text-[11px]">{seat.timestamp}</td>
                <td className="py-3.5 text-right pr-4 relative">
                  <div className="inline-flex items-center gap-2">
                    {seat.status === 'Confirmed' && (
                      <span className="inline-flex items-center gap-1 bg-emerald-950/50 border border-emerald-800 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-semibold">
                        <Check size={11} /> Confirmed
                      </span>
                    )}
                    {seat.status === 'Pending Payment' && (
                      <span className="inline-flex items-center gap-1 bg-amber-950/50 border border-amber-800 text-amber-300 px-3 py-1 rounded-full text-[10px] font-semibold">
                        <Clock size={11} /> Pending Payment
                      </span>
                    )}
                    {seat.status === 'Entry Verified' && (
                      <span className="inline-flex items-center gap-1 bg-purple-950/50 border border-purple-800 text-purple-300 px-3 py-1 rounded-full text-[10px] font-semibold">
                        <ShieldCheck size={11} /> Entry Verified
                      </span>
                    )}

                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === seat.id ? null : seat.id)}
                        className="p-1 rounded-lg bg-[#121316] hover:bg-[#1F2937] border border-[#2D3139] text-gray-300 hover:text-white"
                      >
                        <ChevronDown size={14} />
                      </button>

                      {activeMenuId === seat.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-[#121316] border border-[#2D3139] rounded-xl shadow-2xl py-1.5 z-50 text-left text-xs">
                          <button onClick={() => { onStatusChange(seat.id, 'Confirmed'); setActiveMenuId(null); }} className="w-full px-3 py-1.5 text-left text-gray-300 hover:bg-[#1F2937]">Mark Confirmed</button>
                          <button onClick={() => { onStatusChange(seat.id, 'Entry Verified'); setActiveMenuId(null); }} className="w-full px-3 py-1.5 text-left text-gray-300 hover:bg-[#1F2937]">Verify Entry</button>
                          <button onClick={() => { onStatusChange(seat.id, 'Pending Payment'); setActiveMenuId(null); }} className="w-full px-3 py-1.5 text-left text-amber-400 hover:bg-[#1F2937]">Set Pending</button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}