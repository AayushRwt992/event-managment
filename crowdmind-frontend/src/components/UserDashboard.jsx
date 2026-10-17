import React, { useState } from 'react';
import Navbar from './Navbar';
import EventCard from './EventCard';
import SeatSelector from './SeatSelector';

export default function UserDashboard({ events, onLogout }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

  if (selectedEventForBooking) {
    return (
      <SeatSelector
        event={selectedEventForBooking}
        onBack={() => setSelectedEventForBooking(null)}
        onBookingSuccess={(seats, total) => {
          alert(`Successfully reserved seats (${seats.join(', ')}) for ₹${total}!`);
          setSelectedEventForBooking(null);
        }}
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
        isAdmin={false}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-serif">
            Good to see you.<br />
            <span className="text-gray-400">Pick your next room in {selectedCity}.</span>
          </h1>
          <p className="text-xs text-gray-400">Conferences, meetups, and hackathons tailored for developers.</p>
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
                      isAdmin={false}
                      onBook={(ev) => setSelectedEventForBooking(ev)}
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
    </div>
  );
}