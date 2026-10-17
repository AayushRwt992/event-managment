import React, { useState } from 'react';
import { MapPin, Calendar, Trash2 } from 'lucide-react';

export default function EventMetadataForm({ event, onUpdateEvent, onDeleteEvent }) {
  const [title, setTitle] = useState(event.title || 'Pledge');
  const [description, setDescription] = useState(event.description || '');
  const [location, setLocation] = useState(event.location || 'Dehradun');
  const [date, setDate] = useState(event.date || '11:00 AM');
  const [category, setCategory] = useState(event.category || 'AI Conferences');

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateEvent({ ...event, title, description, location, date, category });
    alert('Event metadata updated successfully!');
  };

  return (
    <div className="bg-[#0C0D0E] border border-[#1F2937] rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
      <div>
        <h2 className="text-base font-bold text-white mb-4 border-b border-[#1F2937] pb-3 font-serif flex items-center justify-between">
          <span>Metadata & Information</span>
          <span className="text-[10px] text-gray-500 font-normal">ID: #{event.id}</span>
        </h2>

        <form id="metaForm" onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 font-medium mb-1.5">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#121316] border border-[#2D3139] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1.5">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#121316] border border-[#2D3139] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#121316] border border-[#2D3139] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF5500]"
            >
              <option value="AI Conferences">AI Conferences</option>
              <option value="Tech Meetups">Tech Meetups</option>
              <option value="Hackathons">Hackathons</option>
              <option value="Live Shows">Live Shows</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-medium mb-1.5">Location</label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#121316] border border-[#2D3139] rounded-xl pl-8 pr-3 py-2.5 text-white focus:outline-none focus:border-[#FF5500]"
                />
                <MapPin size={13} className="absolute left-2.5 top-3 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-medium mb-1.5">Date & Time</label>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#121316] border border-[#2D3139] rounded-xl pl-8 pr-3 py-2.5 text-white focus:outline-none focus:border-[#FF5500]"
                />
                <Calendar size={13} className="absolute left-2.5 top-3 text-gray-500" />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="pt-6 border-t border-[#1F2937] mt-6 flex items-center justify-between">
        <button
          type="submit"
          form="metaForm"
          className="bg-[#FF5500] hover:bg-[#FF6611] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,85,0,0.3)]"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => { if (window.confirm('Delete event?')) onDeleteEvent(event.id); }}
          className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-300 text-xs font-medium px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
        >
          <Trash2 size={13} /> Delete Event
        </button>
      </div>
    </div>
  );
}