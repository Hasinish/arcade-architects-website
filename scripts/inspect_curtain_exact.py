from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("https://www.bloom3d.studio/", wait_until="domcontentloaded")
    page.wait_for_timeout(2000)

    curtain_info = page.evaluate("""() => {
        const hero = document.querySelector('.section_hero');
        const pf = document.querySelector('.section_portfolio');
        const heroVideo = document.querySelector('.hero_video, .hero_video_inner, video');
        
        return {
            hero: {
                height: hero ? window.getComputedStyle(hero).height : null,
                position: hero ? window.getComputedStyle(hero).position : null,
                zIndex: hero ? window.getComputedStyle(hero).zIndex : null
            },
            portfolio: {
                top: pf ? pf.offsetTop : null,
                position: pf ? window.getComputedStyle(pf).position : null,
                zIndex: pf ? window.getComputedStyle(pf).zIndex : null,
                marginTop: pf ? window.getComputedStyle(pf).marginTop : null
            },
            videoParent: heroVideo && heroVideo.parentElement ? {
                className: heroVideo.parentElement.className,
                position: window.getComputedStyle(heroVideo.parentElement).position,
                top: window.getComputedStyle(heroVideo.parentElement).top,
                height: window.getComputedStyle(heroVideo.parentElement).height
            } : null
        };
    }""")

    print(json.dumps(curtain_info, indent=2))
    browser.close()

