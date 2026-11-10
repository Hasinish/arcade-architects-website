from playwright.sync_api import sync_playwright
import json

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:5173/", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        # Let's write an in-browser real-time pixel/element color calculator
        # that samples at any scroll position
        test_script = """() => {
            // Function to get pixel color under (x, y)
            function getPixelLuminanceAt(x, y) {
                const elements = document.elementsFromPoint(x, y);
                for (const el of elements) {
                    if (el.closest('header') || el.closest('aside')) continue;

                    // If it's an image element
                    if (el.tagName === 'IMG') {
                        try {
                            const rect = el.getBoundingClientRect();
                            const relX = (x - rect.left) / rect.width;
                            const relY = (y - rect.top) / rect.height;
                            
                            // Create hidden canvas to sample image pixel
                            const canvas = document.createElement('canvas');
                            canvas.width = 10;
                            canvas.height = 10;
                            const ctx = canvas.getContext('2d', { willReadFrequently: true });
                            if (ctx && el.naturalWidth) {
                                const sx = Math.floor(relX * el.naturalWidth);
                                const sy = Math.floor(relY * el.naturalHeight);
                                ctx.drawImage(el, sx, sy, 1, 1, 0, 0, 1, 1);
                                const p = ctx.getImageData(0, 0, 1, 1).data;
                                const lum = (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255;
                                return { type: 'img', src: el.src.slice(-30), rgb: [p[0], p[1], p[2]], lum, isDark: lum < 0.5 };
                            }
                        } catch (e) {
                            // CORS or tainted canvas
                        }
                    }

                    // If it's a video element
                    if (el.tagName === 'VIDEO') {
                        return { type: 'video', isDark: true, lum: 0.1 };
                    }

                    // Computed background color
                    const bg = window.getComputedStyle(el).backgroundColor;
                    const match = bg.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
                    if (match) {
                        const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
                        if (a > 0.05) {
                            const r = parseInt(match[1], 10);
                            const g = parseInt(match[2], 10);
                            const b = parseInt(match[3], 10);
                            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
                            return { type: 'bg', tag: el.tagName, id: el.id, rgb: [r, g, b], lum, isDark: lum < 0.5 };
                        }
                    }
                }
                return { type: 'fallback', isDark: false, lum: 1 };
            }

            return {
                at_y0_logo: getPixelLuminanceAt(64, 48),
                at_y0_burger: getPixelLuminanceAt(1400, 48)
            };
        }"""

        res_y0 = page.evaluate(test_script)
        print("At y=0 (Hero):", json.dumps(res_y0, indent=2))

        # Scroll to portfolio (y=1400)
        page.evaluate("window.scrollTo(0, 1400)")
        page.wait_for_timeout(400)
        res_y1400 = page.evaluate(test_script)
        print("At y=1400 (Portfolio):", json.dumps(res_y1400, indent=2))

        # Scroll to services (y=4200)
        page.evaluate("window.scrollTo(0, 4200)")
        page.wait_for_timeout(400)
        res_y4200 = page.evaluate(test_script)
        print("At y=4200 (Services):", json.dumps(res_y4200, indent=2))

        browser.close()

if __name__ == "__main__":
    main()

