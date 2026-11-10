import asyncio
import os
import json
from playwright.async_api import async_playwright

async def verify_smooth_scroll_inertia():
    os.makedirs('audit', exist_ok=True)
    os.makedirs('audit/comparisons', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        
        print("Navigating to http://localhost:5173/ ...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # Check if Lenis is initialized
        lenis_info = await page.evaluate('''() => {
            const hasLenis = !!window.lenis;
            const hasClass = document.documentElement.classList.contains('lenis');
            return { hasLenis, hasClass };
        }''')
        print(f"Lenis status: window.lenis={lenis_info['hasLenis']}, html.lenis={lenis_info['hasClass']}")

        # Track scroll position frames during and after wheel scroll
        print("\nTesting wheel scroll inertia...")
        
        await page.evaluate('''() => {
            window.__scrollFrames = [];
            window.__isTracking = true;
            let lastY = window.scrollY;
            let lastT = performance.now();

            function record() {
                if (window.__isTracking) {
                    const now = performance.now();
                    const y = window.scrollY;
                    const dt = now - lastT;
                    const dy = y - lastY;
                    const vel = dt > 0 ? (dy / dt) * 1000 : 0; // px/sec
                    window.__scrollFrames.push({
                        time: now,
                        y: y,
                        dy: dy,
                        velocity: vel
                    });
                    lastY = y;
                    lastT = now;
                    requestAnimationFrame(record);
                }
            }
            requestAnimationFrame(record);
        }''')

        # Emit wheel ticks
        for i in range(5):
            await page.mouse.wheel(0, 150)
            await page.wait_for_timeout(30)

        print("Wheel input stopped! Recording inertia glide for 1200ms...")
        await page.wait_for_timeout(1200)

        frames = await page.evaluate('''() => {
            window.__isTracking = false;
            return window.__scrollFrames;
        }''')

        total_frames = len(frames)
        start_y = frames[0]['y'] if frames else 0
        end_y = frames[-1]['y'] if frames else 0
        total_distance = end_y - start_y

        print(f"\nRecorded {total_frames} frames over 1.35 seconds.")
        print(f"Scroll Y: {start_y:.1f}px -> {end_y:.1f}px (Total distance: {total_distance:.1f}px)")

        sample_indices = [0, 5, 10, 15, 20, 30, 40, 50, 60, min(70, total_frames - 1)]
        print("\n--- Inertia Deceleration Curve ---")
        print(f"{'Frame':>5} | {'Scroll Y':>9} | {'Delta Y':>8} | {'Velocity (px/s)':>16}")
        print("-" * 45)
        for idx in sample_indices:
            if idx < total_frames:
                f = frames[idx]
                print(f"{idx:>5} | {f['y']:>9.1f} | {f['dy']:>8.2f} | {f['velocity']:>16.1f}")

        with open('audit/scroll_inertia_audit.json', 'w') as out:
            json.dump(frames, out, indent=2)

        # Test drawer toggle and Lenis pause/resume
        print("\nTesting drawer toggle with Lenis...")
        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(300)
        await page.click('header button')
        await page.wait_for_timeout(400)
        is_stopped = await page.evaluate('() => window.lenis ? window.lenis.isStopped : false')
        print(f"When Drawer is opened: lenis.isStopped = {is_stopped}")

        await page.keyboard.press('Escape')
        await page.wait_for_timeout(400)
        is_resumed = await page.evaluate('() => window.lenis ? !window.lenis.isStopped : false')
        print(f"When Drawer is closed: lenis.isResumed = {is_resumed}")

        await browser.close()
        print("\nVerification completed successfully!")

if __name__ == '__main__':
    asyncio.run(verify_smooth_scroll_inertia())
