import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project, ProjectCategory } from '../types';
import { projects } from '../data/projects';
import { ProjectModal } from './ProjectModal';

interface PortfolioSectionProps {
  onOpenInquiryWithProject: (projectName: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenInquiryWithProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories: { label: string; value: ProjectCategory }[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'Exterior Architecture', value: 'exterior' },
    { label: 'Interior Design', value: 'interior' },
    { label: 'Exhibitions & Pavilions', value: 'exhibition' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e45d36] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e45d36]" />
            Selected Portfolio
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Featured Projects
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/5 border border-white/10 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.value
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setActiveModalProject(project)}
            className="project-card group relative rounded-3xl overflow-hidden bg-[#151518] border border-white/10 cursor-pointer shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-[16/11] overflow-hidden bg-black/40">
              <img
                src={project.coverImage}
                alt={project.title}
                className="project-card-image w-full h-full object-cover filter brightness-[0.92] group-hover:brightness-100"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

              {/* Category Pill Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-black/50 text-white/90 backdrop-blur-md border border-white/10">
                  {project.category}
                </span>
              </div>

              {/* Hover Floating Arrow Pill */}
              <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Project Details Footer on Card */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-[#e45d36] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/50 mt-1 flex items-center gap-2">
                  <span>{project.location}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span>{project.year}</span>
                </p>
              </div>

              <div className="hidden sm:flex items-center text-xs font-medium text-white/60 group-hover:text-white transition-colors gap-1">
                <span>View Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Details Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
        onInquire={(projectName) => onOpenInquiryWithProject(projectName)}
      />
    </section>
  );
};
