# Bloom3D Visual & Architectural Reference Audit

> **Target Site:** [https://www.bloom3d.studio/](https://www.bloom3d.studio/)  
> **Audit Date:** 2026-11-09  
> **Viewport Inspected:** 1440 × 900 px  
> **Inspection Engine:** Playwright Chrome Automation & Computed DOM Extraction  

---

## 1. Executive Summary & Core Paradigm Shift

Our initial website version assumed a **dark luxury SaaS template** (`#0D0D0E` background, floating pill navbar, boxed cards, bold heavy fonts, orange accents).  
**Bloom3D is completely different.**

Bloom3D is an **editorial light-gallery website** featuring:
1. **Light Stone Background (`#F7F7F7`):** The entire site body is a warm off-white/stone grey (`rgb(247, 247, 247)`), not black! Only the Hero and CTA sections feature dark, full-bleed cinematic imagery.
2. **True Full-Bleed Media (Zero Margins):** The Hero and Portfolio images touch the exact edges of the screen (0px padding, edge-to-edge).
3. **Restrained Swiss Grotesque Typography:** Clean, unpretentious `Helvetica Now` (or `Inter`) with normal font-weight (`400`), large scale (`48px` - `64px`), and tight negative letter-spacing (`-0.5px` to `-1.5px`).
4. **Minimal Fixed Floating Header:** No floating pill! Just a clean top-left brand mark and top-right 2-line hamburger icon that dynamically inverts colors (white on media, black on `#F7F7F7`).
5. **Right-Side Slide-Out Drawer Menu:** Clicking the burger opens an elegant 35%-width white drawer on the right side.

---

## 2. Exact Section Hierarchy & Computed Dimensions

Extracted directly from Bloom3D's live DOM at 1440×900:

| # | Section Selector | Role | Height (px) | Background | Key Typography & Layout |
|---|------------------|------|-------------|------------|-------------------------|
| 0 | `.u-preloader` | Preloader Overlay | 0px (dismissed) | `#FFFFFF` | Brand mark reveal on entry |
| 1 | `.section_hero` | Fullscreen Hero Video | **1800px** (pinned) | Transparent (Video) | Headline: `48px`, weight 400, pinned bottom-left |
| 2 | `.section_portfolio` | Full-Bleed Work Showcase | **3840px** | `#F7F7F7` | Centered Heading `64px`, tight edge-to-edge masonry grid |
| 3 | `.section_services` | 3D Perspective Services | **1378px** | `#F7F7F7` | Heading `48px`, horizontal 3D tilted card track |
| 4 | `.section_about` | Editorial Manifesto & Stats | **640px** | `#F7F7F7` | Heading `48px` (word reveal), horizontal metric strip |
| 5 | `.section_advantages`| Why Work With Us | **1800px** (pinned) | `#F7F7F7` | Sticky left accordion + sticky right image swap |
| 6 | `.section_cta` | Fullscreen Video Banner | **1350px** | Transparent (Media) | Full-bleed video, `64px` headline pinned bottom-left |
| 7 | `.section_faq` | Accordion FAQ | **541px** | `#F7F7F7` | 2-col layout: Heading left, accordion items right |
| 8 | `.section_footer` | Clean Minimal Footer | **373px** | `#F7F7F7` | Left large CTA + Right contact details & copyright |

---

## 3. Section-by-Section Anatomy

### Section 1: Hero (`.section_hero`)
* **Layout:** Fullscreen edge-to-edge background video (`<video autoplay loop muted playsinline>`).
* **Header Bar:** 
  * Left: `BLOOM` mark (positioned `top: 32px; left: 32px`).
  * Right: 2-line minimal hamburger button `=` (`top: 32px; right: 32px`).
* **Content Placement:**
  * **Bottom-Left (pinned `bottom: 48px; left: 48px`):**
    * Tag: `Professional 3D Rendering Studio` (`16px`, weight 400, white/80).
    * Headline: `Bring your projects to life with world-class 3D visualization` (`48px`, line-height `57.6px`, weight 400, white).
  * **Bottom-Right (pinned `bottom: 48px; right: 48px`):**
    * Button 1 (*Portfolio*): Translucent glass dark grey (`rgba(255, 255, 255, 0.15)` or `rgba(0, 0, 0, 0.4)`), white text.
    * Button 2 (*Start project*): Solid crisp white (`#FFFFFF`), black text (`#121212`), rectangular with slightly rounded corners (`6px` to `8px`).

### Section 2: Slide-Out Menu Drawer
* **Trigger:** Click on top-right hamburger icon.
* **Mechanism:** White slide-over drawer occupying 35% of the viewport width from the right (`width: ~500px`).
* **Left Screen:** Dark dimming backdrop over the hero video (`rgba(0, 0, 0, 0.6)`).
* **Drawer Content:**
  * Top-right: Close `×` icon.
  * Nav links: `Home`, `Portfolio`, `Services ∨`, `Contacts` in huge clean type (`36px` - `42px`, weight 400, `#2E2E2E`).
  * Bottom strip: *"Let's talk about your next project"* + dual buttons (*Schedule a call ↗* and *Discuss the project*).

### Section 3: Portfolio Grid (`.section_portfolio`)
* **Entry:** Slides vertically over the Hero like a curtain.
* **Header:** Centered *"Featured Projects"* (`64px`, letter-spacing `-1.5px`, color `#2E2E2E`) with generous vertical padding (`120px 0px`).
* **Grid Architecture:** Full-bleed edge-to-edge images with ultra-fine white hairline gaps (`2px` to `4px`).
  * **Row 1:** 2 giant cards (each `50%` width, ~`850px` height).
  * **Row 2:** 3 vertical cards (each `33.33%` width).
  * **Row 3:** Alternating 2-column or 3-column composition.
* **Card Metadata:** Project title (e.g. *Morven*) and Location (*Scotland*) overlaid at the bottom-left on hover.

### Section 4: Services (`.section_services`)
* **Header:** Centered editorial headline: *"We create 3D visuals that elevate your architectural ideas and help your projects stand out"* (`48px`).
* **Layout:** Horizontal perspective carousel with 3D depth tilt (`perspective: 1000px`).
* **Cards:** Square aspect ratio (~`475px × 475px`). Outer cards are rotated slightly in 3D (`rotateY(15deg)` / `rotateY(-15deg)`).
* **Card Content:** Background render + clean title pinned bottom-left (`3D Architectural Visualization`, `3D Interior Visualization`, `3D Animation Rendering`).

### Section 5: About Studio (`.section_about`)
* **Manifesto:** Single powerful left-aligned statement: *"By combining creativity with technical expertise, we ensure every visual reflects a thoughtful and collaborative process shaped by your ideas"* (`48px`).
* **Metric Bar:** Full-width horizontal strip with 4 metrics:
  * `238+ Projects`
  * `48+ Clients`
  * `16+ Countries`
  * `16+ Team members`
  * Separated by ultra-fine vertical hairline borders (`border-left: 1px solid rgba(46, 46, 46, 0.15)`).

### Section 6: Advantages ("Why work with us?") (`.section_advantages`)
* **Pinned 2-Column Split:** Height `1800px` with pinned sticky behavior.
* **Left Column:**
  * Title: *"Why work with us?"* (`48px`).
  * 4 items: `01 Endless creative potential`, `02 Fast delivery`, `03 Global vision`, `04 Architectural expertise`.
  * Active item is highlighted in full `#2E2E2E` black with explanatory body text; inactive items are dimmed grey (`rgba(46, 46, 46, 0.3)`).
* **Right Column:** Sticky architectural visual that cross-fades / transitions as the user scrolls through items `01` to `04`.

### Section 7: CTA Banner (`.section_cta`)
* **Full-Bleed Media:** Edge-to-edge luxury architectural render/video (pool/courtyard).
* **Content:** Left-pinned *"Let's talk about your next project"* (`64px`) + dual buttons (*Schedule a call ↗* and *Discuss the project*).

### Section 8: FAQ (`.section_faq`)
* **Layout:** 2-column asymmetric layout:
  * Left: *"You asked, we answered"* (`48px`).
  * Right: Clean accordion list with horizontal dividing rules, questions in `16px` medium, and minimal `+` / `−` icon.

### Section 9: Footer (`.section_footer`)
* **Background:** Light stone `#F7F7F7`.
* **Grid:** 2 main columns:
  * Left: Headline *"Let's talk about your next project"* + button.
  * Right: Contact email, direct phone, address, and social links.

---

## 4. Computed Design Tokens

```css
/* Color Palette */
--bloom-bg-light: #F7F7F7;
--bloom-text-dark: #2E2E2E;
--bloom-text-muted: rgba(46, 46, 46, 0.4);
--bloom-hairline: rgba(46, 46, 46, 0.12);
--bloom-white: #FFFFFF;
--bloom-black: #121212;

/* Typography */
--font-grotesque: "Helvetica Now", "Plus Jakarta Sans", "Inter", sans-serif;
--tracking-tight: -0.5px;
--tracking-tighter: -1.5px;

/* Button Radiuses */
--btn-radius: 6px; /* NOT pill 9999px! Clean modern micro-radius */
```

