import React from 'react';
import { useCinematicNavigation } from '../context/PageTransitionContext';
import type { Project } from '../types';
import { projects } from '../data/projects';

export const PortfolioSection: React.FC = () => {
  const { navigateWithCurtain } = useCinematicNavigation();

  // Group projects into alternating rows matching Bloom3D: 2, 3, 2, 3
  const row1 = projects.slice(0, 2);
  const row2 = projects.slice(2, 5);
  const row3 = projects.slice(5, 7);
  const row4 = projects.slice(7, 10);

  const renderProjectCard = (project: Project) => {
    return (
      <a
        key={project.id}
        href={`/projects/${project.id}`}
        data-cursor="view"
        onClick={(e) => {
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            navigateWithCurtain(`/projects/${project.id}`);
          }
        }}
        className="group relative w-full aspect-[5/6] overflow-hidden bg-[#222222] block cursor-pointer"
        aria-label={`View ${project.title} Case Study`}
      >
        {/* Full-Bleed Architectural Visual */}
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.035]"
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-500 ease-out pointer-events-none" />

        {/* Bottom Ambient Dark Gradient for Legibility */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out pointer-events-none" />

        {/* Bottom Project Details (Slides Up on Hover) */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8 flex items-baseline justify-between pointer-events-none z-10 overflow-hidden">
          {/* Left: Project Title with Expanding Underline */}
          <div className="flex flex-col items-start transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] translate-y-8 group-hover:translate-y-0">
            <h3 className="font-sans text-[17px] sm:text-[18px] md:text-[19px] font-medium tracking-[0.15px] text-white">
              {project.title}
            </h3>
            <div className="w-0 group-hover:w-full h-[1.5px] bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] delay-75 mt-0.5" />
          </div>

          {/* Right: Location / Country */}
          <div className="transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] translate-y-8 group-hover:translate-y-0 text-right">
            <span className="font-sans text-[15px] sm:text-[16px] md:text-[17px] font-normal text-white/90">
              {project.location}
            </span>
          </div>
        </div>
      </a>
    );
  };

  return (
    <section id="portfolio" data-nav-theme="light" className="relative z-20 w-full bg-[#F7F7F7] text-[#2E2E2E]">
      {/* Centered Portfolio Heading */}
      <div className="pt-28 md:pt-36 pb-14 md:pb-20 px-4 text-center">
        <h2 className="font-sans text-4xl sm:text-5xl md:text-[64px] font-normal leading-[1.1] text-center text-[#2E2E2E] tracking-[-1.5px]">
          Featured Projects
        </h2>
      </div>

      {/* Full-Bleed Edge-to-Edge Grid with 2px Gaps */}
      <div className="w-full px-[2px] pb-[4px]">
        {/* Row 1: Dual 50% Full-Bleed Cards */}
        {row1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-[2px]">
            {row1.map(renderProjectCard)}
          </div>
        )}

        {/* Row 2: Triple 33.3% Full-Bleed Cards */}
        {row2.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[2px] mb-[2px]">
            {row2.map(renderProjectCard)}
          </div>
        )}

        {/* Row 3: Dual 50% Full-Bleed Cards */}
        {row3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-[2px]">
            {row3.map(renderProjectCard)}
          </div>
        )}

        {/* Row 4: Triple 33.3% Full-Bleed Cards */}
        {row4.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[2px]">
            {row4.map(renderProjectCard)}
          </div>
        )}
      </div>
    </section>
  );
};
