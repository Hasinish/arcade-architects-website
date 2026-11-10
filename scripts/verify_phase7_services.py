import os
import json
import time
from playwright.sync_api import sync_playwright
from PIL import Image

def make_side_by_side(img1_path, img2_path, out_path, title1="Snøhetta Reference", title2="Arcade Localhost"):
    if not os.path.exists(img1_path) or not os.path.exists(img2_path):
        print(f"Skipping {out_path}, missing input file: {img1_path} or {img2_path}")
        return
    
    im1 = Image.open(img1_path)
    im2 = Image.open(img2_path)
    
    h = min(im1.height, im2.height, 900)
    w1 = int(im1.width * (h / im1.height))
    w2 = int(im2.width * (h / im2.height))
    
    im1_resized = im1.resize((w1, h), Image.Resampling.LANCZOS)
    im2_resized = im2.resize((w2, h), Image.Resampling.LANCZOS)
    
    combined = Image.new("RGB", (w1 + w2 + 8, h), (20, 20, 20))
    combined.paste(im1_resized, (0, 0))
    combined.paste(im2_resized, (w1 + 8, 0))
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    combined.save(out_path)
    print(f"Saved side-by-side comparison to {out_path}")

def main():
    os.makedirs("audit/frames", exist_ok=True)
    os.makedirs("audit/comparisons", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:5173/", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        # 1. Locate #services and scroll to it
        srv_top = page.evaluate("""() => {
            const el = document.querySelector('#services');
            return el ? el.getBoundingClientRect().top + window.scrollY : 2500;
        }""")
        print(f"Services section top: {srv_top}")
        page.evaluate(f"window.scrollTo(0, {srv_top})")
        page.wait_for_timeout(800)

        # Capture initial state
        page.screenshot(path="audit/frames/local_services_initial.png")
        print("Captured audit/frames/local_services_initial.png")

        # Measure initial slide dimensions
        initial_metrics = page.evaluate("""() => {
            const track = document.querySelector('#services [class*="touch-none"]');
            if (!track) return null;
            const slides = Array.from(track.children).map((slide, i) => {
                const r = slide.getBoundingClientRect();
                return {
                    index: i,
                    rect: { x: r.x, y: r.y, width: r.width, height: r.height },
                    zIndex: window.getComputedStyle(slide).zIndex
                };
            });
            const caption = document.querySelector('#services .font-display.text-lg, #services h3');
            return {
                trackRect: track.getBoundingClientRect(),
                slides,
                activeTitle: caption ? caption.innerText.trim() : null
            };
        }""")
        print("Initial Localhost Metrics:")
        print(json.dumps(initial_metrics, indent=2))

        # 2. Perform interactive mouse drag from right to left
        print("Dragging on localhost from 720 to 520...")
        page.mouse.move(720, 480)
        page.mouse.down()
        page.wait_for_timeout(100)

        # Mid-drag move
        page.mouse.move(570, 480, steps=5)
        page.wait_for_timeout(200)
        page.screenshot(path="audit/frames/local_services_dragging.png")
        print("Captured audit/frames/local_services_dragging.png")

        mid_metrics = page.evaluate("""() => {
            const track = document.querySelector('#services [class*="touch-none"]');
            if (!track) return null;
            return Array.from(track.children).map(s => {
                const r = s.getBoundingClientRect();
                return { x: r.x, width: r.width, height: r.height };
            });
        }""")
        print("Mid-drag Localhost Metrics:")
        print(json.dumps(mid_metrics, indent=2))

        # Complete drag and release
        page.mouse.move(450, 480, steps=5)
        page.wait_for_timeout(100)
        page.mouse.up()
        print("Mouse released, waiting for snap settling...")
        page.wait_for_timeout(800)

        # Capture settled state
        page.screenshot(path="audit/frames/local_services_settled.png")
        print("Captured audit/frames/local_services_settled.png")

        settled_metrics = page.evaluate("""() => {
            const track = document.querySelector('#services [class*="touch-none"]');
            if (!track) return null;
            const slides = Array.from(track.children).map((slide, i) => {
                const r = slide.getBoundingClientRect();
                return {
                    index: i,
                    rect: { x: r.x, y: r.y, width: r.width, height: r.height },
                    zIndex: window.getComputedStyle(slide).zIndex
                };
            });
            const caption = document.querySelector('#services h3');
            return {
                slides,
                activeTitle: caption ? caption.innerText.trim() : null
            };
        }""")
        print("Settled Localhost Metrics:")
        print(json.dumps(settled_metrics, indent=2))

        # 3. Test Mobile Viewport (390x844)
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(500)
        srv_top_mobile = page.evaluate("""() => {
            const el = document.querySelector('#services');
            return el ? el.getBoundingClientRect().top + window.scrollY : 2500;
        }""")
        page.evaluate(f"window.scrollTo(0, {srv_top_mobile})")
        page.wait_for_timeout(800)
        page.screenshot(path="audit/frames/local_services_mobile_390.png")
        print("Captured audit/frames/local_services_mobile_390.png")

        mobile_metrics = page.evaluate("""() => {
            const track = document.querySelector('#services [class*="touch-none"]');
            if (!track) return null;
            return Array.from(track.children).map((s, i) => {
                const r = s.getBoundingClientRect();
                return {
                    index: i,
                    rect: { x: r.x, y: r.y, width: r.width, height: r.height }
                };
            });
        }""")
        print("Mobile Localhost Metrics:")
        print(json.dumps(mobile_metrics, indent=2))

        browser.close()

    # Generate side-by-side comparison images
    make_side_by_side(
        "audit/frames/snohetta_drag_0_initial.png",
        "audit/frames/local_services_initial.png",
        "audit/comparisons/phase7_services_initial_comparison.png",
        "Snøhetta Initial",
        "Arcade Localhost Initial"
    )

    make_side_by_side(
        "audit/frames/snohetta_drag_1_moving.png",
        "audit/frames/local_services_dragging.png",
        "audit/comparisons/phase7_services_dragging_comparison.png",
        "Snøhetta Dragging",
        "Arcade Localhost Dragging"
    )

    make_side_by_side(
        "audit/frames/snohetta_drag_2_settled.png",
        "audit/frames/local_services_settled.png",
        "audit/comparisons/phase7_services_settled_comparison.png",
        "Snøhetta Settled",
        "Arcade Localhost Settled"
    )

    make_side_by_side(
        "audit/frames/snohetta_mobile_390.png",
        "audit/frames/local_services_mobile_390.png",
        "audit/comparisons/phase7_services_mobile_comparison.png",
        "Snøhetta Mobile (390)",
        "Arcade Localhost Mobile (390)"
    )

if __name__ == "__main__":
    main()

