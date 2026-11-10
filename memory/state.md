# state.md — Current Workspace State

## Active Goals & Todo
- [x] Baseline Bloom3D Foundation (Phases 1–6 Complete & Audited)
  - [x] Phase 1: Foundations & Shell (Stone `#F7F7F7`, Swiss typography, corner-pinned logo/hamburger, 480px white slide-out drawer)
  - [x] Phase 2: Full-Bleed Hero & Pinned Curtain Scroll (`px-8 pt-8` navbar, `px-20 pb-20` bottom insets, stationary video, rising curtain)
  - [x] Phase 3: Zero-Margin Full-Bleed Portfolio Grid (2-3 alternating rhythm, 2px hairline gaps, hover zoom and title reveal, project modal)
  - [x] Phase 4: 3D Cylindrical Perspective Services Carousel (Baseline snapshot preserved in Git)
  - [x] Phase 5: About Manifesto Word-by-Word Scroll Scrub & 300vh Pinned Split Advantages Stage (01–04 sequential activation + image cross-fade)
  - [x] Phase 6: Fullscreen Parallax CTA, Editorial 2-Column Minimal FAQ Accordion, and Dark Architectural Studio Footer
- [x] Baseline Snapshot: Local Git commit created (`70ddb77 feat(baseline): complete phase 1-6 bloom3d foundation snapshot`), zero remote pushes.
- [x] **PHASE 7 — CUSTOMIZATION 01: SNØHETTA-STYLE SERVICES GALLERY**:
  - [x] Replaced 3D cylinder in `src/components/ServicesSection.tsx` with horizontally draggable variable-scale gallery.
  - [x] Continuous dynamic scaling: active slide `36%` (desktop) / `68%` (mobile), immediate neighbors `24%` / `50%`, outer neighbors `16%` / `50%`, exact `3:2` aspect ratio, `0px` gaps, flush top alignment.
  - [x] Tested with Playwright across desktop & mobile.
- [x] **PHASE 7 — CUSTOMIZATION 02: REAL-TIME PIXEL LUMINANCE SAMPLING NAVBAR**:
  - [x] Replaced static section tagging with a real-time pixel extraction engine in `src/components/Navbar.tsx`.
  - [x] In-memory 1x1 `<canvas>` with `ctx.getImageData()` extracts true pixel data from underlying `<img>` (mapped to `naturalWidth`/`naturalHeight`), `<video>`, and computed CSS backgrounds at `(x=64, y=48)` for Logo and `(x=innerWidth-48, y=48)` for Hamburger on every scroll/resize rAF tick.
  - [x] Computes ITU-R BT.709 relative luminance `(0.2126*R + 0.7152*G + 0.0722*B) / 255`.
  - [x] Logo and Hamburger adapt **INDIVIDUALLY and INDEPENDENTLY**: Dark pixel underneath (< 0.5) -> element is WHITE (`#FFFFFF`); Light pixel underneath (>= 0.5) -> element is DARK (`#2E2E2E`).
  - [x] Verified independent switching: at Y=1500px, Logo is over bright facade (DARK) while Hamburger is over dark shadow (WHITE); at Y=4800px, Logo is over black canvas (WHITE) while Hamburger is over bright slide (DARK).
  - [x] Drawer open override preserved (Hamburger stays dark `#222222` over white drawer).
  - [x] Playwright audit collage generated at `audit/comparisons/navbar_pixel_calculation_audit.png`.

- [x] **PHASE 7 — CUSTOMIZATION 03: SUBTLE INERTIA SMOOTH SCROLLING (LENIS)**:
  - [x] Integrated `lenis` smooth scrolling with `lenis/dist/lenis.css` in `src/App.tsx`.
  - [x] Configured architectural motion profile: `duration: 1.25s`, exponential deceleration curve `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`, `smoothWheel: true`, `wheelMultiplier: 0.95`, `touchInertiaExponent: 1.6`, `anchors: true`.
  - [x] Preserved sticky hero curtain overlap, 300vh advantages progression, and real-time pixel sampling navbar updates during inertial glide.
  - [x] Handled modal/drawer isolation: `lenis.stop()` when InquiryModal, ScheduleCallModal, or Navbar drawer opens; `data-lenis-prevent` on drawer and modal overlays.
  - [x] Verified via Playwright frame-by-frame velocity audit (`audit/scroll_inertia_audit.json` and profile chart `audit/comparisons/scroll_inertia_curve.png`).
  - [x] Clean production build (`npm run build`), zero errors.

- [x] **PHASE 7 — CUSTOMIZATION 04: NUMBERED PROJECT PHOTOS MIGRATION**:
  - [x] Converted and renamed all project images across all 10 project directories in `Resources/` and `public/assets/` to sequential numbers only (`1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`...).
  - [x] Preserved brand identity files in `Resources/Logo/` (`Logo.png`, `Logo_01.png`).
  - [x] Updated all project definitions and galleries in `src/data/projects.ts` (74 asset references total).
  - [x] Updated `src/data/services.ts`, `src/components/Hero.tsx`, `src/components/CTASection.tsx`, `src/components/WhyUsSection.tsx`, and `src/components/ServicesSection.tsx`.
  - [x] Verified via Playwright live network/DOM audit (`scripts/verify_images_loaded.py`): 24 on-page images loaded, 0 broken, 0 failed requests (400+), modal gallery verified.
  - [x] Clean production build (`npm run build`), zero errors.

- [x] **PHASE 7 — CUSTOMIZATION 05: SEPARATION OF RESOURCES & ASSETS (CLEAN SINGLE SOURCE)**:
  - [x] Decoupled `Resources/` completely: it is now an independent external storage/archive directory, untouched by Vite or build tooling.
  - [x] `public/assets/` is the sole, direct single source of truth for all website assets.
  - [x] Cleaned `vite.config.ts` (removed sync plugin completely, standard React Vite setup).
  - [x] Verified clean production build (`npm run build` in 2.5s).

- [x] **PHASE 7 — CUSTOMIZATION 06: ARCHITECTURAL RECONSTRUCTION OF ALL 3 MODALS**:
  - [x] Completely purged all legacy SaaS styling (rounded-3xl bubbles, orange badges `#e45d36`, generic borders, confetti particles).
  - [x] Rebuilt `src/components/ProjectModal.tsx`:
    - Luxury deep architectural shell (`#161616` with hairline `#2A2A2A` borders).
    - 16:9 widescreen render lightbox, glass controls, Swiss monospace counter (`01 / 04`).
    - Thumbnail strip with active border highlighting.
    - Keyboard arrow navigation (`ArrowLeft` / `ArrowRight` to step through gallery, `Escape` to close).
    - Structured architectural specifications card with Bloom3D double-layer sliding inquiry button.
  - [x] Rebuilt `src/components/InquiryModal.tsx`:
    - Editorial proposal brief submission modal.
    - Architectural category and budget selectors with high-contrast active states.
    - Dark inputs with focus border transitions.
    - Bloom3D sliding submit button, clean architectural confirmation state.
  - [x] Rebuilt `src/components/ScheduleCallModal.tsx`:
    - Clean consultation booking modal with date/time pickers and platform selection.
  - [x] Verified via Playwright end-to-end testing and collage generation (`audit/comparisons/modals_architectural_audit.png`).
  - [x] Clean production build (`npm run build` in 1.99s). Bundle size reduced.

- [x] **PHASE 7 — CUSTOMIZATION 07: BLOOM3D EDITORIAL ROUTING (ZERO MODALS)**:
  - [x] Installed `react-router-dom` v7.
  - [x] Eradicated all 3 popup modals from the live application flow.
  - [x] Built `src/pages/ProjectDetailPage.tsx` (`/projects/:projectId`):
    - Full-bleed cinematic hero render (`project_hero_img`).
    - Swiss architectural specifications table (Year, Location, Typology, Scale, Status).
    - Editorial brief narrative and scope tags.
    - Vertical stacked multi-angle render gallery from `public/assets/`.
    - Next Project transition cards (`section_project_nav`) for continuous project exploration.
  - [x] Built `src/pages/ContactsPage.tsx` (`/contacts`):
    - 2-column asymmetrical studio layout.
    - Directorate quote, direct studio channels, dimming social links, Calendly consultation booking trigger.
    - Editorial architectural inquiry brief form with bottom hairline underlines and sliding Bloom3D submit button.
  - [x] Built `src/components/ScrollToTop.tsx` to handle Lenis scroll reset across route changes.
  - [x] Refactored `src/components/PortfolioSection.tsx`: all cards are native `<Link>` triggers navigating to `/projects/:projectId`.
  - [x] Refactored `src/components/Navbar.tsx`: off-canvas drawer links directly to `/`, `/#portfolio`, `/#services`, and `/contacts`.
  - [x] Refactored `Hero.tsx`, `CTASection.tsx`, and `Footer.tsx` action buttons to route directly to `/contacts`.
  - [x] Production build passing in 1.57s. Verified live via Playwright with 0 modals mounted and seamless URL navigation.

## Last Session (Convo 4bb7da72-16c6-4b32-85de-0824002c2d7b)
- Audited `bloom3d.studio` live: proved zero popup modals exist.
- Executed Customization 07: Torched all popup modals and implemented Bloom3D's authentic multi-page editorial routing architecture (`/projects/:projectId`, `/contacts`, `/#portfolio`).
- Staged all assets, numbered renders, verification scripts, and audit documentation into Git (`82b7d13`).
- Pushed all 4 commits cleanly to GitHub remote `origin/main` (`https://github.com/Hasinish/arcade-architects-website`). Working tree completely clean and in sync.
- Dev server live on `http://localhost:5173/`.

## Current Blockers & Notes
- Remote repository fully synchronized and up to date. Ready for Hasin's visual review or next directive.
