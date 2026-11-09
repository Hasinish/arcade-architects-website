from playwright.sync_api import sync_playwright
from PIL import Image

def capture_frames():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        
        # 1. Capture Bloom3D frames
        print("[1/3] Capturing Bloom3D scroll frames...")
        b_page = browser.new_page(viewport={"width": 1440, "height": 900})
        b_page.goto("https://www.bloom3d.studio/", wait_until="domcontentloaded")
        b_page.wait_for_timeout(2500)

        scroll_points = [0, 350, 700, 1100]
        for y in scroll_points:
            b_page.evaluate(f"window.scrollTo(0, {y})")
            b_page.wait_for_timeout(600)
            b_page.screenshot(path=f"audit/bloom/curtain_y{y}.png")

        b_page.close()

        # 2. Capture Arcade Architects frames
        print("[2/3] Capturing Arcade Architects scroll frames...")
        a_page = browser.new_page(viewport={"width": 1440, "height": 900})
        a_page.goto("http://localhost:5173/", wait_until="networkidle")
        a_page.wait_for_timeout(1500)

        for y in scroll_points:
            a_page.evaluate(f"window.scrollTo(0, {y})")
            a_page.wait_for_timeout(600)
            a_page.screenshot(path=f"audit/arcade/curtain_y{y}.png")

        a_page.close()
        browser.close()

def generate_comparisons():
    print("[3/3] Generating side-by-side comparison images...")
    scroll_points = [0, 350, 700, 1100]

    for y in scroll_points:
        b_img = Image.open(f"audit/bloom/curtain_y{y}.png").resize((1440, 900))
        a_img = Image.open(f"audit/arcade/curtain_y{y}.png").resize((1440, 900))

        canvas = Image.new("RGB", (2880, 960), (20, 20, 22))
        canvas.paste(b_img, (0, 60))
        canvas.paste(a_img, (1440, 60))

        out_path = f"audit/comparisons/comp_phase2_curtain_y{y}.png"
        canvas.save(out_path)
        print(f"Saved: {out_path}")

if __name__ == "__main__":
    capture_frames()
    generate_comparisons()

