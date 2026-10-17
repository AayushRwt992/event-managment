import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export default function SeatSelector({ event, onBack, onBookingSuccess }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch already booked seats globally for this event from localStorage
  const [bookedSeatIds, setBookedSeatIds] = useState(() => {
    const allBookings = JSON.parse(localStorage.getItem('crowdmind_bookings') || '{}');
    const eventBookings = allBookings[event.id] || [];
    
    const taken = new Set();
    eventBookings.forEach(booking => {
      booking.seatNumber.split(',').forEach(s => {
        const cleaned = s.trim();
        taken.add(cleaned);
      });
    });
    return taken;
  });

  const rows = ['A', 'B', 'C', 'D'];
  const seatsPerRow = 8;

  const toggleSeat = (seatId) => {
    if (bookedSeatIds.has(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 4) {
        alert('You can reserve a maximum of 4 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const ticketPrice = parseInt((event.price || '1500').replace(/[^0-9]/g, '')) || 499;
  const totalPrice = selectedSeats.length * ticketPrice;

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      const currentUser = JSON.parse(
        localStorage.getItem('crowdmind_current_user') || 
        '{"name": "Student User", "email": "student@crowdmind.ai", "role": "Student Attendee"}'
      );

      const seatString = selectedSeats.join(', ');
      const newBookingEntry = {
        id: Date.now().toString(),
        seatNumber: seatString,
        studentName: currentUser.name || 'Registered Student',
        roleTitle: currentUser.role || 'Student Attendee',
        email: currentUser.email || 'student@crowdmind.ai',
        timestamp: new Date().toLocaleString(),
        status: 'Confirmed',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      };

      // 1. Save to Global Event Bookings Database
      const allBookings = JSON.parse(localStorage.getItem('crowdmind_bookings') || '{}');
      const eventBookings = allBookings[event.id] || [];
      allBookings[event.id] = [newBookingEntry, ...eventBookings];
      localStorage.setItem('crowdmind_bookings', JSON.stringify(allBookings));

      // 2. Save to Registered Users Database
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users_db') || '[]');
      if (!registeredUsers.some(u => u.email === currentUser.email)) {
        registeredUsers.push({
          id: Date.now(),
          name: currentUser.name,
          email: currentUser.email,
          createdAt: new Date().toLocaleDateString()
        });
        localStorage.setItem('registered_users_db', JSON.stringify(registeredUsers));
      }

      setShowPaymentModal(false);
      onBookingSuccess(selectedSeats, totalPrice);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-6 md:p-10 font-sans selection:bg-[#FF5500] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-medium text-gray-300 hover:text-white bg-[#0C0D0E] border border-[#2D3139] px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft size={15} /> Back to Events
          </button>
          <span className="text-xs text-gray-400 font-serif">
            Booking for: <strong className="text-white">{event.title}</strong>
          </span>
        </div>

        {/* Seat Layout Container */}
        <div className="bg-[#0C0D0E] border border-[#1F2937] rounded-2xl p-6 md:p-8 shadow-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white font-serif mb-1">Select Your Seating Assignment</h2>
            <p className="text-xs text-gray-400">Reserved seats by other users are locked automatically.</p>
          </div>

          <div className="w-full bg-[#121316] border border-[#2D3139] py-2 rounded-xl text-center text-[11px] font-semibold text-gray-400 tracking-widest uppercase shadow-inner">
            Stage / Screen Direction
          </div>

          <div className="space-y-4 py-4">
            {rows.map((row) => (
              <div key={row} className="flex items-center justify-center gap-3">
                <span className="w-6 text-xs font-bold text-[#FF5500] font-mono">Row {row}</span>
                <div className="flex gap-2.5">
                  {Array.from({ length: seatsPerRow }, (_, i) => {
                    const seatId = `${row}-${i + 1}`;
                    const isBookedByOthers = bookedSeatIds.has(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <button
                        key={seatId}
                        disabled={isBookedByOthers}
                        onClick={() => toggleSeat(seatId)}
                        className={`w-9 h-9 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center border ${
                          isBookedByOthers
                            ? 'bg-red-950/30 border-red-900/40 text-red-700 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-[#FF5500] border-[#FF5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)] scale-105'
                            : 'bg-[#121316] border-[#2D3139] text-gray-300 hover:border-[#FF5500]/50 hover:bg-[#1a1c23]'
                        }`}
                        title={isBookedByOthers ? 'Seat already reserved' : `Seat ${seatId}`}
                      >
                        {row}{i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400 pt-2 border-t border-[#16181D]">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-lg bg-[#121316] border border-[#2D3139]"></div> Available
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-lg bg-[#FF5500] shadow-[0_0_8px_#FF5500]"></div> Selected
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-lg bg-red-950 border border-red-900"></div> Booked / Taken
            </div>
          </div>
        </div>

        {/* Summary Footer Bar */}
        <div className="bg-[#0C0D0E] border border-[#1F2937] rounded-2xl p-5 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs text-gray-400 block">Selected Seats ({selectedSeats.length}):</span>
            <span className="text-sm font-bold text-white font-mono">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 block">Total Amount:</span>
            <span className="text-lg font-bold text-[#FF5500] font-serif">₹{totalPrice}</span>
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0}
            className={`px-6 py-2.5 rounded-xl text-xs font-medium transition-all ${
              selectedSeats.length > 0
                ? 'bg-[#FF5500] hover:bg-[#FF6611] text-white shadow-[0_0_15px_rgba(255,85,0,0.3)]'
                : 'bg-[#16181D] text-gray-500 cursor-not-allowed border border-[#2D3139]'
            }`}
          >
            Proceed to Payment
          </button>
        </div>

      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C0D0E] border border-[#1F2937] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <CreditCard size={18} className="text-[#FF5500]" /> Sandbox Payment Gateway
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#121316] border border-[#2D3139] p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Event:</span>
                  <span className="text-white font-medium">{event.title}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Seats:</span>
                  <span className="text-white font-mono font-bold">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between text-gray-400 border-t border-[#1F2937] pt-2">
                  <span>Total Payable:</span>
                  <span className="text-[#FF5500] font-bold">₹{totalPrice}</span>
                </div>
              </div>

              <div className="p-3 bg-purple-950/30 border border-purple-800/50 rounded-xl text-purple-300 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400 shrink-0" />
                <span>Simulated UPI / Credit Card test mode active.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2937]">
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl text-xs bg-[#121316] hover:bg-[#1F2937] border border-[#2D3139] text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#FF5500] hover:bg-[#FF6611] text-white shadow-[0_0_15px_rgba(255,85,0,0.3)] flex items-center gap-2"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${totalPrice}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}