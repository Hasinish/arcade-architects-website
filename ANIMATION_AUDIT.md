# Bloom3D Animation & Motion Mechanics Audit

> **Target Site:** [https://www.bloom3d.studio/](https://www.bloom3d.studio/)  
> **Motion Libraries Used:** GSAP 3.15.0 (`ScrollTrigger`, `ScrollSmoother`, `CustomEase`, `SplitText`)  
> **Inspection Method:** Frame-by-frame scroll capture & computed transition metrics  

---

## 1. The 7 Core Motion Systems of Bloom3D

### System 1: The Pinned Hero & Curtain Reveal
* **DOM Height:** The Hero container (`.section_hero`) is set to `height: 1800px` (200vh), while the video inner container is fixed/sticky for `100vh`.
* **Motion Behavior:**
  * When the page first loads, the video fills `100vw × 100vh`.
  * As the user scrolls through the first `900px`, the video remains pinned in place.
  * A subtle dark vignette/scrim (`opacity: 0 -> 0.4`) deepens the video contrast.
  * At `y = 900px`, the `.section_portfolio` (with `#F7F7F7` stone background) slides up like a solid architectural curtain directly over the pinned video.
* **Why it matters:** It gives an immediate high-end editorial feel rather than a typical webpage scrolling off the top of the screen.

---

### System 2: Adaptive Header Color Inversion
* **Position:** Fixed `top: 0; left: 0; width: 100%; z-index: 99`.
* **Behavior:**
  * When the viewport is over media (Hero, CTA, or dark portfolio imagery):
    * Logo: `color: #FFFFFF` / `filter: brightness(1)`.
    * 2-line Hamburger Icon: `stroke: #FFFFFF`.
  * When the viewport scrolls onto `#F7F7F7` (Portfolio header, Services, About, FAQ):
    * Logo: dynamically switches to `color: #2E2E2E` / `filter: brightness(0)`.
    * 2-line Hamburger Icon: dynamically switches to `stroke: #2E2E2E`.
* **Implementation Technique:** Uses `mix-blend-mode: difference` or a GSAP ScrollTrigger intersection listener switching an `.is-dark` class.

---

### System 3: Off-Canvas Drawer Menu Animation
* **Trigger:** Click on the top-right 2-line hamburger icon.
* **Animation Sequence:**
  1. **Backdrop:** A dark semi-transparent scrim (`rgba(0, 0, 0, 0.6)`) fades in over `0.4s ease`.
  2. **Drawer Panel:** A crisp `#FFFFFF` side panel (`width: 35vw; min-width: 380px`) slides in from the right:
     * `transform: translateX(100%) -> translateX(0%)`.
     * `transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`.
  3. **Nav Links Stagger:** The menu links (`Home`, `Portfolio`, `Services`, `Contacts`) reveal with a staggered vertical slide:
     * `opacity: 0 -> 1`, `transform: translateY(20px) -> translateY(0px)`.
     * Stagger delay: `0.06s` per item.
  4. **Close Button:** The hamburger lines cross-fade or transform into a clean `×` icon.

---

### System 4: Full-Bleed Portfolio Hover Mechanics
* **Grid Layout:** Full-bleed 2-column and 3-column rows with hairline white gaps (`2px` to `4px`).
* **Hover Interaction:**
  * **Image:** Smooth scale `transform: scale(1.0) -> scale(1.035)`.
  * **Timing Curve:** `transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`.
  * **Metadata Overlay:**
    * In standard view, the image is completely clean (zero visible text).
    * On hover, a bottom gradient scrim fades in (`opacity: 0 -> 0.7`) and project title (e.g. *Morven*) + location (*Scotland*) smoothly slide up by `8px`.

---

### System 5: 3D Perspective Services Carousel
* **Container CSS:**
  ```css
  perspective: 1200px;
  transform-style: preserve-3d;
  ```
* **Card Motion:**
  * The cards sit in a horizontal flex track.
  * The center active card faces straight forward: `transform: rotateY(0deg) scale(1.0)`.
  * Left adjacent card tilts inward: `transform: rotateY(15deg) scale(0.92)`.
  * Right adjacent card tilts inward: `transform: rotateY(-15deg) scale(0.92)`.
  * Smooth inertia drag / scroll transforms the rotation dynamically as cards slide across the center line.

---

### System 6: Editorial Word-by-Word Scroll Reveal (About Section)
* **DOM Structure:** The large headline (`48px`) uses GSAP `SplitText` to wrap every word in a `<span>`.
* **ScrollTrigger:**
  * Initial State: All words have `color: rgba(46, 46, 46, 0.2)` (dimmed ghostly grey).
  * As the user scrolls through the section, words progressively illuminate to solid `color: rgb(46, 46, 46)` based on scroll scrub (`scrub: 1`).

---

### System 7: Pinned Sticky Accordion with Image Cross-Fade ("Why Work With Us")
* **Height:** `1800px` pinned section.
* **Layout:**
  * **Left Column:** Sticky title + 4 items (`01`, `02`, `03`, `04`).
  * **Right Column:** Sticky architectural visual.
* **Scroll Progression:**
  * When item `01` is active: item `01` title turns solid black `#2E2E2E` and its explanatory paragraph smoothly expands. Items `02-04` are faded grey (`rgba(46, 46, 46, 0.3)`). Right image displays Visual 1.
  * Scrolling further down automatically collapses item `01`, activates item `02`, and the right image cross-fades to Visual 2 (`opacity: 0 -> 1` with cross-dissolve).

---

## 2. Side-by-Side Verification Artifacts Generated

The following side-by-side comparison images have been generated and saved locally in `audit/comparisons/`:
1. [comp_01_hero.png](file:///D:/Arcade%20Architects%20Website/audit/comparisons/comp_01_hero.png) — *Fullscreen Hero vs Centered Dark Box*
2. [comp_02_portfolio.png](file:///D:/Arcade%20Architects%20Website/audit/comparisons/comp_02_portfolio.png) — *Edge-to-Edge Masonry vs Contained Cards*
3. [comp_03_services.png](file:///D:/Arcade%20Architects%20Website/audit/comparisons/comp_03_services.png) — *3D Perspective Carousel vs Vertical List*
4. [comp_04_about.png](file:///D:/Arcade%20Architects%20Website/audit/comparisons/comp_04_about.png) — *Minimal Word Reveal vs Centered Dark Box*
5. [comp_05_why_us.png](file:///D:/Arcade%20Architects%20Website/audit/comparisons/comp_05_why_us.png) — *Sticky Split Image-Swap vs 4 Grid Boxes*
6. [comp_06_faq.png](file:///D:/Arcade%20Architects%20Website/audit/comparisons/comp_06_faq.png) — *2-Column Minimal FAQ vs Centered Accordion*
7. [comp_07_footer.png](file:///D:/Arcade%20Architects%20Website/audit/comparisons/comp_07_footer.png) — *Editorial Split Footer vs Monolithic Watermark*

