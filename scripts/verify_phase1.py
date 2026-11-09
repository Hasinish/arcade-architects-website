from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        print("[1/4] Navigating to http://localhost:5173/...")
        page.goto("http://localhost:5173/", wait_until="networkidle")
        page.wait_for_timeout(1500)

        # 1. Capture Header in default closed state
        print("[2/4] Capturing default closed header...")
        page.screenshot(path="audit/arcade/phase1_header_closed.png")

        # 2. Click the hamburger button
        print("[3/4] Clicking burger button...")
        burger = page.query_selector('button[aria-label*="Navigation"]')
        if burger:
            burger.click()
            page.wait_for_timeout(800)  # Wait for 0.6s drawer transition
            page.screenshot(path="audit/arcade/phase1_drawer_open.png")
            print("Captured phase1_drawer_open.png!")

            # Click again to close
            burger.click()
            page.wait_for_timeout(800)
            page.screenshot(path="audit/arcade/phase1_drawer_closed.png")
            print("Captured phase1_drawer_closed.png!")

        browser.close()

def create_comparisons():
    print("[4/4] Creating side-by-side & overlay comparison images...")
    
    # 1. Drawer Comparison
    b_drawer = Image.open("audit/bloom/02_menu_open.png").resize((1440, 900))
    a_drawer = Image.open("audit/arcade/phase1_drawer_open.png").resize((1440, 900))

    comp_drawer = Image.new("RGB", (2880, 960), (20, 20, 22))
    comp_drawer.paste(b_drawer, (0, 60))
    comp_drawer.paste(a_drawer, (1440, 60))
    comp_drawer.save("audit/comparisons/comp_phase1_drawer.png")
    print("Saved audit/comparisons/comp_phase1_drawer.png")

    # 2. Closed Header Comparison
    b_hero = Image.open("audit/bloom/01_hero.png").resize((1440, 900))
    a_hero = Image.open("audit/arcade/phase1_header_closed.png").resize((1440, 900))

    comp_header = Image.new("RGB", (2880, 960), (20, 20, 22))
    comp_header.paste(b_hero, (0, 60))
    comp_header.paste(a_hero, (1440, 60))
    comp_header.save("audit/comparisons/comp_phase1_header.png")
    print("Saved audit/comparisons/comp_phase1_header.png")

    # 3. Drawer Cropped Side-by-Side (Zoom into the 480px drawer only)
    # Right 480px of 1440 is from x=960 to x=1440
    b_crop = b_drawer.crop((960, 0, 1440, 900))
    a_crop = a_drawer.crop((960, 0, 1440, 900))

    comp_crop = Image.new("RGB", (960, 960), (240, 240, 240))
    comp_crop.paste(b_crop, (0, 60))
    comp_crop.paste(a_crop, (480, 60))
    comp_crop.save("audit/comparisons/comp_phase1_drawer_crop.png")
    print("Saved audit/comparisons/comp_phase1_drawer_crop.png")

if __name__ == "__main__":
    verify()
    create_comparisons()

