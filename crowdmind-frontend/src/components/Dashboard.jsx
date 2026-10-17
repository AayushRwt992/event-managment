import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

export default function Dashboard({ role, onLogout }) {
  const isAdmin = role === 'admin';

  // Initial Events State with persistent localStorage
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('crowdmind_events');
    if (savedEvents) {
      try { return JSON.parse(savedEvents); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 1,
        title: 'Neural Summit 2026',
        category: 'AI Conferences',
        description: 'A cornerstone AI conference bringing together global leaders to discuss neural network advancements and practical applications.',
        location: 'Bharat Mandapam, New Delhi',
        date: 'Sat, 18 Oct · 10:00 AM',
        price: '₹1,499 onwards',
        seatsLeft: '38 seats left',
        liveCount: 42,
        author: { name: 'Dr. Sarah Lin', title: 'Head of AI Research', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' }
      },
      {
        id: 2,
        title: 'LLMs in Production',
        category: 'AI Conferences',
        description: 'Focuses on deploying, scaling, and optimizing Large Language Models for enterprise production workflows.',
        location: 'NIMHANS Centre, Bengaluru',
        date: 'Fri, 24 Oct · 9:30 AM',
        price: '₹1,899 onwards',
        seatsLeft: '12 seats left',
        liveCount: 19,
        author: { name: 'Alex Rivera', title: 'Principal LLM Engineer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
      },
      {
        id: 3,
        title: 'React Delhi Meetup #42',
        category: 'Tech Meetups',
        description: 'Monthly gathering of React engineers discussing Server Components, Next.js 15, and state management patterns.',
        location: '91springboard, Gurugram',
        date: 'Sun, 26 Oct · 5:00 PM',
        price: '₹199 onwards',
        seatsLeft: '45 seats left',
        liveCount: 28,
        author: { name: 'Rohan Sharma', title: 'Frontend Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
      },
      {
        id: 4,
        title: 'Global AI Hackathon 2026',
        category: 'Hackathons',
        description: '48-hour continuous hackathon building agentic workflows with grand prizes worth $25,000.',
        location: 'T-Hub, Hyderabad',
        date: 'Fri, 07 Nov · 6:00 PM',
        price: 'Free Entry',
        seatsLeft: '15 seats left',
        liveCount: 65,
        author: { name: 'Priya Verma', title: 'Community Manager', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('crowdmind_events', JSON.stringify(events));
  }, [events]);

  if (isAdmin) {
    return <AdminDashboard events={events} setEvents={setEvents} onLogout={onLogout} />;
  }

  return <UserDashboard events={events} onLogout={onLogout} />;
}