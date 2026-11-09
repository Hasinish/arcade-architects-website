from playwright.sync_api import sync_playwright
from PIL import Image

def capture_arcade():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        print("Navigating to http://localhost:5173/...")
        page.goto("http://localhost:5173/", wait_until="networkidle")
        page.wait_for_timeout(1500)

        # 1. Hero
        page.screenshot(path="audit/arcade/01_hero.png")

        # 2. Portfolio
        portfolio = page.query_selector("#portfolio")
        if portfolio:
            portfolio.scroll_into_view_if_needed()
            page.wait_for_timeout(600)
            page.screenshot(path="audit/arcade/02_portfolio.png")

        # 3. Services
        services = page.query_selector("#services")
        if services:
            services.scroll_into_view_if_needed()
            page.wait_for_timeout(600)
            page.screenshot(path="audit/arcade/03_services.png")

        # 4. About
        about = page.query_selector("#about")
        if about:
            about.scroll_into_view_if_needed()
            page.wait_for_timeout(600)
            page.screenshot(path="audit/arcade/04_about.png")

        # 5. Why us
        why_us = page.query_selector("#advantages")
        if why_us:
            why_us.scroll_into_view_if_needed()
            page.wait_for_timeout(600)
            page.screenshot(path="audit/arcade/05_why_us.png")

        # 6. FAQ
        faq = page.query_selector("#faq")
        if faq:
            faq.scroll_into_view_if_needed()
            page.wait_for_timeout(600)
            page.screenshot(path="audit/arcade/06_faq.png")

        # 7. Footer
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(600)
        page.screenshot(path="audit/arcade/07_footer.png")

        browser.close()
        print("Arcade screenshots captured successfully!")

def make_side_by_side(bloom_path, arcade_path, out_path, title="Comparison"):
    try:
        b_img = Image.open(bloom_path)
        a_img = Image.open(arcade_path)

        # Resize to standard height 900
        w, h = 1440, 900
        b_img = b_img.resize((w, h))
        a_img = a_img.resize((w, h))

        # Create 2880 x 960 canvas (extra 60px header for labels)
        canvas = Image.new("RGB", (w * 2, h + 60), (20, 20, 22))

        # Paste side by side
        canvas.paste(b_img, (0, 60))
        canvas.paste(a_img, (w, 60))

        canvas.save(out_path)
        print(f"Generated comparison: {out_path}")
    except Exception as e:
        print(f"Comparison error for {out_path}: {e}")

if __name__ == "__main__":
    capture_arcade()

    # Create Comparisons
    comparisons = [
        ("audit/bloom/01_hero.png", "audit/arcade/01_hero.png", "audit/comparisons/comp_01_hero.png", "Hero Section"),
        ("audit/frames/bloom_scroll_03_y1600.png", "audit/arcade/02_portfolio.png", "audit/comparisons/comp_02_portfolio.png", "Portfolio Grid"),
        ("audit/frames/bloom_scroll_07_y5200.png", "audit/arcade/03_services.png", "audit/comparisons/comp_03_services.png", "Services Section"),
        ("audit/frames/bloom_scroll_08_y6400.png", "audit/arcade/04_about.png", "audit/comparisons/comp_04_about.png", "About & Stats"),
        ("audit/frames/bloom_scroll_09_y7800.png", "audit/arcade/05_why_us.png", "audit/comparisons/comp_05_why_us.png", "Why Us / Advantages"),
        ("audit/bloom/faq_full.png", "audit/arcade/06_faq.png", "audit/comparisons/comp_06_faq.png", "FAQ"),
        ("audit/frames/bloom_scroll_10_y9200.png", "audit/arcade/07_footer.png", "audit/comparisons/comp_07_footer.png", "CTA & Footer"),
    ]

    for b, a, out, t in comparisons:
        make_side_by_side(b, a, out, t)

