from playwright.sync_api import sync_playwright
import json
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.snohetta.com/", wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(2000)

        # Initial screenshot
        page.screenshot(path="audit/frames/snohetta_drag_0_initial.png")

        # Initial metrics
        initial_imgs = page.evaluate("""() => {
            const imgs = Array.from(document.querySelectorAll('.flex.no-js\\\\:overflow-auto img, div[class*=\"overflow\"] img, img')).filter(img => {
                const r = img.getBoundingClientRect();
                return r.top >= 250 && r.top <= 400 && r.width > 50;
            });
            return imgs.map((img, i) => {
                const r = img.getBoundingClientRect();
                return {
                    index: i,
                    src: img.src.split('/').pop().slice(0, 30),
                    rect: { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top }
                };
            });
        }""")
        print("Initial images:", json.dumps(initial_imgs, indent=2))

        # Perform mouse drag from right to left
        print("Dragging from 720 to 420...")
        page.mouse.move(720, 450)
        page.mouse.down()
        page.wait_for_timeout(100)
        
        # Intermediate move
        page.mouse.move(570, 450, steps=5)
        page.wait_for_timeout(200)
        page.screenshot(path="audit/frames/snohetta_drag_1_moving.png")

        mid_imgs = page.evaluate("""() => {
            const imgs = Array.from(document.querySelectorAll('img')).filter(img => {
                const r = img.getBoundingClientRect();
                return r.top >= 250 && r.top <= 400 && r.width > 50;
            });
            return imgs.map(img => {
                const r = img.getBoundingClientRect();
                return { x: r.x, width: r.width, height: r.height };
            });
        }""")
        print("Mid-drag images:", json.dumps(mid_imgs, indent=2))

        # Release mouse
        page.mouse.move(420, 450, steps=5)
        page.wait_for_timeout(100)
        page.mouse.up()
        print("Mouse released, waiting for settle...")
        page.wait_for_timeout(1000)

        # After settle screenshot
        page.screenshot(path="audit/frames/snohetta_drag_2_settled.png")

        settled_imgs = page.evaluate("""() => {
            const imgs = Array.from(document.querySelectorAll('img')).filter(img => {
                const r = img.getBoundingClientRect();
                return r.top >= 250 && r.top <= 400 && r.width > 50;
            });
            return imgs.map((img, i) => {
                const r = img.getBoundingClientRect();
                return {
                    index: i,
                    src: img.src.split('/').pop().slice(0, 30),
                    rect: { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top }
                };
            });
        }""")
        print("Settled images:", json.dumps(settled_imgs, indent=2))

        # Let's inspect the JavaScript framework or library used on Snohetta
        lib_info = page.evaluate("""() => {
            return {
                hasSwiper: typeof window.Swiper !== 'undefined',
                hasGsap: typeof window.gsap !== 'undefined',
                hasFlickity: typeof window.Flickity !== 'undefined',
                scripts: Array.from(document.querySelectorAll('script')).map(s => s.src).filter(Boolean)
            };
        }""")
        print("Library info:", json.dumps(lib_info, indent=2))

        browser.close()

if __name__ == "__main__":
    main()

