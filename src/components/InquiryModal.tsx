import React, { useState, useEffect } from 'react';
import { X, Check, Building, Palette, Store, Box, ArrowUpRight } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledProject?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, prefilledProject }) => {
  const [projectType, setProjectType] = useState('exterior');
  const [budget, setBudget] = useState('$5,000 - $15,000');
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
        details: `I am interested in discussing an architectural project similar to: ${prefilledProject}`,
      }));
    }
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
  }, [isOpen, prefilledProject, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const projectTypes = [
    { id: 'exterior', label: 'Exterior Architecture', icon: Building },
    { id: 'interior', label: 'Interior Design', icon: Palette },
    { id: 'exhibition', label: 'Exhibition Pavilion', icon: Store },
    { id: 'visualization', label: '3D Render & Film', icon: Box },
  ];

  const budgetOptions = ['Under $5,000', '$5,000 - $15,000', '$15,000 - $50,000', '$50,000+'];

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[960] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-2xl bg-[#161616] text-[#E0E0E0] border border-[#2A2A2A] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#262626] bg-[#141414]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] block mb-1">
              Project Consultation
            </span>
            <h3 className="font-sans text-lg sm:text-xl font-normal tracking-[-0.5px] text-white">
              Discuss Your Vision with Arcade Architects
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

        {submitted ? (
          <div className="p-8 sm:p-14 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-white/30 bg-white/5 flex items-center justify-center text-white mb-6">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-sans text-2xl font-normal tracking-[-0.5px] text-white mb-3">
              Proposal Brief Received
            </h4>
            <p className="font-sans text-sm text-white/70 max-w-md mb-8 leading-relaxed font-light">
              Thank you, <span className="text-white font-medium">{formData.name || 'there'}</span>. Our lead architectural director will review your brief and contact you within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bloom-btn-wrap bloom-btn-white !h-[48px] !px-8 !text-xs !font-medium"
            >
              <div className="btn-text-track">
                <div className="btn-text-inner">
                  <span className="btn-label">Return to Studio</span>
                  <span className="btn-label">Return to Studio</span>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7 overflow-y-auto">
            {/* Step 1: Project Type Selection */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] mb-3">
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
                      className={`p-3.5 border text-left flex flex-col items-start gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-sm'
                          : 'bg-[#1A1A1A] border-[#262626] text-white/70 hover:border-white/30'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-white/50'}`} />
                      <span className="text-xs font-medium leading-tight">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Estimated Budget */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] mb-3">
                2. Approximate Investment Budget
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {budgetOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setBudget(opt)}
                    className={`py-2.5 px-3 border text-xs transition-all cursor-pointer ${
                      budget === opt
                        ? 'bg-white text-black font-medium border-white'
                        : 'bg-[#1A1A1A] border-[#262626] text-white/60 hover:border-white/30'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Contact & Project Details */}
            <div className="space-y-4 pt-1">
              <label className="block font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888]">
                3. Contact Information & Brief
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] text-white placeholder-white/30 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Work Email *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] text-white placeholder-white/30 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone or WhatsApp Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] text-white placeholder-white/30 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Project Location (City, Country)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] text-white placeholder-white/30 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline your project scope, desired views, architectural drawings available, or target deadlines..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] text-white placeholder-white/30 text-xs focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>
            </div>

            {/* Bloom3D Double-Layer Sliding White Button */}
            <button
              type="submit"
              className="bloom-btn-wrap bloom-btn-white w-full !h-[54px] !text-xs !font-medium"
            >
              <div className="btn-text-track">
                <div className="btn-text-inner">
                  <span className="btn-label">
                    Submit Brief for Architectural Proposal <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                  <span className="btn-label">
                    Submit Brief for Architectural Proposal <ArrowUpRight className="w-4 h-4 ml-1" />
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
