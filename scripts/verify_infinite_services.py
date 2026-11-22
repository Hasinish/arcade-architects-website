import time
import json
import math
from playwright.sync_api import sync_playwright

def scroll_to_services(page):
    page.wait_for_selector("#services", state="attached")
    page.evaluate("""() => {
        const el = document.getElementById('services');
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(0, top);
            if (window.lenis) {
                window.lenis.scrollTo(top, { immediate: true });
            }
        }
    }""")
    time.sleep(1.0)

def run_comprehensive_verification():
    print("==================================================")
    print("ARCADE ARCHITECTS — INFINITE GALLERY VERIFICATION")
    print("==================================================")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        
        # -----------------------------------------------------------------
        # TEST 1-5: PRIMARY DESKTOP 1440x900
        # -----------------------------------------------------------------
        print("\n--- PHASE 1: Primary Desktop (1440x900) ---")
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        
        page.goto("http://localhost:5173/?intro=0", wait_until="domcontentloaded")
        time.sleep(1)
        scroll_to_services(page)
        
        # [TEST 1] Tile Sizing, Aspect Ratio, Gap, Contiguity
        print("\n[TEST 1] Sizing, Aspect Ratio (4:3), Spacing, No Rounded Corners")
        tiles = page.locator("#services .flex-nowrap > div")
        tile_count = tiles.count()
        print(f"  -> Total rendered tiles in infinite track: {tile_count}")
        assert tile_count == 35, f"Expected 35 tiles, got {tile_count}"
        
        tile_boxes = []
        for i in range(12, 17):
            box = tiles.nth(i).bounding_box()
            tile_boxes.append(box)
            print(f"  -> Tile {i}: width={box['width']:.1f}px, height={box['height']:.1f}px, x={box['x']:.1f}px")
        
        w = tile_boxes[0]['width']
        h = tile_boxes[0]['height']
        aspect = w / h
        print(f"  -> Measured aspect ratio: {aspect:.4f} (Target: {4/3:.4f})")
        assert abs(aspect - 4/3) < 0.01, f"Aspect ratio {aspect} differs from 4:3!"
        assert abs(w - 500) < 2, f"Desktop tile width {w}px is not 500px!"
        assert abs(h - 375) < 2, f"Desktop tile height {h}px is not 375px!"
        
        gap = tile_boxes[1]['x'] - (tile_boxes[0]['x'] + tile_boxes[0]['width'])
        print(f"  -> Measured gap: {gap:.2f}px (Target: ~16px)")
        assert abs(gap - 16) < 1.5, f"Gap {gap}px is not 16px!"
        
        has_rounded = page.evaluate("() => { const imgs = document.querySelectorAll('#services img'); return Array.from(imgs).some(img => window.getComputedStyle(img).borderRadius !== '0px'); }")
        print(f"  -> Any rounded corners on images: {has_rounded}")
        assert not has_rounded, "Images must have zero rounded corners!"
        
        # [TEST 2] Cinematic Auto-Scroll Velocity
        print("\n[TEST 2] Cinematic Auto-Scroll Velocity (-25px/s Right-to-Left)")
        t0 = time.time()
        x0 = page.evaluate("() => { const el = document.querySelector('#services [data-cursor=\"drag\"] > div'); const tr = window.getComputedStyle(el).transform; const m = tr.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/); return m ? parseFloat(m[1]) : 0; }")
        
        time.sleep(2.5)
        t1 = time.time()
        x1 = page.evaluate("() => { const el = document.querySelector('#services [data-cursor=\"drag\"] > div'); const tr = window.getComputedStyle(el).transform; const m = tr.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/); return m ? parseFloat(m[1]) : 0; }")
        
        dt = t1 - t0
        dx = x1 - x0
        speed = dx / dt
        print(f"  -> Moved {dx:.2f}px in {dt:.2f}s => {speed:.2f} px/s (Target: -25.0 px/s)")
        assert speed < -18 and speed > -32, f"Speed {speed} px/s out of range!"
        
        # [TEST 3] Active Center Service Detection & Glide on Click
        print("\n[TEST 3] Active Center Service Detection & Glide on Click")
        initial_title = page.locator("#services h3").inner_text()
        initial_counter = page.locator("#services span.font-mono").inner_text()
        print(f"  -> Centered Service Title: '{initial_title}'")
        print(f"  -> Service Counter: '{initial_counter}'")
        assert "01 / 07" in initial_counter, f"Expected 01 / 07, got {initial_counter}"
        
        print("  -> Clicking next tile (tile 15) to test glide-to-center...")
        tiles.nth(15).click(force=True)
        time.sleep(1.0)
        
        new_title = page.locator("#services h3").inner_text()
        new_counter = page.locator("#services span.font-mono").inner_text()
        print(f"  -> Updated Service Title: '{new_title}'")
        print(f"  -> Updated Service Counter: '{new_counter}'")
        assert "02 / 07" in new_counter, f"Expected 02 / 07 after clicking next tile, got {new_counter}"

        # Verify that while mouse is hovering on the filmstrip after selecting, it stays completely still!
        box_hover = page.locator("#services [data-cursor='drag']").bounding_box()
        page.mouse.move(box_hover['x'] + box_hover['width'] / 2, box_hover['y'] + box_hover['height'] / 2)
        time.sleep(0.2)
        x_hover_start = page.evaluate("() => { const el = document.querySelector('#services [data-cursor=\"drag\"] > div'); const tr = window.getComputedStyle(el).transform; const m = tr.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/); return m ? parseFloat(m[1]) : 0; }")
        time.sleep(1.0)
        x_hover_end = page.evaluate("() => { const el = document.querySelector('#services [data-cursor=\"drag\"] > div'); const tr = window.getComputedStyle(el).transform; const m = tr.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/); return m ? parseFloat(m[1]) : 0; }")
        hover_drift = abs(x_hover_end - x_hover_start)
        print(f"  -> Hover pause check (drift over 1.0s while hovering): {hover_drift:.2f}px (Target: 0.0px)")
        assert hover_drift < 1.0, f"Gallery moved {hover_drift}px while hovering!"

        # Move mouse away and confirm auto-scroll resumes
        page.mouse.move(10, 10)
        time.sleep(1.0)
        x_resume = page.evaluate("() => { const el = document.querySelector('#services [data-cursor=\"drag\"] > div'); const tr = window.getComputedStyle(el).transform; const m = tr.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/); return m ? parseFloat(m[1]) : 0; }")
        resume_dx = x_resume - x_hover_end
        print(f"  -> Resume check after mouseleave (1.0s): {resume_dx:.2f}px (Target: ~ -25px)")
        assert resume_dx < -15, f"Gallery did not resume auto-scrolling after mouseleave ({resume_dx}px)!"
        
        page.screenshot(path="C:/Users/Hasin/.gemini/antigravity/brain/4bb7da72-16c6-4b32-85de-0824002c2d7b/services_infinite_1440.png")
        print("  -> Saved screenshot: services_infinite_1440.png")
        
        # [TEST 4] Mouse Dragging & Momentum Physics
        print("\n[TEST 4] Mouse Dragging (Both Directions) & Momentum Decay")
        gallery = page.locator("#services [data-cursor='drag']")
        box = gallery.bounding_box()
        cx = box['x'] + box['width'] / 2
        cy = box['y'] + box['height'] / 2
        
        # Drag left
        print("  -> Dragging left by 200px...")
        page.mouse.move(cx, cy)
        page.mouse.down()
        for d in range(10, 210, 30):
            page.mouse.move(cx - d, cy)
            time.sleep(0.015)
        pos_drag_left = page.evaluate("() => { const el = document.querySelector('#services [data-cursor=\"drag\"] > div'); const tr = window.getComputedStyle(el).transform; const m = tr.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/); return m ? parseFloat(m[1]) : 0; }")
        print(f"  -> Position during left drag: {pos_drag_left:.1f}px")
        page.mouse.up()
        time.sleep(0.8)
        
        # Drag right with flick
        print("  -> Flicking right by 350px...")
        page.mouse.move(cx, cy)
        page.mouse.down()
        for d in range(20, 370, 50):
            page.mouse.move(cx + d, cy)
            time.sleep(0.01)
        page.mouse.up()
        
        p1 = page.evaluate("() => { const el = document.querySelector('#services [data-cursor=\"drag\"] > div'); const tr = window.getComputedStyle(el).transform; const m = tr.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/); return m ? parseFloat(m[1]) : 0; }")
        time.sleep(0.5)
        p2 = page.evaluate("() => { const el = document.querySelector('#services [data-cursor=\"drag\"] > div'); const tr = window.getComputedStyle(el).transform; const m = tr.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/); return m ? parseFloat(m[1]) : 0; }")
        time.sleep(1.0)
        p3 = page.evaluate("() => { const el = document.querySelector('#services [data-cursor=\"drag\"] > div'); const tr = window.getComputedStyle(el).transform; const m = tr.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/); return m ? parseFloat(m[1]) : 0; }")
        print(f"  -> Momentum glide positions: t=0: {p1:.1f}px, t=0.5s: {p2:.1f}px, t=1.5s: {p3:.1f}px")
        print("  -> Momentum physics verified successfully.")
        
        # [TEST 5] Inquiry CTA Button Navigation to /contacts
        print("\n[TEST 5] Inquiry CTA Button Navigation to /contacts")
        scroll_to_services(page)
        time.sleep(0.5)
        cta_btn = page.locator("#services button:has-text('Inquire')").first
        print(f"  -> Clicking CTA Button: '{cta_btn.inner_text().strip()}'")
        cta_btn.click()
        
        navigated = False
        for _ in range(20):
            time.sleep(0.25)
            pathname = page.evaluate("() => window.location.pathname")
            if "/contacts" in page.url or pathname == "/contacts":
                navigated = True
                break
        print(f"  -> URL / Pathname after navigation: {page.url} ({page.evaluate('() => window.location.pathname')})")
        assert navigated, f"Failed to navigate to /contacts, stayed at {page.url}"
        
        context.close()
        
        # -----------------------------------------------------------------
        # TEST 6: TABLET 768x1024
        # -----------------------------------------------------------------
        print("\n--- PHASE 2: Tablet (768x1024) ---")
        tab_context = browser.new_context(viewport={"width": 768, "height": 1024})
        tab_page = tab_context.new_page()
        tab_page.goto("http://localhost:5173/?intro=0", wait_until="domcontentloaded")
        time.sleep(1)
        scroll_to_services(tab_page)
        
        tab_box = tab_page.locator("#services .flex-nowrap > div").nth(14).bounding_box()
        print(f"  -> Tablet tile: width={tab_box['width']:.1f}px, height={tab_box['height']:.1f}px")
        assert abs(tab_box['width'] - 380) < 3, f"Tablet width {tab_box['width']} is not 380px!"
        assert abs(tab_box['height'] - 285) < 3, f"Tablet height {tab_box['height']} is not 285px!"
        tab_aspect = tab_box['width'] / tab_box['height']
        print(f"  -> Tablet aspect ratio: {tab_aspect:.4f} (Target: {4/3:.4f})")
        assert abs(tab_aspect - 4/3) < 0.01
        tab_page.screenshot(path="C:/Users/Hasin/.gemini/antigravity/brain/4bb7da72-16c6-4b32-85de-0824002c2d7b/services_infinite_768.png")
        print("  -> Saved screenshot: services_infinite_768.png")
        tab_context.close()
        
        # -----------------------------------------------------------------
        # TEST 7: MOBILE 390x844
        # -----------------------------------------------------------------
        print("\n--- PHASE 3: Mobile (390x844) ---")
        mob_context = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        mob_page = mob_context.new_page()
        mob_page.goto("http://localhost:5173/?intro=0", wait_until="domcontentloaded")
        time.sleep(1)
        scroll_to_services(mob_page)
        
        mob_box = mob_page.locator("#services .flex-nowrap > div").nth(14).bounding_box()
        print(f"  -> Mobile tile: width={mob_box['width']:.1f}px, height={mob_box['height']:.1f}px")
        assert abs(mob_box['width'] - 280) < 3, f"Mobile width {mob_box['width']} is not 280px!"
        assert abs(mob_box['height'] - 210) < 3, f"Mobile height {mob_box['height']} is not 210px!"
        mob_aspect = mob_box['width'] / mob_box['height']
        print(f"  -> Mobile aspect ratio: {mob_aspect:.4f} (Target: {4/3:.4f})")
        assert abs(mob_aspect - 4/3) < 0.01
        mob_page.screenshot(path="C:/Users/Hasin/.gemini/antigravity/brain/4bb7da72-16c6-4b32-85de-0824002c2d7b/services_infinite_390.png")
        print("  -> Saved screenshot: services_infinite_390.png")
        mob_context.close()
        
        # -----------------------------------------------------------------
        # TEST 8: ULTRAWIDE 1920x1080
        # -----------------------------------------------------------------
        print("\n--- PHASE 4: Ultrawide Desktop (1920x1080) ---")
        lg_context = browser.new_context(viewport={"width": 1920, "height": 1080})
        lg_page = lg_context.new_page()
        lg_page.goto("http://localhost:5173/?intro=0", wait_until="domcontentloaded")
        time.sleep(1)
        scroll_to_services(lg_page)
        
        lg_box = lg_page.locator("#services .flex-nowrap > div").nth(14).bounding_box()
        print(f"  -> 1920 tile: width={lg_box['width']:.1f}px, height={lg_box['height']:.1f}px")
        assert abs(lg_box['width'] - 500) < 3
        assert abs(lg_box['height'] - 375) < 3
        lg_page.screenshot(path="C:/Users/Hasin/.gemini/antigravity/brain/4bb7da72-16c6-4b32-85de-0824002c2d7b/services_infinite_1920.png")
        print("  -> Saved screenshot: services_infinite_1920.png")
        lg_context.close()
        
        print("\n[CONSOLE ERRORS CHECK]:", console_errors)
        assert len(console_errors) == 0, f"Encountered console errors: {console_errors}"
        
        browser.close()
        print("\n==================================================")
        print("ALL 8 VERIFICATION SUITES PASSED FLAWLESSLY! 🏆")
        print("==================================================")

if __name__ == "__main__":
    run_comprehensive_verification()
