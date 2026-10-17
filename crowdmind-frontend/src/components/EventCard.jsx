import React from 'react';
import { MapPin, Calendar, Edit3, Trash2, Users, Activity } from 'lucide-react';

export default function EventCard({ event, isAdmin, onEdit, onDelete, onBook }) {
  return (
    <div className="bg-[#0C0D0E] border border-[#1F2937] hover:border-[#FF5500]/50 rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-xl relative">
      <div>
        {/* Top Badges: Category & Live Count */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold bg-[#16181D] text-gray-300 border border-[#2D3139] px-2.5 py-1 rounded-lg">
            {event.category}
          </span>
          <div className="flex items-center gap-1.5 bg-[#FF5500]/10 border border-[#FF5500]/30 px-2.5 py-0.5 rounded-full text-[10px] text-[#FF5500] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-ping"></span>
            <Activity size={11} /> {event.liveCount || Math.floor(Math.random() * 40 + 10)} browsing now
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#FF5500] transition-colors font-serif">
          {event.title}
        </h3>

        {/* Short Paragraph Description */}
        <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {event.description || 'Join key industry pioneers and tech experts for an immersive live experience and deep technical keynotes.'}
        </p>

        {/* Speaker / Author Section */}
        {event.author && (
          <div className="flex items-center gap-2.5 mb-4 p-2 rounded-xl bg-[#121316] border border-[#1F2937]">
            <img 
              src={event.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
              alt={event.author.name}
              className="w-7 h-7 rounded-full object-cover border border-[#FF5500]/50" 
            />
            <div>
              <span className="text-[11px] font-medium text-white block">{event.author.name}</span>
              <span className="text-[9px] text-gray-400">{event.author.title || 'Keynote Speaker'}</span>
            </div>
          </div>
        )}

        {/* Date & Location */}
        <div className="space-y-1 mb-4 text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-gray-500" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-gray-500" />
            <span>{event.date}</span>
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 border-t border-[#16181D] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white block">{event.price}</span>
          <span className="text-[9px] text-gray-500">{event.seatsLeft || 'Seats Available'}</span>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(event)}
              className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/40 text-purple-300 hover:text-white text-xs transition-colors"
              title="Edit Event"
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-600 border border-red-900/60 text-red-300 hover:text-white text-xs transition-colors"
              title="Delete Event"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onBook(event)}
            className="bg-[#FF5500] hover:bg-[#FF6611] text-white px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shadow-[0_0_12px_rgba(255,85,0,0.25)]"
          >
            Book Seat
          </button>
        )}
      </div>
    </div>
  );
}