import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Send, Sparkles, Building, Palette, Store, Box } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledProject?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, prefilledProject }) => {
  const [projectType, setProjectType] = useState('exterior');
  const [budget, setBudget] = useState('$5k - $15k');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledProject) {
      setFormData((prev) => ({
        ...prev,
        details: `I am interested in discussing a project similar to: ${prefilledProject}`,
      }));
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, prefilledProject, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e45d36', '#ffffff', '#ffd166'],
      });
    } catch {
      // ignore
    }
  };

  const projectTypes = [
    { id: 'exterior', label: 'Exterior Architecture', icon: Building },
    { id: 'interior', label: 'Interior Design', icon: Palette },
    { id: 'exhibition', label: 'Exhibition / Pavilion', icon: Store },
    { id: 'visualization', label: '3D Render / Animation', icon: Box },
  ];

  const budgetOptions = ['Under $5,000', '$5k - $15,000', '$15k - $50,000', '$50,000+'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#141417] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#16161a]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#e45d36]" />
            <h3 className="font-display text-lg font-bold text-white">
              Discuss Your Project With Arcade Architects
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#e45d36]/20 border border-[#e45d36]/40 flex items-center justify-center text-[#e45d36] mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-display text-2xl font-bold text-white mb-2">
              Proposal Request Received!
            </h4>
            <p className="text-sm text-white/60 max-w-md mb-8 leading-relaxed">
              Thank you, <span className="text-white font-medium">{formData.name || 'there'}</span>. Our lead architectural design director will review your brief and contact you within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-8 py-3 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 transition-colors"
            >
              Back to Studio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
            {/* Step 1: Project Type Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-white/50 mb-3">
                1. Project Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setProjectType(type.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all ${
                        isSelected
                          ? 'bg-[#e45d36]/15 border-[#e45d36] text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#e45d36]' : 'text-white/40'}`} />
                      <span className="text-xs font-semibold leading-tight">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Estimated Budget */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-white/50 mb-2.5">
                2. Approximate Investment Budget
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {budgetOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setBudget(opt)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      budget === opt
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Contact & Project Details */}
            <div className="space-y-4 pt-2">
              <label className="block text-xs uppercase tracking-wider font-semibold text-white/50">
                3. Your Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#e45d36] transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#e45d36] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone or WhatsApp Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#e45d36] transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Project Location (City, Country)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#e45d36] transition-colors"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about the project scope, required views, timeline..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#e45d36] transition-colors resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#e45d36] hover:bg-[#f16d47] text-white font-semibold text-xs tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#e45d36]/25 transition-all"
            >
              <Send className="w-4 h-4" /> Submit Brief for Free Consultation
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

