import json
import os
from PIL import Image
from playwright.sync_api import sync_playwright

def verify_phase4():
    os.makedirs("audit/frames", exist_ok=True)
    os.makedirs("audit/comparisons", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")

        # -------------------------------------------------------------
        # 1. Inspect Localhost Services Section
        # -------------------------------------------------------------
        print("Testing Localhost Services...")
        p_local = browser.new_page(viewport={"width": 1440, "height": 900})
        p_local.goto("http://localhost:5173/", wait_until="load", timeout=20000)
        p_local.wait_for_timeout(1000)

        # Scroll so services section is centered in viewport
        s_top = p_local.evaluate("() => document.querySelector('#services').getBoundingClientRect().top + window.scrollY")
        p_local.evaluate(f"window.scrollTo(0, {s_top})")
        p_local.wait_for_timeout(400)

        local_data = p_local.evaluate("""() => {
            const heading = document.querySelector('#services h2');
            const stage = document.querySelector('#services [style*=\"perspective\"]');
            const cylinder = stage ? stage.querySelector('div') : null;
            const cards = stage ? Array.from(stage.querySelectorAll('.group')) : [];

            const csH = heading ? window.getComputedStyle(heading) : null;
            const csS = stage ? window.getComputedStyle(stage) : null;
            const csC = cylinder ? window.getComputedStyle(cylinder) : null;

            return {
                heading: {
                    text: heading?.textContent?.trim(),
                    fontSize: csH?.fontSize,
                    fontWeight: csH?.fontWeight,
                    lineHeight: csH?.lineHeight,
                    letterSpacing: csH?.letterSpacing,
                    textAlign: csH?.textAlign,
                    color: csH?.color
                },
                stage: {
                    perspective: csS?.perspective,
                    width: csS?.width,
                    height: csS?.height
                },
                cylinder: {
                    transform: csC?.transform,
                    transformStyle: csC?.transformStyle,
                    width: csC?.width,
                    height: csC?.height
                },
                cardCount: cards.length,
                firstCard: cards[0] ? {
                    width: window.getComputedStyle(cards[0]).width,
                    height: window.getComputedStyle(cards[0]).height,
                    transform: window.getComputedStyle(cards[0]).transform,
                    backfaceVisibility: window.getComputedStyle(cards[0]).backfaceVisibility
                } : null
            };
        }""")
        print("Local Services Data:", json.dumps(local_data, indent=2))
        p_local.screenshot(path="audit/frames/local_services_initial.png")

        # Scroll through services and capture intermediate rotation frames
        scroll_frames = []
        for delta in [0, 200, 400, 600]:
            p_local.evaluate(f"window.scrollTo(0, {s_top + delta})")
            p_local.wait_for_timeout(200)
            rot = p_local.evaluate("() => document.querySelector('#services [style*=\"preserve-3d\"]').style.transform")
            scroll_frames.append({"delta": delta, "transform": rot})
            p_local.screenshot(path=f"audit/frames/local_services_scroll_{delta}.png")

        print("Local Scroll Frames:", scroll_frames)

        # Test Drag Interaction with Mouse
        print("Testing Drag Interaction...")
        stage_box = p_local.locator("#services [style*=\"perspective\"]").bounding_box()
        p_local.mouse.move(stage_box["x"] + 500, stage_box["y"] + 250)
        p_local.mouse.down()
        p_local.mouse.move(stage_box["x"] + 200, stage_box["y"] + 250, steps=10)
        p_local.wait_for_timeout(200)
        drag_rot = p_local.evaluate("() => document.querySelector('#services [style*=\"preserve-3d\"]').style.transform")
        p_local.screenshot(path="audit/frames/local_services_drag.png")
        p_local.mouse.up()
        print("Local Drag Result Transform:", drag_rot)

        # -------------------------------------------------------------
        # 2. Inspect Bloom3D Services Section
        # -------------------------------------------------------------
        print("Testing Bloom3D Services...")
        p_bloom = browser.new_page(viewport={"width": 1440, "height": 900})
        p_bloom.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        p_bloom.wait_for_timeout(2000)

        b_top = p_bloom.evaluate("() => document.querySelector('.section_services').getBoundingClientRect().top + window.scrollY")
        p_bloom.evaluate(f"window.scrollTo(0, {b_top})")
        p_bloom.wait_for_timeout(400)
        p_bloom.screenshot(path="audit/frames/bloom_services_initial.png")

        bloom_data = p_bloom.evaluate("""() => {
            const heading = document.querySelector('.section_services h2.services_heading');
            const container = document.querySelector('.carousel_container');
            const carousel = document.querySelector('.carousel');
            const cards = Array.from(document.querySelectorAll('.carousel_card'));

            const csH = heading ? window.getComputedStyle(heading) : null;
            const csC = container ? window.getComputedStyle(container) : null;
            const csCar = carousel ? window.getComputedStyle(carousel) : null;

            return {
                heading: {
                    text: heading?.textContent?.trim(),
                    fontSize: csH?.fontSize,
                    fontWeight: csH?.fontWeight,
                    lineHeight: csH?.lineHeight,
                    letterSpacing: csH?.letterSpacing,
                    textAlign: csH?.textAlign,
                    color: csH?.color
                },
                stage: {
                    perspective: csC?.perspective,
                    width: csC?.width,
                    height: csC?.height
                },
                cylinder: {
                    transform: csCar?.transform,
                    transformStyle: csCar?.transformStyle,
                    width: csCar?.width,
                    height: csCar?.height
                },
                cardCount: cards.length,
                firstCard: cards[0] ? {
                    width: window.getComputedStyle(cards[0]).width,
                    height: window.getComputedStyle(cards[0]).height,
                    transform: window.getComputedStyle(cards[0]).transform,
                    backfaceVisibility: window.getComputedStyle(cards[0]).backfaceVisibility
                } : null
            };
        }""")
        print("Bloom Services Data:", json.dumps(bloom_data, indent=2))

        # -------------------------------------------------------------
        # 3. Create Side-by-Side Comparison Images
        # -------------------------------------------------------------
        # Initial Stage View
        img_b = Image.open("audit/frames/bloom_services_initial.png")
        img_l = Image.open("audit/frames/local_services_initial.png")
        comp = Image.new("RGB", (img_b.width + img_l.width, img_b.height))
        comp.paste(img_b, (0, 0))
        comp.paste(img_l, (img_b.width, 0))
        comp.save("audit/comparisons/comp_phase4_services_stage.png")
        print("Saved audit/comparisons/comp_phase4_services_stage.png")

        # Mobile check at 390px
        p_mobile = browser.new_page(viewport={"width": 390, "height": 844})
        p_mobile.goto("http://localhost:5173/", wait_until="load", timeout=15000)
        ms_top = p_mobile.evaluate("() => document.querySelector('#services').getBoundingClientRect().top + window.scrollY")
        p_mobile.evaluate(f"window.scrollTo(0, {ms_top})")
        p_mobile.wait_for_timeout(300)
        p_mobile.screenshot(path="audit/frames/local_services_mobile_390.png")
        print("Saved audit/frames/local_services_mobile_390.png")

        with open("audit/phase4_verification_data.json", "w") as f:
            json.dump({"local": local_data, "bloom": bloom_data, "scroll_frames": scroll_frames, "drag_rot": drag_rot}, f, indent=2)

        p_local.close()
        p_bloom.close()
        p_mobile.close()
        browser.close()
        print("Phase 4 verification successfully completed!")

if __name__ == "__main__":
    verify_phase4()

