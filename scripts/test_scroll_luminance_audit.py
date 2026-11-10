import asyncio
from playwright.async_api import async_playwright

async def audit_scroll():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        await page.goto('http://localhost:5173/', wait_until='networkidle')
        await page.wait_for_timeout(1000)

        # Let's inspect points from 0 to 11000 in 250px steps
        print(f"{'ScrollY':>7} | {'Logo Lum':>8} | {'Logo State':>10} | {'Burger Lum':>10} | {'Burger State':>12} | {'Under Logo Tag/Class':<35}")
        print("-" * 95)

        for y in range(0, 11200, 300):
            await page.evaluate(f"window.scrollTo(0, {y})")
            await page.wait_for_timeout(100)
            
            data = await page.evaluate('''() => {
                const sampleDarkness = (x, y) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1;
                    canvas.height = 1;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    const elements = document.elementsFromPoint(x, y);

                    for (const el of elements) {
                        if (el.closest('header') || el.closest('aside') || el.closest('[role="dialog"]')) continue;

                        const img = el.tagName === 'IMG' ? el : el.querySelector('img');
                        if (img && img.complete && img.naturalWidth > 0) {
                            try {
                                const rect = img.getBoundingClientRect();
                                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                                    const rx = (x - rect.left) / rect.width;
                                    const ry = (y - rect.top) / rect.height;
                                    const sx = Math.floor(rx * img.naturalWidth);
                                    const sy = Math.floor(ry * img.naturalHeight);
                                    ctx.drawImage(img, sx, sy, 1, 1, 0, 0, 1, 1);
                                    const p = ctx.getImageData(0, 0, 1, 1).data;
                                    if (p[3] > 20) {
                                        const lum = (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255;
                                        return { lum, isDark: lum < 0.5, type: 'IMG: ' + img.src.split('/').pop() };
                                    }
                                }
                            } catch (e) {}
                        }

                        if (el.tagName === 'VIDEO' || el.querySelector('video')) {
                            return { lum: 0.0, isDark: true, type: 'VIDEO' };
                        }

                        const bg = window.getComputedStyle(el).backgroundColor;
                        const match = bg.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
                        if (match) {
                            const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
                            if (a > 0.08) {
                                const r = parseInt(match[1], 10);
                                const g = parseInt(match[2], 10);
                                const b = parseInt(match[3], 10);
                                const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
                                return { lum, isDark: lum < 0.5, type: 'BG: ' + el.tagName + '.' + (el.className.slice(0, 15) || 'none') };
                            }
                        }
                    }
                    return { lum: window.scrollY < 450 ? 0.0 : 0.96, isDark: window.scrollY < 450, type: 'DEFAULT' };
                };

                const logoSample = sampleDarkness(64, 48);
                const burgerSample = sampleDarkness(window.innerWidth - 48, 48);

                const logoLink = document.querySelector('header a');
                const burgerSpans = document.querySelectorAll('header button span');

                return {
                    scrollY: window.scrollY,
                    logoLum: logoSample.lum,
                    logoDark: logoSample.isDark,
                    logoType: logoSample.type,
                    burgerLum: burgerSample.lum,
                    burgerDark: burgerSample.isDark,
                    burgerType: burgerSample.type,
                    logoComputedColor: logoLink ? window.getComputedStyle(logoLink).color : '',
                    burgerComputedBg: burgerSpans.length > 0 ? window.getComputedStyle(burgerSpans[0]).backgroundColor : ''
                };
            }''')

            l_state = "WHITE" if "255, 255, 255" in data['logoComputedColor'] else "DARK"
            b_state = "WHITE" if "255, 255, 255" in data['burgerComputedBg'] else "DARK"
            print(f"{data['scrollY']:>7} | {data['logoLum']:>8.3f} | {l_state:>10} | {data['burgerLum']:>10.3f} | {b_state:>12} | {data['logoType']:<35}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(audit_scroll())

