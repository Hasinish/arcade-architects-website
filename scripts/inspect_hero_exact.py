from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("https://www.bloom3d.studio/", wait_until="domcontentloaded")
    page.wait_for_timeout(2500)

    hero_info = page.evaluate("""() => {
        const hero = document.querySelector('.section_hero');
        const heroWrapper = document.querySelector('.hero_wrapper');
        const heroContent = document.querySelector('.hero_content');
        const h1 = document.querySelector('.section_hero h1, .hero_wrapper h1');
        const subheading = document.querySelector('.hero_subheading, [class*="subheading"]');
        const btnsWrapper = document.querySelector('.hero_btns');
        const btns = Array.from(document.querySelectorAll('.hero_btns a, .hero_btns button, .hero_btns div[class*="btn"]')).map(b => {
            const cs = window.getComputedStyle(b);
            return {
                text: b.innerText.trim(),
                className: b.className,
                bg: cs.backgroundColor,
                color: cs.color,
                borderRadius: cs.borderRadius,
                padding: cs.padding,
                height: cs.height,
                width: cs.width,
                border: cs.border,
                backdropFilter: cs.backdropFilter,
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight
            };
        });

        const video = document.querySelector('.hero_video, video');
        const videoStyle = video ? window.getComputedStyle(video) : null;

        return {
            heroHtml: hero ? hero.outerHTML.slice(0, 1500) : null,
            heroStyle: hero ? {
                height: window.getComputedStyle(hero).height,
                position: window.getComputedStyle(hero).position
            } : null,
            h1Rect: h1 ? h1.getBoundingClientRect() : null,
            h1Style: h1 ? {
                fontSize: window.getComputedStyle(h1).fontSize,
                fontWeight: window.getComputedStyle(h1).fontWeight,
                lineHeight: window.getComputedStyle(h1).lineHeight,
                letterSpacing: window.getComputedStyle(h1).letterSpacing,
                color: window.getComputedStyle(h1).color,
                margin: window.getComputedStyle(h1).margin
            } : null,
            subheadingStyle: subheading ? {
                text: subheading.innerText.trim(),
                fontSize: window.getComputedStyle(subheading).fontSize,
                fontWeight: window.getComputedStyle(subheading).fontWeight,
                color: window.getComputedStyle(subheading).color,
                margin: window.getComputedStyle(subheading).margin
            } : null,
            btnsRect: btnsWrapper ? btnsWrapper.getBoundingClientRect() : null,
            btns: btns,
            videoStyle: videoStyle ? {
                position: videoStyle.position,
                width: videoStyle.width,
                height: videoStyle.height,
                objectFit: videoStyle.objectFit
            } : null
        };
    }""")

    with open("audit/hero_exact.json", "w", encoding="utf-8") as f:
        json.dump(hero_info, f, indent=2)

    print("Hero exact metrics saved!")
    browser.close()

