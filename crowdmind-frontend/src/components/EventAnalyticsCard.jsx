import React from 'react';
import { Activity } from 'lucide-react';

export default function EventAnalyticsCard({ totalStudents, category, price }) {
  return (
    <div className="bg-[#0C0D0E] border border-[#1F2937] rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-5">
          <h2 className="text-base font-bold text-white font-serif">Participation & Engagement Analytics</h2>
          <div className="text-right text-xs">
            <span className="text-gray-400 block">Category: <strong className="text-white">{category}</strong></span>
            <span className="text-gray-400 block">Price: <strong className="text-white">{price}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-white font-serif tracking-tight">
              {totalStudents} <span className="text-lg font-normal text-gray-400 font-sans">Registered</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#FF5500]/10 border border-[#FF5500]/30 px-3 py-1 rounded-full text-xs text-[#FF5500] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse"></span>
              14 browsing now
            </div>
          </div>

          <div className="bg-[#121316] border border-[#1F2937] rounded-xl p-3 text-center space-y-2">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Registration Source</span>
            <div className="w-16 h-16 rounded-full mx-auto relative flex items-center justify-center" style={{
              background: 'conic-gradient(#FF5500 0% 65%, #3B82F6 65% 85%, #6B7280 85% 100%)'
            }}>
              <div className="w-10 h-10 bg-[#121316] rounded-full"></div>
            </div>
          </div>

          <div className="bg-[#121316] border border-[#1F2937] rounded-xl p-3 space-y-2">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Traffic Volume</span>
            <div className="h-16 flex items-end justify-between gap-1 pt-2">
              <svg className="w-full h-12 stroke-[#FF5500] fill-none" viewBox="0 0 100 40">
                <path d="M0,35 Q20,10 40,25 T80,5 T100,20" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Activity size={13} className="text-[#FF5500]" /> Real-time seating synchronized with database
        </span>
        <span className="text-gray-500 font-mono text-[10px]">DB Table: event_seat_allocations</span>
      </div>
    </div>
  );
}
