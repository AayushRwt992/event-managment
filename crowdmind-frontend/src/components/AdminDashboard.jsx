import React, { useState } from 'react';
import Navbar from './Navbar';
import UserDirectory from './UserDirectory';
import EventCard from './EventCard';
import EventDetailView from './EventDetailView';
import { ShieldCheck, X } from 'lucide-react';

export default function AdminDashboard({ events, setEvents, onLogout }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);

  // Form State for Creation
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI Conferences');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');

  const handleOpenCreate = () => {
    setTitle('');
    setCategory('AI Conferences');
    setDescription('');
    setAuthorName('');
    setAuthorTitle('');
    setLocation('');
    setDate('');
    setPrice('');
    setShowCreateModal(true);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedList = events.filter(ev => ev.id !== id);
      setEvents(updatedList);
      setSelectedEventForDetail(null);
    }
  };

  const handleUpdateEvent = (updatedEvent) => {
    const updatedList = events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev);
    setEvents(updatedList);
    setSelectedEventForDetail(updatedEvent);
  };

  const handleSaveNewEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      title,
      category,
      description,
      location,
      date,
      price: price ? `₹${price} onwards` : 'Free Entry',
      seatsLeft: '50 seats left',
      liveCount: Math.floor(Math.random() * 30 + 10),
      author: {
        name: authorName || 'Event Host',
        title: authorTitle || 'Speaker',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      }
    };
    setEvents([newEvent, ...events]);
    setShowCreateModal(false);
  };

  if (selectedEventForDetail) {
    return (
      <EventDetailView
        event={selectedEventForDetail}
        onBack={() => setSelectedEventForDetail(null)}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    );
  }

  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = activeCategory === 'All' 
    ? ['AI Conferences', 'Tech Meetups', 'Hackathons', 'Live Shows']
    : [activeCategory];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      <Navbar
        isAdmin={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenCreate={handleOpenCreate}
        onOpenUsers={() => setShowUsersModal(true)}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-serif">
            System Event Management<br />
            <span className="text-gray-400">Publish, organize, and manage live session allocations.</span>
          </h1>
          <p className="text-xs text-gray-400">Categorized live sessions and developer conferences in {selectedCity}.</p>
        </div>

        {categories.map((cat) => {
          const categoryEvents = filteredEvents.filter(e => e.category === cat);
          if (categoryEvents.length === 0 && activeCategory !== 'All') return null;

          return (
            <div key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-bold text-[#FF5500] uppercase tracking-wider">{cat}</h2>
                <div className="h-[1px] bg-[#1F2937] flex-1"></div>
              </div>

              {categoryEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isAdmin={true}
                      onEdit={(ev) => setSelectedEventForDetail(ev)}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic py-2">No events currently available under {cat}.</p>
              )}
            </div>
          );
        })}
      </main>

      {showUsersModal && <UserDirectory onClose={() => setShowUsersModal(false)} />}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C0D0E] border border-[#1F2937] rounded-2xl p-6 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#1A1C23]">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 font-serif">
                <ShieldCheck size={18} className="text-purple-400" /> Publish New Event
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveNewEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Engineers Summit"
                  className="w-full bg-[#121316] border border-[#1F2937] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#121316] border border-[#1F2937] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                >
                  <option value="AI Conferences">AI Conferences</option>
                  <option value="Tech Meetups">Tech Meetups</option>
                  <option value="Hackathons">Hackathons</option>
                  <option value="Live Shows">Live Shows</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview paragraph..."
                  className="w-full bg-[#121316] border border-[#1F2937] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Speaker Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Lin"
                    className="w-full bg-[#121316] border border-[#1F2937] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Speaker Title</label>
                  <input
                    type="text"
                    value={authorTitle}
                    onChange={(e) => setAuthorTitle(e.target.value)}
                    placeholder="e.g. Head of AI"
                    className="w-full bg-[#121316] border border-[#1F2937] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Location / Venue</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Cyber City, Gurugram"
                  className="w-full bg-[#121316] border border-[#1F2937] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Date & Time</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Sat, 15 Nov · 11:00 AM"
                    className="w-full bg-[#121316] border border-[#1F2937] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0 for Free"
                    className="w-full bg-[#121316] border border-[#1F2937] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#FF5500] hover:bg-[#FF6611] text-white font-medium py-2.5 rounded-xl transition-colors shadow-[0_0_15px_rgba(255,85,0,0.3)]"
              >
                Publish Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}