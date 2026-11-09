import json
from playwright.sync_api import sync_playwright

def inspect_hero_children():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        data = page.evaluate("""() => {
            const hero = document.querySelector('.section_hero');
            if (!hero) return null;
            
            const children = Array.from(hero.children).map(child => {
                const s = window.getComputedStyle(child);
                const r = child.getBoundingClientRect();
                return {
                    tag: child.tagName,
                    class: child.className,
                    position: s.position,
                    top: s.top,
                    bottom: s.bottom,
                    height: r.height,
                    width: r.width,
                    zIndex: s.zIndex,
                    topRect: r.top
                };
            });
            return {
                heroTag: hero.tagName,
                heroClass: hero.className,
                heroStyle: {
                    position: window.getComputedStyle(hero).position,
                    height: window.getComputedStyle(hero).height,
                    marginBottom: window.getComputedStyle(hero).marginBottom,
                },
                children
            };
        }""")
        print(json.dumps(data, indent=2))

        # Check scroll from 0 to 900 on Bloom3D
        scroll_steps = []
        for y in [0, 150, 300, 450, 600, 750, 900]:
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(200)
            step_data = page.evaluate("""() => {
                const video = document.querySelector('video');
                const hero = document.querySelector('.section_hero');
                const port = document.querySelector('.section_portfolio');
                return {
                    scrollY: window.scrollY,
                    videoTop: video ? video.getBoundingClientRect().top : null,
                    heroTop: hero ? hero.getBoundingClientRect().top : null,
                    portfolioTop: port ? port.getBoundingClientRect().top : null,
                };
            }""")
            scroll_steps.append(step_data)
        
        print("Bloom scroll steps:")
        print(json.dumps(scroll_steps, indent=2))
        browser.close()

if __name__ == "__main__":
    inspect_hero_children()

