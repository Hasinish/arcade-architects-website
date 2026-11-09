import React, { useState } from 'react';
import { X, Calendar, Clock, PhoneCall, CheckCircle, Video } from 'lucide-react';

interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleCallModal: React.FC<ScheduleCallModalProps> = ({ isOpen, onClose }) => {
  const [scheduled, setScheduled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '03:00 PM',
    platform: 'Google Meet',
  });

  if (!isOpen) return null;

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
  };

  const timeSlots = ['11:00 AM', '02:00 PM', '04:30 PM', '07:00 PM'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#141417] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#16161a]">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-[#e45d36]" />
            <h3 className="font-display text-lg font-bold text-white">
              Schedule a Discovery Call
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {scheduled ? (
          <div className="p-8 sm:p-10 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#e45d36]/20 border border-[#e45d36]/40 flex items-center justify-center text-[#e45d36] mb-5">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="font-display text-xl font-bold text-white mb-2">
              Call Booked Successfully!
            </h4>
            <p className="text-xs text-white/60 max-w-xs mb-6">
              Calendar invitation and meeting link sent to <span className="text-white font-medium">{formData.email}</span> for {formData.date || 'your selected date'} at {formData.time}.
            </p>
            <button
              onClick={() => {
                setScheduled(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSchedule} className="p-6 sm:p-8 space-y-5">
            <p className="text-xs text-white/60">
              Book a 20-minute video or phone consultation with Arcade Architects' creative director to review your floor plans, renders, or project vision.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#e45d36]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#e45d36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#e45d36]" /> Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#e45d36]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#e45d36]" /> Time Slot
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1d1d22] border border-white/10 text-white text-xs focus:outline-none focus:border-[#e45d36]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1 flex items-center gap-1">
                  <Video className="w-3 h-3 text-[#e45d36]" /> Meeting Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Google Meet', 'WhatsApp Call'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setFormData({ ...formData, platform: opt })}
                      className={`py-2 rounded-xl text-xs font-medium border ${
                        formData.platform === opt
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/5 border-white/5 text-white/70'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#e45d36] hover:bg-[#f16d47] text-white font-semibold text-xs tracking-wide uppercase shadow-lg shadow-[#e45d36]/25 transition-all mt-4"
            >
              Confirm 20-Min Call
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

