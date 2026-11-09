import React, { useState, useEffect, useRef } from 'react';

interface ServicesSectionProps {
  onOpenInquiry: (serviceName?: string) => void;
}

interface ServiceCardData {
  id: string;
  title: string;
  image: string;
  subtitle: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenInquiry }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 7 Unique Architectural Services mapped onto a 14-card continuous 360-degree cylinder
  const baseServices: ServiceCardData[] = [
    {
      id: 'exterior-viz',
      title: 'Architectural Exterior Visualization',
      image: '/assets/Exterior/Hazi Bari Project/01.png',
      subtitle: 'View service',
    },
    {
      id: 'interior-design',
      title: '3D Interior Visualization & Styling',
      image: '/assets/Interior/Cafe/nidasheena (1).jpg',
      subtitle: 'View service',
    },
    {
      id: 'exhibition-pavilion',
      title: 'Exhibition Pavilions & Brand Architecture',
      image: '/assets/Exhibition/Ford/01_Photo - 10 (FILEminimizer).jpg',
      subtitle: 'View service',
    },
    {
      id: 'concept-modeling',
      title: 'Architectural Planning & Concept Modeling',
      image: '/assets/Exterior/CHANDINA PROJECT/D.V-02.png',
      subtitle: 'View service',
    },
    {
      id: 'cinematic-animation',
      title: 'Cinematic 3D Animation & Showreels',
      image: '/assets/Exterior/USA/001_10 - Photo.jpg',
      subtitle: 'View service',
    },
    {
      id: 'commercial-facade',
      title: 'Commercial Mixed-Use Facade Design',
      image: '/assets/Exterior/Laksam Project/01.png',
      subtitle: 'View service',
    },
    {
      id: 'residential-villa',
      title: 'Bespoke Residential Villa Architecture',
      image: '/assets/Exterior/KOTBARI PROJECT/01.png',
      subtitle: 'View service',
    },
  ];

  // 14 cards arranged on the 3D ring
  const cards: ServiceCardData[] = [...baseServices, ...baseServices];
  const totalCards = 14;
  const innerAngle = 360 / totalCards; // 25.7142857 deg

  // Dynamic responsive dimensions
  const [itemWidth, setItemWidth] = useState(475);
  const [rotation, setRotation] = useState(-102); // Initial rotation matching Bloom3D

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startRotRef = useRef(-102);
  const hasDraggedRef = useRef(false);

  // Update card width and cylinder radius on resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setItemWidth(Math.min(340, w - 48));
      } else if (w < 1024) {
        setItemWidth(400);
      } else {
        setItemWidth(475);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cylinder radius based on exact geometry: (width / 2) / tan(innerAngle / 2)
  const halfAngleRad = (innerAngle / 2) * (Math.PI / 180);
  const radius = Math.round((itemWidth / 2) / Math.tan(halfAngleRad)); // ~1095px for 475px width

  // Scroll scrub listener matching Bloom3D's ScrollTrigger
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || isDraggingRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section progress from entering viewport (top = windowHeight) to exiting (bottom = 0)
      const totalDistance = rect.height + windowHeight;
      const currentProgress = (windowHeight - rect.top) / totalDistance;
      const clampedProgress = Math.max(0, Math.min(1, currentProgress));

      // Bloom3D scrolls from approx -102deg to -25deg across the section
      const targetRotation = -102 + clampedProgress * 77;
      setRotation(targetRotation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Drag handlers for mouse & touch interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotRef.current = rotation;
    hasDraggedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 5) {
      hasDraggedRef.current = true;
    }
    // Sensitivity factor: 0.15 deg per px
    setRotation(startRotRef.current + deltaX * 0.15);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-20 w-full bg-[#F7F7F7] text-[#2E2E2E] py-28 md:py-36 overflow-hidden select-none"
    >
      {/* Centered Editorial Heading */}
      <div className="w-full max-w-[980px] mx-auto px-6 mb-20 md:mb-28 text-center">
        <h2 className="font-sans text-3xl sm:text-4xl md:text-[48px] font-normal leading-[1.2] md:leading-[57.6px] text-[#2E2E2E] tracking-[-0.5px]">
          We create 3D visuals that elevate your architectural ideas and help your projects stand out
        </h2>
      </div>

      {/* 3D Perspective Stage Container */}
      <div
        className="w-full h-[520px] md:h-[560px] flex items-center justify-center relative touch-pan-y cursor-grab active:cursor-grabbing"
        style={{
          perspective: '5000px',
          perspectiveOrigin: '50% 50%',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* The 3D Rotating Cylinder */}
        <div
          ref={carouselRef}
          className="relative transition-transform ease-out"
          style={{
            width: `${itemWidth}px`,
            height: `${itemWidth}px`,
            transformStyle: 'preserve-3d',
            transform: `translate3d(0px, 0px, -${radius}px) rotateY(${rotation}deg)`,
            transitionDuration: isDraggingRef.current ? '0ms' : '150ms',
          }}
        >
          {cards.map((card, idx) => {
            const cardAngle = idx * innerAngle;

            return (
              <div
                key={`${card.id}-${idx}`}
                className="absolute inset-0 group overflow-hidden bg-[#222222] shadow-2xl transition-all duration-300"
                style={{
                  width: `${itemWidth}px`,
                  height: `${itemWidth}px`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: `rotateY(${cardAngle}deg) translate3d(0px, 0px, ${radius}px)`,
                }}
                onClick={(e) => {
                  if (hasDraggedRef.current) {
                    e.preventDefault();
                    return;
                  }
                  onOpenInquiry(card.title);
                }}
              >
                {/* Background Architectural Visual */}
                <img
                  src={card.image}
                  alt={card.title}
                  draggable={false}
                  className="w-full h-full object-cover filter brightness-[0.88] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                />

                {/* Ambient Dark Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-400 pointer-events-none" />

                {/* Bottom Legibility Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                {/* Service Card Content */}
                <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end pointer-events-none z-10">
                  <h3 className="font-sans text-2xl sm:text-[32px] font-medium leading-[1.2] text-white tracking-normal mb-3">
                    {card.title}
                  </h3>

                  {/* View Service Underline Button */}
                  <div className="inline-flex items-center gap-1 text-white/90 group/btn">
                    <span className="font-sans text-base font-normal tracking-wide">
                      {card.subtitle}
                    </span>
                    <div className="w-0 group-hover:w-16 h-[1.5px] bg-white transition-all duration-400 ease-out mt-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
