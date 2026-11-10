import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Maximize2, Check, ArrowUpRight } from 'lucide-react';
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
      if (e.key === 'ArrowRight' && project) {
        const total = (project.gallery && project.gallery.length > 0 ? project.gallery : [project.coverImage]).length;
        setActiveImageIndex((prev) => (prev + 1) % total);
      }
      if (e.key === 'ArrowLeft' && project) {
        const total = (project.gallery && project.gallery.length > 0 ? project.gallery : [project.coverImage]).length;
        setActiveImageIndex((prev) => (prev - 1 + total) % total);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const lenis = (window as any).lenis;
    if (project) {
      lenis?.stop();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      lenis?.start();
    };
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
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[950] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#161616] text-[#E0E0E0] border border-[#2A2A2A] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#262626] bg-[#141414]">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888]">
              {project.category}
            </span>
            <h3 className="font-sans text-lg sm:text-xl font-normal tracking-[-0.5px] text-white truncate max-w-md sm:max-w-xl">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 hover:border-white/40 flex items-center justify-center text-white/70 hover:text-white transition-all bg-white/5 hover:bg-white/10 cursor-pointer"
            aria-label="Close project modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Main Image Lightbox Viewer */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#0D0D0D] border border-[#262626] group">
            <img
              src={images[activeImageIndex]}
              alt={`${project.title} render ${activeImageIndex + 1}`}
              className="w-full h-full object-contain sm:object-cover transition-opacity duration-300"
            />

            {/* Navigation Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer opacity-80 hover:opacity-100"
                  aria-label="Previous render"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer opacity-80 hover:opacity-100"
                  aria-label="Next render"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Swiss Minimal Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/75 border border-white/15 text-[11px] font-mono tracking-widest text-white backdrop-blur-md">
                  {String(activeImageIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-24 h-16 overflow-hidden border transition-all cursor-pointer ${
                    idx === activeImageIndex
                      ? 'border-white opacity-100'
                      : 'border-[#262626] opacity-40 hover:opacity-85'
                  }`}
                  aria-label={`Select image ${idx + 1}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* Left 7 Columns: Manifesto & Scope */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h4 className="font-sans text-xl sm:text-2xl font-normal leading-snug tracking-[-0.5px] text-white mb-3">
                  {project.subtitle}
                </h4>
                <p className="font-sans text-sm sm:text-[15px] font-light text-white/70 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Scope Checklist */}
              <div>
                <h5 className="font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] mb-4">
                  Scope of Architectural Services
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.scope.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs sm:text-[13px] text-white/85 bg-[#1B1B1B] p-3 border border-[#262626]"
                    >
                      <Check className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Specs Sheet & Action */}
            <div className="lg:col-span-5 bg-[#191919] border border-[#262626] p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h5 className="font-mono text-[11px] uppercase tracking-[1.5px] text-[#888888] border-b border-[#262626] pb-3">
                  Project Specifications
                </h5>

                <div className="flex items-center justify-between text-xs py-1 border-b border-[#222222]">
                  <span className="text-white/50 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </span>
                  <span className="text-white font-medium">{project.location}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-[#222222]">
                  <span className="text-white/50 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Year
                  </span>
                  <span className="text-white font-medium">{project.year}</span>
                </div>

                {project.specs.area && (
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[#222222]">
                    <span className="text-white/50 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" /> Total Area
                    </span>
                    <span className="text-white font-medium">{project.specs.area}</span>
                  </div>
                )}

                {project.specs.type && (
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[#222222]">
                    <span className="text-white/50">Typology</span>
                    <span className="text-white font-medium text-right">{project.specs.type}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-white/50">Project Status</span>
                  <span className="text-white font-medium">{project.specs.status}</span>
                </div>
              </div>

              {/* Bloom3D Double-Layer Sliding White Button */}
              <button
                onClick={() => {
                  onClose();
                  onInquire(project.title);
                }}
                className="bloom-btn-wrap bloom-btn-white w-full !h-[50px] !text-xs !font-medium"
                aria-label="Inquire about this project"
              >
                <div className="btn-text-track">
                  <div className="btn-text-inner">
                    <span className="btn-label">
                      Inquire About Similar Project <ArrowUpRight className="w-4 h-4 ml-1" />
                    </span>
                    <span className="btn-label">
                      Inquire About Similar Project <ArrowUpRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
