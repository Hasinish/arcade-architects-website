from playwright.sync_api import sync_playwright
import json

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:5173/", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        # Inject real-time pixel sampler and test across 10 scroll positions
        test_sampler = """() => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            function samplePixelDarkness(x, y) {
                const elements = document.elementsFromPoint(x, y);
                for (const el of elements) {
                    if (el.closest('header') || el.closest('aside')) continue;

                    // 1. If it's an image
                    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
                    if (img && img.complete && img.naturalWidth > 0) {
                        try {
                            const rect = img.getBoundingClientRect();
                            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                                const rx = (x - rect.left) / rect.width;
                                const ry = (y - rect.top) / rect.height;
                                const sx = Math.floor(rx * img.naturalWidth);
                                const sy = Math.floor(ry * img.naturalHeight);
                                ctx.clearRect(0, 0, 1, 1);
                                ctx.drawImage(img, sx, sy, 1, 1, 0, 0, 1, 1);
                                const data = ctx.getImageData(0, 0, 1, 1).data;
                                if (data[3] > 20) {
                                    const lum = (0.2126 * data[0] + 0.7152 * data[1] + 0.0722 * data[2]) / 255;
                                    return { target: 'image', rgb: [data[0], data[1], data[2]], lum, isUnderneathDark: lum < 0.5 };
                                }
                            }
                        } catch (e) {
                            // CORS fallback
                        }
                    }

                    // 2. If it's a video
                    if (el.tagName === 'VIDEO' || el.querySelector('video')) {
                        return { target: 'video', lum: 0.1, isUnderneathDark: true };
                    }

                    // 3. Computed background color
                    const bg = window.getComputedStyle(el).backgroundColor;
                    const match = bg.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
                    if (match) {
                        const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
                        if (a > 0.08) {
                            const r = parseInt(match[1], 10);
                            const g = parseInt(match[2], 10);
                            const b = parseInt(match[3], 10);
                            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
                            return { target: 'bg', tag: el.tagName, rgb: [r, g, b], lum, isUnderneathDark: lum < 0.5 };
                        }
                    }
                }

                // Document root fallback
                return { target: 'root_fallback', lum: 0.97, isUnderneathDark: false };
            }

            return {
                sampleLeft: samplePixelDarkness(64, 48),
                sampleRight: samplePixelDarkness(window.innerWidth - 48, 48)
            };
        }"""

        scroll_points = [0, 500, 1000, 1500, 2500, 4200, 5200, 6500, 8800, 10000]
        results = []
        for y in scroll_points:
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(200)
            data = page.evaluate(test_sampler)
            results.append({"scrollY": y, "data": data})
            print(f"y={y}: Left={data['sampleLeft']['target']}(dark={data['sampleLeft']['isUnderneathDark']}), Right={data['sampleRight']['target']}(dark={data['sampleRight']['isUnderneathDark']})")

        with open("audit/pixel_sampler_test.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)

        browser.close()

if __name__ == "__main__":
    main()

