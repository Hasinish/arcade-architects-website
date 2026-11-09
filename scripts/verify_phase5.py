import json
import os
from PIL import Image
from playwright.sync_api import sync_playwright

def verify_phase5():
    os.makedirs("audit/frames", exist_ok=True)
    os.makedirs("audit/comparisons", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")

        # -------------------------------------------------------------
        # 1. Localhost Audit
        # -------------------------------------------------------------
        print("Testing Localhost Phase 5...")
        p_local = browser.new_page(viewport={"width": 1440, "height": 900})
        p_local.goto("http://localhost:5173/", wait_until="load", timeout=20000)
        p_local.wait_for_timeout(1000)

        # A. About Section Illumination Test
        about_top = p_local.evaluate("() => document.querySelector('#about').getBoundingClientRect().top + window.scrollY")
        
        # Frame 1: Initial (approaching about section)
        p_local.evaluate(f"window.scrollTo(0, {about_top - 300})")
        p_local.wait_for_timeout(300)
        p_local.screenshot(path="audit/frames/local_about_initial_faded.png")
        faded_words = p_local.evaluate("""() => {
            const spans = Array.from(document.querySelectorAll('#about h2 span'));
            return spans.map(s => s.style.color);
        }""")

        # Frame 2: Midway (partially illuminated)
        p_local.evaluate(f"window.scrollTo(0, {about_top + 100})")
        p_local.wait_for_timeout(300)
        p_local.screenshot(path="audit/frames/local_about_partial.png")
        partial_words = p_local.evaluate("""() => {
            const spans = Array.from(document.querySelectorAll('#about h2 span'));
            return spans.map(s => s.style.color);
        }""")

        # Frame 3: Fully illuminated + Stats strip
        p_local.evaluate(f"window.scrollTo(0, {about_top + 350})")
        p_local.wait_for_timeout(300)
        p_local.screenshot(path="audit/frames/local_about_fully_illuminated.png")
        full_words = p_local.evaluate("""() => {
            const spans = Array.from(document.querySelectorAll('#about h2 span'));
            return spans.map(s => s.style.color);
        }""")

        print(f"About illumination - Faded: {faded_words[:4]} | Full: {full_words[:4]}")

        # B. Advantages Section Pinning Test (300vh runway)
        adv_top = p_local.evaluate("() => document.querySelector('#advantages').getBoundingClientRect().top + window.scrollY")
        print(f"Advantages section top: {adv_top}")

        adv_frames = {}
        # Test 4 steps through the runway:
        # progress 0.1 -> item 01
        # progress 0.35 -> item 02
        # progress 0.6 -> item 03
        # progress 0.85 -> item 04
        # past runway -> unpinned
        offsets = [
            ("adv_01", 100),
            ("adv_02", 550),
            ("adv_03", 1050),
            ("adv_04", 1550),
            ("adv_unpin", 2100)
        ]

        for label, off in offsets:
            p_local.evaluate(f"window.scrollTo(0, {adv_top + off})")
            p_local.wait_for_timeout(300)
            state = p_local.evaluate("""() => {
                const activeAdv = document.querySelector('#advantages .max-h-40');
                const activeImg = Array.from(document.querySelectorAll('#advantages img')).map((img, i) => ({
                    index: i,
                    opacity: window.getComputedStyle(img.parentElement).opacity
                }));
                const stickyDiv = document.querySelector('#advantages .sticky');
                return {
                    activeTitle: activeAdv?.previousElementSibling?.querySelector('h3')?.textContent?.trim(),
                    images: activeImg,
                    stickyTop: stickyDiv?.getBoundingClientRect().top
                };
            }""")
            adv_frames[label] = state
            p_local.screenshot(path=f"audit/frames/local_{label}.png")
            print(f"Advantages {label}:", state)

        # Real mouse-wheel test inside advantages section
        print("Testing real mouse wheel inside Advantages...")
        p_local.evaluate(f"window.scrollTo(0, {adv_top})")
        p_local.wait_for_timeout(200)
        p_local.mouse.move(720, 450)
        p_local.mouse.wheel(0, 600)
        p_local.wait_for_timeout(400)
        wheel_adv = p_local.evaluate("""() => {
            const activeAdv = document.querySelector('#advantages .max-h-40');
            return {
                scrollY: window.scrollY,
                activeTitle: activeAdv?.previousElementSibling?.querySelector('h3')?.textContent?.trim()
            };
        }""")
        print("Mouse wheel advantages:", wheel_adv)

        # -------------------------------------------------------------
        # 2. Inspect Bloom3D at matching sections
        # -------------------------------------------------------------
        print("Testing Bloom3D Phase 5...")
        p_bloom = browser.new_page(viewport={"width": 1440, "height": 900})
        p_bloom.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        p_bloom.wait_for_timeout(2000)

        b_about_top = p_bloom.evaluate("() => document.querySelector('.section_about').getBoundingClientRect().top + window.scrollY")
        p_bloom.evaluate(f"window.scrollTo(0, {b_about_top + 200})")
        p_bloom.wait_for_timeout(400)
        p_bloom.screenshot(path="audit/frames/bloom_about.png")

        b_adv_top = p_bloom.evaluate("() => document.querySelector('.section_advantages').getBoundingClientRect().top + window.scrollY")
        p_bloom.evaluate(f"window.scrollTo(0, {b_adv_top + 100})")
        p_bloom.wait_for_timeout(400)
        p_bloom.screenshot(path="audit/frames/bloom_adv_01.png")

        p_bloom.evaluate(f"window.scrollTo(0, {b_adv_top + 500})")
        p_bloom.wait_for_timeout(400)
        p_bloom.screenshot(path="audit/frames/bloom_adv_02.png")

        # -------------------------------------------------------------
        # 3. Side-by-Side Comparisons
        # -------------------------------------------------------------
        # About comparison
        img_ba = Image.open("audit/frames/bloom_about.png")
        img_la = Image.open("audit/frames/local_about_fully_illuminated.png")
        comp_a = Image.new("RGB", (img_ba.width + img_la.width, img_ba.height))
        comp_a.paste(img_ba, (0, 0))
        comp_a.paste(img_la, (img_ba.width, 0))
        comp_a.save("audit/comparisons/comp_phase5_about.png")
        print("Saved audit/comparisons/comp_phase5_about.png")

        # Advantages 01 comparison
        img_badv1 = Image.open("audit/frames/bloom_adv_01.png")
        img_ladv1 = Image.open("audit/frames/local_adv_01.png")
        comp_adv1 = Image.new("RGB", (img_badv1.width + img_ladv1.width, img_badv1.height))
        comp_adv1.paste(img_badv1, (0, 0))
        comp_adv1.paste(img_ladv1, (img_badv1.width, 0))
        comp_adv1.save("audit/comparisons/comp_phase5_advantages_01.png")
        print("Saved audit/comparisons/comp_phase5_advantages_01.png")

        # Mobile check at 390px
        p_mob = browser.new_page(viewport={"width": 390, "height": 844})
        p_mob.goto("http://localhost:5173/", wait_until="load", timeout=15000)
        m_about = p_mob.evaluate("() => document.querySelector('#about').getBoundingClientRect().top + window.scrollY")
        p_mob.evaluate(f"window.scrollTo(0, {m_about})")
        p_mob.wait_for_timeout(300)
        p_mob.screenshot(path="audit/frames/local_about_mobile_390.png")

        m_adv = p_mob.evaluate("() => document.querySelector('#advantages').getBoundingClientRect().top + window.scrollY")
        p_mob.evaluate(f"window.scrollTo(0, {m_adv})")
        p_mob.wait_for_timeout(300)
        p_mob.screenshot(path="audit/frames/local_advantages_mobile_390.png")
        print("Saved mobile captures.")

        # -------------------------------------------------------------
        # 4. Verify Previous Phases Integrity (Hero Curtain & Portfolio)
        # -------------------------------------------------------------
        p_local.evaluate("window.scrollTo(0, 0)")
        p_local.wait_for_timeout(200)
        hero_check = p_local.evaluate("""() => {
            const video = document.querySelector('video');
            const port = document.querySelector('#portfolio');
            return {
                videoTop: video ? video.getBoundingClientRect().top : null,
                portTop: port ? port.getBoundingClientRect().top : null
            };
        }""")
        print("Integrity check (y=0):", hero_check)

        with open("audit/phase5_verification_data.json", "w") as f:
            json.dump({
                "about": {"faded": faded_words[:5], "full": full_words[:5]},
                "advantages": adv_frames,
                "wheel": wheel_adv,
                "integrity": hero_check
            }, f, indent=2)

        p_local.close()
        p_bloom.close()
        p_mob.close()
        browser.close()
        print("Phase 5 verification successfully completed!")

if __name__ == "__main__":
    verify_phase5()

