import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorType = 'default' | 'pointer' | 'view' | 'drag';

export const CustomCursor: React.FC = () => {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth architectural spring physics for the follower ring/badge
  const springConfig = { damping: 28, stiffness: 320, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device supports fine pointer (mouse/trackpad). Disable on touch screens.
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Detect hover target attributes or tags
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // When hovering over text inputs, hide custom cursor so native I-beam is unobscured
      const isTextInput = target.closest('input, textarea');
      if (isTextInput) {
        setIsVisible(false);
        return;
      }

      if (!isVisible) setIsVisible(true);

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const customCursor = cursorTarget.getAttribute('data-cursor');
        if (customCursor === 'view') {
          setCursorType('view');
          return;
        }
        if (customCursor === 'drag') {
          setCursorType('drag');
          return;
        }
      }

      // Check for clickable elements
      const isClickable = target.closest('a, button, select, [role="button"], label, .cursor-pointer');
      if (isClickable) {
        setCursorType('pointer');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
      {/* 1. Precise Center Dot (Dual-Tone Contrast: Jet Black Core with Crisp White Ring)
          Visible against pure white, pure black, and all photo surfaces! */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#121212] ring-[1.5px] ring-[#FFFFFF] shadow-sm pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          opacity: isVisible && (cursorType === 'default' || cursorType === 'pointer') ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 2. Fluid Morphing Follower Ring / Badge */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center font-mono select-none"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.4,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Default State: High-Contrast Architectural Dual Ring (Dark border + White halo ring) */}
        {cursorType === 'default' && (
          <div className="w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border border-[#121212]/75 ring-1 ring-white/90 shadow-sm transition-all duration-200" />
        )}

        {/* Pointer Hover State (Buttons, Links): Expanded Focus Ring */}
        {cursorType === 'pointer' && (
          <div className="w-12 h-12 -ml-6 -mt-6 rounded-full border border-[#121212]/85 ring-1 ring-white/95 bg-black/[0.05] transition-all duration-200 scale-105" />
        )}

        {/* View Badge (Project Cards): Dark Architectural Pill with White Typography & Hairline Ring */}
        {cursorType === 'view' && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="-ml-10 -mt-4 px-4 py-1.5 rounded-full bg-[#141414] text-white border border-white/25 text-[11px] font-semibold tracking-[2px] uppercase shadow-2xl flex items-center justify-center"
          >
            VIEW
          </motion.div>
        )}

        {/* Drag Badge (Snøhetta Gallery): Dark Architectural Pill with White Typography & Hairline Ring */}
        {cursorType === 'drag' && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="-ml-11 -mt-4 px-4 py-1.5 rounded-full bg-[#141414] text-white border border-white/25 text-[11px] font-semibold tracking-[2px] uppercase shadow-2xl flex items-center justify-center gap-1.5"
          >
            <span>↔</span> DRAG
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
