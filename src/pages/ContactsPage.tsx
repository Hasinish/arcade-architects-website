import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Footer } from '../components/Footer';

export const ContactsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: 'Project',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate instantaneous editorial submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#2E2E2E] selection:bg-[#2E2E2E] selection:text-white">
      {/* Editorial Contacts Section matching Bloom3D */}
      <section className="section_contacts pt-28 sm:pt-32 md:pt-40 pb-20 md:pb-28">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Studio Editorial Manifesto, Contacts & Socials */}
            <div className="lg:col-span-6 flex flex-col justify-start">
              
              {/* Header */}
              <div className="mb-10 md:mb-14">
                <span className="text-xs uppercase tracking-[2px] font-medium text-[#2E2E2E]/60 mb-4 block">
                  Contacts
                </span>
                <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-normal leading-[1.12] text-[#2E2E2E] tracking-[-1.5px]">
                  Take the first step toward collaboration and new possibilities
                </h1>
              </div>

              {/* Founder Editorial Quote Block */}
              <div className="contacts_quote flex items-start gap-5 p-6 sm:p-8 bg-white/70 border border-[#2E2E2E]/10 mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-[#222222] text-white flex items-center justify-center font-display text-xl font-normal">
                  AA
                </div>
                <div>
                  <p className="font-serif italic text-base sm:text-lg text-[#2E2E2E]/90 leading-relaxed mb-3">
                    «Architecture is a visual art, and the buildings speak for themselves.»
                  </p>
                  <span className="text-xs sm:text-sm font-medium tracking-wide text-[#2E2E2E]/70 uppercase">
                    Arcade Architects — Studio Directorate
                  </span>
                </div>
              </div>

              {/* Contacts & Socials 2-Column Subgrid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                
                {/* Direct Studio Channels */}
                <div>
                  <div className="text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/50 mb-3">
                    Direct Contact
                  </div>
                  <ul className="space-y-2 text-base font-normal">
                    <li>
                      <a
                        href="mailto:contact@arcadearchitects.com"
                        className="text-[#2E2E2E] hover:opacity-50 transition-opacity"
                      >
                        contact@arcadearchitects.com
                      </a>
                    </li>
                    <li>
                      <a
                        href="tel:+8801712345678"
                        className="text-[#2E2E2E] hover:opacity-50 transition-opacity"
                      >
                        +880 1712-345678
                      </a>
                    </li>
                    <li className="text-[#2E2E2E]/70 text-sm pt-1">
                      Cumilla & Dhaka, Bangladesh
                    </li>
                  </ul>
                </div>

                {/* Social Channels */}
                <div>
                  <div className="text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/50 mb-3">
                    Socials
                  </div>
                  <ul className="space-y-2 text-base font-normal">
                    <li>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2E2E2E] hover:opacity-50 transition-opacity flex items-center justify-between group"
                      >
                        <span>Instagram</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#2E2E2E]/40 group-hover:text-[#2E2E2E]" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2E2E2E] hover:opacity-50 transition-opacity flex items-center justify-between group"
                      >
                        <span>LinkedIn</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#2E2E2E]/40 group-hover:text-[#2E2E2E]" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://behance.net"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2E2E2E] hover:opacity-50 transition-opacity flex items-center justify-between group"
                      >
                        <span>Behance</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#2E2E2E]/40 group-hover:text-[#2E2E2E]" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Schedule a Call Slot Trigger */}
              <div className="p-6 bg-[#222222] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[1.5px] text-white/50 mb-1">
                    Need a direct consultation?
                  </div>
                  <div className="text-base font-medium text-white">
                    Book a 30-min strategy session
                  </div>
                </div>

                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bloom-btn-wrap bloom-btn-white !h-[48px] !px-5 whitespace-nowrap"
                >
                  <div className="btn-text-track">
                    <div className="btn-text-inner">
                      <span className="btn-label flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        Schedule a call <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="btn-label flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        Schedule a call <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column: Architectural Editorial Inquiry Form */}
            <div className="lg:col-span-6 bg-white p-8 sm:p-12 md:p-14 border border-[#2E2E2E]/10 shadow-sm">
              {submitted ? (
                <div className="py-16 text-center animate-in fade-in duration-400">
                  <div className="w-16 h-16 rounded-full bg-[#2E2E2E] text-white flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-normal text-[#2E2E2E] mb-3">
                    Inquiry Received
                  </h3>
                  <p className="text-base text-[#2E2E2E]/70 max-w-[420px] mx-auto mb-8 leading-relaxed">
                    Thank you, {formData.name}. Our architectural design lead will review your
                    deliverables and respond within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        organization: '',
                        subject: 'Project',
                        message: '',
                      });
                    }}
                    className="text-sm uppercase tracking-[1.5px] font-medium text-[#2E2E2E] underline underline-offset-4 hover:opacity-60"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="border-b border-[#2E2E2E]/10 pb-4">
                    <span className="text-xs uppercase tracking-[2px] font-medium text-[#2E2E2E]/50">
                      Inquiry Brief
                    </span>
                    <h2 className="text-xl sm:text-2xl font-normal text-[#2E2E2E] mt-1">
                      Start your project with Arcade
                    </h2>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2 group">
                    <label htmlFor="name" className="block text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/60">
                      Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pb-3 bg-transparent border-b border-[#2E2E2E]/20 text-base sm:text-lg text-[#2E2E2E] placeholder-[#2E2E2E]/30 focus:outline-none focus:border-[#2E2E2E] transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2 group">
                    <label htmlFor="email" className="block text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/60">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pb-3 bg-transparent border-b border-[#2E2E2E]/20 text-base sm:text-lg text-[#2E2E2E] placeholder-[#2E2E2E]/30 focus:outline-none focus:border-[#2E2E2E] transition-colors"
                    />
                  </div>

                  {/* Company / Organization Input */}
                  <div className="space-y-2 group">
                    <label htmlFor="org" className="block text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/60">
                      Company / Organization
                    </label>
                    <input
                      id="org"
                      type="text"
                      placeholder="Studio / Firm / Client"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full pb-3 bg-transparent border-b border-[#2E2E2E]/20 text-base sm:text-lg text-[#2E2E2E] placeholder-[#2E2E2E]/30 focus:outline-none focus:border-[#2E2E2E] transition-colors"
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-2 group">
                    <label htmlFor="subject" className="block text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/60">
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full pb-3 bg-transparent border-b border-[#2E2E2E]/20 text-base sm:text-lg text-[#2E2E2E] focus:outline-none focus:border-[#2E2E2E] transition-colors cursor-pointer"
                    >
                      <option value="Project">3D Visualization / Architecture Project</option>
                      <option value="Animation">3D Walkthrough / Cinematic Animation</option>
                      <option value="Question">General Studio Inquiry</option>
                      <option value="Careers">Careers / Collaboration</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2 group">
                    <label htmlFor="msg" className="block text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/60">
                      Message *
                    </label>
                    <textarea
                      id="msg"
                      required
                      rows={4}
                      placeholder="Tell us about your project timeline, location, and visual scope..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full pb-3 bg-transparent border-b border-[#2E2E2E]/20 text-base sm:text-lg text-[#2E2E2E] placeholder-[#2E2E2E]/30 focus:outline-none focus:border-[#2E2E2E] transition-colors resize-none"
                    />
                  </div>

                  {/* Bloom3D Sliding Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bloom-btn-wrap bloom-btn-black !h-[58px] w-full"
                    >
                      <div className="btn-text-track">
                        <div className="btn-text-inner">
                          <span className="btn-label text-base font-medium">
                            {loading ? 'Submitting brief...' : 'Submit Inquiry'}
                          </span>
                          <span className="btn-label text-base font-medium">
                            {loading ? 'Submitting brief...' : 'Submit Inquiry'}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Global Architectural Studio Footer */}
      <Footer />
    </div>
  );
};

