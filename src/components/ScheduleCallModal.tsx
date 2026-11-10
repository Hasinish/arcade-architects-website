import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, Check, ArrowUpRight } from 'lucide-react';

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
    time: '03:00 PM (GMT+6)',
    platform: 'Google Meet',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const lenis = (window as any).lenis;
    if (isOpen) {
      lenis?.stop();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      lenis?.start();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
  };

  const timeSlots = [
    '11:00 AM (GMT+6)',
    '02:00 PM (GMT+6)',
    '04:30 PM (GMT+6)',
    '07:00 PM (GMT+6)',
  ];

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[960] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-lg bg-[#161616] text-[#E0E0E0] border border-[#2A2A2A] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#262626] bg-[#141414]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] block mb-1">
              Direct Consultation
            </span>
            <h3 className="font-sans text-lg sm:text-xl font-normal tracking-[-0.5px] text-white">
              Schedule a Discovery Call
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 hover:border-white/40 flex items-center justify-center text-white/70 hover:text-white transition-all bg-white/5 hover:bg-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {scheduled ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-white/30 bg-white/5 flex items-center justify-center text-white mb-6">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-sans text-2xl font-normal tracking-[-0.5px] text-white mb-2">
              Call Booked Successfully
            </h4>
            <p className="font-sans text-xs sm:text-sm text-white/70 max-w-xs mb-8 leading-relaxed font-light">
              Calendar invitation and meeting link sent to{' '}
              <span className="text-white font-medium">{formData.email}</span> for{' '}
              {formData.date || 'your selected date'} at {formData.time}.
            </p>
            <button
              onClick={() => {
                setScheduled(false);
                onClose();
              }}
              className="bloom-btn-wrap bloom-btn-white !h-[48px] !px-8 !text-xs !font-medium"
            >
              <div className="btn-text-track">
                <div className="btn-text-inner">
                  <span className="btn-label">Done</span>
                  <span className="btn-label">Done</span>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSchedule} className="p-6 sm:p-8 space-y-5 overflow-y-auto">
            <p className="font-sans text-xs sm:text-[13px] text-white/60 leading-relaxed font-light">
              Book a 20-minute video or phone consultation with Arcade Architects' creative director to review your floor plans, renders, or project vision.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] text-white placeholder-white/30 text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] mb-1.5">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] text-white placeholder-white/30 text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-white/60" /> Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-3 bg-[#1A1A1A] border border-[#262626] text-white text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-white/60" /> Time Slot *
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-3 bg-[#1A1A1A] border border-[#262626] text-white text-xs focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot} className="bg-[#1A1A1A] text-white">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] mb-1.5 flex items-center gap-1.5">
                  <Video className="w-3 h-3 text-white/60" /> Meeting Format
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {['Google Meet', 'WhatsApp Call'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setFormData({ ...formData, platform: opt })}
                      className={`py-2.5 border text-xs transition-all cursor-pointer ${
                        formData.platform === opt
                          ? 'bg-white text-black font-medium border-white'
                          : 'bg-[#1A1A1A] border-[#262626] text-white/70 hover:border-white/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bloom3D Double-Layer Sliding White Button */}
            <button
              type="submit"
              className="bloom-btn-wrap bloom-btn-white w-full !h-[52px] !text-xs !font-medium mt-3"
            >
              <div className="btn-text-track">
                <div className="btn-text-inner">
                  <span className="btn-label">
                    Confirm 20-Min Architectural Consultation <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                  <span className="btn-label">
                    Confirm 20-Min Architectural Consultation <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
