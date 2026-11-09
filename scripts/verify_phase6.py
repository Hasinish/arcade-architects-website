import os
import json
import time
from playwright.sync_api import sync_playwright
from PIL import Image

def make_side_by_side(img1_path, img2_path, out_path, title1="Bloom3D Reference", title2="Arcade Localhost"):
    if not os.path.exists(img1_path) or not os.path.exists(img2_path):
        print(f"Skipping {out_path}, missing input file: {img1_path} or {img2_path}")
        return
    
    im1 = Image.open(img1_path)
    im2 = Image.open(img2_path)
    
    # Target height
    h = min(im1.height, im2.height, 900)
    w1 = int(im1.width * (h / im1.height))
    w2 = int(im2.width * (h / im2.height))
    
    im1_resized = im1.resize((w1, h), Image.Resampling.LANCZOS)
    im2_resized = im2.resize((w2, h), Image.Resampling.LANCZOS)
    
    combined = Image.new("RGB", (w1 + w2 + 8, h), (30, 30, 30))
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

        # 1. Inspect CTA Section
        cta_rect = page.evaluate("""() => {
            const cta = document.querySelector('#cta');
            if (cta) return cta.getBoundingClientRect().top + window.scrollY;
            return 7000;
        }""")
        print(f"Local CTA top position: {cta_rect}")
        
        # Scroll to CTA section
        page.evaluate(f"window.scrollTo(0, {cta_rect})")
        page.wait_for_timeout(800)
        page.screenshot(path="audit/frames/local_cta_live.png")
        print("Captured audit/frames/local_cta_live.png")

        # 2. Inspect FAQ Section
        faq_rect = page.evaluate("""() => {
            const faq = document.querySelector('#faq');
            if (faq) return faq.getBoundingClientRect().top + window.scrollY;
            return 8000;
        }""")
        print(f"Local FAQ top position: {faq_rect}")
        
        page.evaluate(f"window.scrollTo(0, {faq_rect})")
        page.wait_for_timeout(800)
        page.screenshot(path="audit/frames/local_faq_live.png")
        print("Captured audit/frames/local_faq_live.png")

        # Click first FAQ item to test toggle
        page.evaluate("document.querySelector('#faq button')?.click()")
        page.wait_for_timeout(500)
        page.screenshot(path="audit/frames/local_faq_toggled.png")
        print("Captured audit/frames/local_faq_toggled.png")

        # 3. Inspect Footer Section
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(800)
        page.screenshot(path="audit/frames/local_footer_live.png")
        print("Captured audit/frames/local_footer_live.png")

        # Gather computed CSS metrics for Phase 6
        metrics = page.evaluate("""() => {
            const ctaHeading = document.querySelector('#cta h2');
            const ctaBtn = document.querySelector('#cta button');
            const faqHeading = document.querySelector('#faq h2');
            const faqItem = document.querySelector('#faq button');
            const footerCard = document.querySelector('footer > div');
            const footerHeading = document.querySelector('footer h2');

            return {
                cta: {
                    headingFontSize: ctaHeading ? window.getComputedStyle(ctaHeading).fontSize : null,
                    headingLineHeight: ctaHeading ? window.getComputedStyle(ctaHeading).lineHeight : null,
                    headingColor: ctaHeading ? window.getComputedStyle(ctaHeading).color : null,
                    btnHeight: ctaBtn ? window.getComputedStyle(ctaBtn).height : null
                },
                faq: {
                    headingFontSize: faqHeading ? window.getComputedStyle(faqHeading).fontSize : null,
                    headingColor: faqHeading ? window.getComputedStyle(faqHeading).color : null,
                    itemPadding: faqItem ? window.getComputedStyle(faqItem).padding : null
                },
                footer: {
                    bg: footerCard ? window.getComputedStyle(footerCard).backgroundColor : null,
                    padding: footerCard ? window.getComputedStyle(footerCard).padding : null,
                    headingFontSize: footerHeading ? window.getComputedStyle(footerHeading).fontSize : null
                }
            };
        }""")
        print("Phase 6 Metrics:")
        print(json.dumps(metrics, indent=2))
        
        with open("audit/phase6_local_metrics.json", "w", encoding="utf-8") as f:
            json.dump(metrics, f, indent=2)

        # Also test Mobile viewport (390x844)
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(500)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(500)
        page.screenshot(path="audit/frames/local_phase6_mobile.png")
        print("Captured audit/frames/local_phase6_mobile.png")

        browser.close()

    # Generate side-by-side images
    make_side_by_side(
        "audit/frames/bloom_cta_live.png",
        "audit/frames/local_cta_live.png",
        "audit/comparisons/phase6_cta_comparison.png",
        "Bloom3D CTA",
        "Arcade Architects CTA"
    )

    make_side_by_side(
        "audit/frames/bloom_faq_live.png",
        "audit/frames/local_faq_live.png",
        "audit/comparisons/phase6_faq_comparison.png",
        "Bloom3D FAQ",
        "Arcade Architects FAQ"
    )

    make_side_by_side(
        "audit/frames/bloom_footer_live.png",
        "audit/frames/local_footer_live.png",
        "audit/comparisons/phase6_footer_comparison.png",
        "Bloom3D Footer",
        "Arcade Architects Footer"
    )

if __name__ == "__main__":
    main()
