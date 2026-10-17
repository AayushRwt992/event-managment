import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Menu, X, MapPin, User, LogOut, ShieldCheck, Sparkles, Users } from 'lucide-react';

export default function Navbar({
  isAdmin,
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  activeCategory,
  setActiveCategory,
  onOpenCreate,
  onOpenUsers,
  onLogout
}) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);

  return (
    <header className="bg-[#0c0d0e] border-b border-[#1f2937] px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-3 h-3 rounded-full bg-[#FF5500] shadow-[0_0_12px_#FF5500]"></div>
          <span className="font-bold text-white text-base tracking-wide font-serif">CrowdMind AI</span>
          {isAdmin && (
            <span className="hidden sm:flex items-center gap-1 bg-purple-950/60 border border-purple-800 text-purple-300 text-[10px] font-medium px-2 py-0.5 rounded-full ml-1">
              <ShieldCheck size={11} className="text-purple-400" /> Admin
            </span>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={15} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, topics, speakers..."
            className="w-full bg-[#121316] border border-[#2d3139] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF5500] placeholder:text-gray-500 transition-colors"
          />
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-transparent hover:border-[#2d3139] transition-all"
            >
              <MapPin size={13} className="text-[#FF5500]" />
              <span>{selectedCity}</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>

            {showCityDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-[#121316] border border-[#2d3139] rounded-xl shadow-2xl py-2 z-50">
                {['Hyderabad', 'Bengaluru', 'Delhi-NCR', 'Mumbai', 'Chennai'].map((city) => (
                  <button
                    key={city}
                    onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-[#1f2937] hover:text-white transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={onOpenCreate}
              className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-600/30"
            >
              <Plus size={14} /> Create Event
            </button>
          )}

          <button 
            onClick={() => setShowMenuDrawer(true)}
            className="text-gray-300 hover:text-white p-2 rounded-xl bg-[#121316] border border-[#2d3139] hover:bg-[#1f2937] transition-all"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Category Strip */}
      <div className="max-w-7xl mx-auto mt-3 pt-2.5 border-t border-[#16181D] flex items-center justify-between text-xs text-gray-400 overflow-x-auto">
        <div className="flex items-center gap-6 whitespace-nowrap">
          {['All', 'AI Conferences', 'Tech Meetups', 'Hackathons', 'Live Shows'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`transition-colors font-medium pb-1 ${
                activeCategory === cat ? 'text-[#FF5500] border-b-2 border-[#FF5500]' : 'hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-5 whitespace-nowrap pl-4 text-[11px]">
          <span className="hover:text-gray-200 cursor-pointer flex items-center gap-1"><Sparkles size={12} className="text-[#FF5500]" /> Featured Events</span>
          <span className="hover:text-gray-200 cursor-pointer flex items-center gap-1"><MapPin size={12} /> Venue Locations</span>
        </div>
      </div>

      {/* Drawer Overlay - Removed "My Booked Tickets" */}
      {showMenuDrawer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-80 bg-[#0C0D0E] border-l border-[#1F2937] h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1F2937]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500]"></div>
                  <span className="font-bold text-white text-sm font-serif">CrowdMind Navigation</span>
                </div>
                <button 
                  onClick={() => setShowMenuDrawer(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1f2937]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {isAdmin && (
                  <button 
                    onClick={() => { setShowMenuDrawer(false); if (onOpenUsers) onOpenUsers(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 text-white font-medium hover:bg-[#FF5500]/20 transition-all"
                  >
                    <Users size={16} className="text-[#FF5500]" /> Registered Students
                  </button>
                )}

                <button 
                  onClick={() => setShowMenuDrawer(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-[#121316]"
                >
                  <User size={16} /> Account Profile
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1F2937]">
              <button
                onClick={() => { setShowMenuDrawer(false); onLogout(); }}
                className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-300 font-medium py-2.5 rounded-xl text-xs transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}