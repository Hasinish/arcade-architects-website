import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Navbar } from './components/Navbar';
import { ScrollToTop } from './components/ScrollToTop';
import { CustomCursor } from './components/CustomCursor';
import { PageTransitionProvider } from './context/PageTransitionContext';
import { IntroProvider } from './context/IntroContext';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ContactsPage } from './pages/ContactsPage';
import { MenuSandboxPage } from './pages/MenuSandboxPage';

export const App: React.FC = () => {
  // Initialize Lenis for smooth scrolling with subtle stopping inertia
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve for subtle inertial glide
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchInertiaExponent: 1.6,
      anchors: true,
      autoRaf: true,
    });

    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return (
    <BrowserRouter>
      <IntroProvider>
        <PageTransitionProvider>
          {/* Route Change Scroll Reset */}
          <ScrollToTop />

          {/* Fluid Architectural Interactive Cursor */}
          <CustomCursor />

          <div className="min-h-screen bg-[#F7F7F7] text-[#2E2E2E] relative selection:bg-[#2E2E2E] selection:text-white overflow-x-clip">
            {/* Top Corner-Pinned Minimal Navbar (Real-time Pixel Contrast Engine) */}
            <Navbar />

            {/* Multi-Page Editorial Routes matching Bloom3D (Zero Modals) */}
            <Routes>
              {/* Main Home Page */}
              <Route path="/" element={<HomePage />} />

              {/* Dedicated Full-Bleed Editorial Project Case Study */}
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />

              {/* Dedicated Architectural Studio Contact Page */}
              <Route path="/contacts" element={<ContactsPage />} />

              {/* Awwwards Navigation Sandbox Lab (All 4 Interactive Options) */}
              <Route path="/menu-sandbox" element={<MenuSandboxPage />} />

              {/* Redirect /projects to Portfolio Anchor on Home */}
              <Route path="/projects" element={<Navigate to="/#portfolio" replace />} />

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </PageTransitionProvider>
      </IntroProvider>
    </BrowserRouter>
  );
};

export default App;
