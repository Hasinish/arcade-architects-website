from playwright.sync_api import sync_playwright
import json

def inspect_bloom_video():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        for y in [0, 300, 600, 900]:
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(200)
            data = page.evaluate("""() => {
                const videoDiv = document.querySelector('.hero_video');
                const video = document.querySelector('video');
                const overlay = document.querySelector('.hero_video_overlay');
                const hero = document.querySelector('.section_hero');
                const csVideoDiv = window.getComputedStyle(videoDiv);
                const csVideo = window.getComputedStyle(video);
                const csOverlay = window.getComputedStyle(overlay);
                const csHero = window.getComputedStyle(hero);
                return {
                    scrollY: window.scrollY,
                    videoDiv: {
                        position: csVideoDiv.position,
                        top: csVideoDiv.top,
                        transform: csVideoDiv.transform,
                        rect: videoDiv.getBoundingClientRect()
                    },
                    video: {
                        position: csVideo.position,
                        transform: csVideo.transform,
                        rect: video.getBoundingClientRect()
                    },
                    overlay: {
                        transform: csOverlay.transform,
                        rect: overlay.getBoundingClientRect()
                    },
                    hero: {
                        transform: csHero.transform,
                        rect: hero.getBoundingClientRect()
                    }
                };
            }""")
            print(f"y={y}:")
            print(json.dumps(data, indent=2))
        browser.close()

if __name__ == "__main__":
    inspect_bloom_video()

