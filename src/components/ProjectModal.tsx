import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Maximize2, CheckCircle2, ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onInquire: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onInquire }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.coverImage];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#121214] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#151518]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#e45d36]/20 text-[#e45d36] border border-[#e45d36]/30">
              {project.category}
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white truncate max-w-md">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Main Image Lightbox Viewer */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-black/50 border border-white/10 group">
            <img
              src={images[activeImageIndex]}
              alt={`${project.title} preview ${activeImageIndex + 1}`}
              className="w-full h-full object-contain sm:object-cover transition-all duration-300"
            />

            {/* Carousel navigation controls if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === activeImageIndex ? 'w-5 bg-[#e45d36]' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === activeImageIndex ? 'border-[#e45d36] opacity-100 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            {/* Left 2 Cols: Description & Scope */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h4 className="text-xl font-display font-semibold text-white mb-2">
                  {project.subtitle}
                </h4>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Scope Checklist */}
              <div>
                <h5 className="text-xs uppercase tracking-wider font-semibold text-white/40 mb-3">
                  Scope of Architectural Services
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.scope.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-white/80 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-[#e45d36] flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Specs Sheet & Action */}
            <div className="bg-[#17171a] border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                <h5 className="text-xs uppercase tracking-wider font-semibold text-white/40 border-b border-white/10 pb-2">
                  Project Specifications
                </h5>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</span>
                  <span className="text-white font-medium">{project.location}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Year</span>
                  <span className="text-white font-medium">{project.year}</span>
                </div>

                {project.specs.area && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5" /> Total Area</span>
                    <span className="text-white font-medium">{project.specs.area}</span>
                  </div>
                )}

                {project.specs.type && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Typology</span>
                    <span className="text-white font-medium text-right">{project.specs.type}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Status</span>
                  <span className="text-[#e45d36] font-medium">{project.specs.status}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onInquire(project.title);
                }}
                className="w-full py-3 rounded-full bg-[#e45d36] hover:bg-[#f16d47] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#e45d36]/20 transition-all"
              >
                Inquire About Similar Project <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
