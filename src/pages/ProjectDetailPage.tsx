import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useCinematicNavigation } from '../context/PageTransitionContext';
import { projects } from '../data/projects';
import { Footer } from '../components/Footer';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { navigateWithCurtain } = useCinematicNavigation();

  // Find current project
  const currentIndex = projects.findIndex((p) => p.id === projectId);
  const project = currentIndex !== -1 ? projects[currentIndex] : null;

  // Next 2 projects for the Bloom3D bottom navigation section
  const nextProjects = project
    ? [
        projects[(currentIndex + 1) % projects.length],
        projects[(currentIndex + 2) % projects.length],
      ]
    : [];

  useEffect(() => {
    if (!project) {
      // If project not found, redirect to home or 404
      navigate('/', { replace: true });
    }
  }, [project, navigate]);

  if (!project) return null;

  // Separate remaining images for editorial gallery layout
  const galleryImages = project.gallery;

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#2E2E2E] selection:bg-[#2E2E2E] selection:text-white">
      {/* Editorial Case Study Section */}
      <section className="section_project pt-24 sm:pt-28 md:pt-32">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-12">
          
          {/* Top Breadcrumb & Back Link */}
          <div className="pb-6 sm:pb-8 flex items-center justify-between">
            <a
              href="/#portfolio"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  navigateWithCurtain('/#portfolio');
                }
              }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/60 hover:text-[#2E2E2E] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all projects</span>
            </a>

            <span className="text-xs sm:text-sm font-mono text-[#2E2E2E]/50">
              {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          </div>

          {/* Full-Bleed Hero Render with Bloom3D Cinematic Aspect */}
          <div className="project_hero relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] overflow-hidden bg-[#1E1E1E]">
            <img
              src={project.coverImage}
              alt={project.title}
              loading="eager"
              className="project_hero_img w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.015]"
            />
          </div>

          {/* Project Overview (Bloom3D 2-Column Split: Meta Specs & Editorial Narrative) */}
          <div className="project_overview_container py-14 sm:py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              
              {/* Left Column: Heading & Structured Specs */}
              <div className="lg:col-span-5 flex flex-col justify-start">
                <span className="text-xs uppercase tracking-[2px] font-medium text-[#2E2E2E]/50 mb-3">
                  {project.category}
                </span>

                <h1 className="project_heading font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal leading-[1.1] text-[#2E2E2E] tracking-[-1.5px] mb-8">
                  {project.title}
                </h1>

                {/* Swiss Architectural Specs Block */}
                <div className="border-t border-[#2E2E2E]/15 divide-y divide-[#2E2E2E]/10 font-sans text-sm sm:text-base">
                  <div className="py-3.5 flex justify-between">
                    <span className="text-[#2E2E2E]/60">Year</span>
                    <span className="font-medium text-[#2E2E2E]">{project.year}</span>
                  </div>
                  <div className="py-3.5 flex justify-between">
                    <span className="text-[#2E2E2E]/60">Location</span>
                    <span className="font-medium text-[#2E2E2E]">{project.location}</span>
                  </div>
                  <div className="py-3.5 flex justify-between">
                    <span className="text-[#2E2E2E]/60">Type of project</span>
                    <span className="font-medium text-[#2E2E2E]">{project.specs.type || project.subtitle}</span>
                  </div>
                  {project.specs.area && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[#2E2E2E]/60">Scale / Area</span>
                      <span className="font-medium text-[#2E2E2E]">{project.specs.area}</span>
                    </div>
                  )}
                  {project.specs.status && (
                    <div className="py-3.5 flex justify-between">
                      <span className="text-[#2E2E2E]/60">Status</span>
                      <span className="font-medium text-[#2E2E2E]">{project.specs.status}</span>
                    </div>
                  )}
                </div>

                {/* Call to Action Trigger */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => navigateWithCurtain('/contacts')}
                    className="bloom-btn-wrap bloom-btn-black inline-block !w-auto !px-8 cursor-pointer"
                  >
                    <div className="btn-text-track">
                      <div className="btn-text-inner">
                        <span className="btn-label flex items-center gap-1.5">
                          Discuss this project <ArrowUpRight className="w-4 h-4" />
                        </span>
                        <span className="btn-label flex items-center gap-1.5">
                          Discuss this project <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Column: Editorial Narrative & Scope */}
              <div className="lg:col-span-7 flex flex-col justify-between pt-2">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-[28px] font-normal leading-[1.4] text-[#2E2E2E] tracking-[-0.5px] mb-8">
                    {project.subtitle}
                  </h2>

                  <div className="text-base sm:text-lg leading-[1.7] text-[#2E2E2E]/80 space-y-5 font-normal">
                    <p>{project.description}</p>
                    <p>
                      Every architectural vignette was rendered with precise atmospheric lighting,
                      surface micro-roughness, and contextual environmental reflections to communicate
                      spatial proportion and material hierarchy.
                    </p>
                  </div>
                </div>

                {/* Scope Tags */}
                {project.scope && project.scope.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-[#2E2E2E]/15">
                    <div className="text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/50 mb-3.5">
                      Scope of Deliverables
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.scope.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-[#2E2E2E]/[0.06] text-xs sm:text-sm text-[#2E2E2E]/90 font-medium tracking-wide"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vertical Architectural Gallery (Alternating Rhythm) */}
          <div className="project_gallery space-y-4 sm:space-y-6 pb-20 sm:pb-28">
            {galleryImages.map((imgSrc, idx) => {
              // Pair layout: if even index and not last image, can show dual or single
              const isFullBleed = idx === 0 || idx % 3 === 0;
              return (
                <div
                  key={idx}
                  className={`w-full overflow-hidden bg-[#1E1E1E] ${
                    isFullBleed ? 'aspect-[16/10] sm:aspect-[21/10]' : 'aspect-[16/10]'
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={`${project.title} - Visual ${idx + 1}`}
                    loading="lazy"
                    className="project_img w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bloom3D Next Projects Navigation Section */}
      <section className="section_project_nav bg-[#161616] text-white py-20 md:py-28 px-4 sm:px-6 md:px-12">
        <div className="max-w-[1720px] mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <span className="text-xs sm:text-sm uppercase tracking-[2px] font-medium text-white/50">
              Next Projects
            </span>
            <a
              href="/#portfolio"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  navigateWithCurtain('/#portfolio');
                }
              }}
              className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              View all works
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {nextProjects.map((nextP) => (
              <a
                key={nextP.id}
                href={`/projects/${nextP.id}`}
                data-cursor="view"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                    navigateWithCurtain(`/projects/${nextP.id}`);
                  }
                }}
                className="group relative aspect-[16/10] overflow-hidden bg-[#222222] block cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={nextP.coverImage}
                  alt={nextP.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 group-hover:from-black/90 transition-all duration-400" />

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between z-10">
                  <div>
                    <span className="text-xs uppercase tracking-[1.5px] text-white/60 mb-1 block">
                      {nextP.location}
                    </span>
                    <h2 className="font-sans text-2xl sm:text-3xl font-normal text-white">
                      {nextP.title}
                    </h2>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-white flex items-center gap-1">
                      View project <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    <div className="w-0 group-hover:w-full h-[1.5px] bg-white transition-all duration-400 mt-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Global Architectural Studio Footer */}
      <Footer />
    </div>
  );
};

