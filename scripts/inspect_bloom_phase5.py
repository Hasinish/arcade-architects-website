import json
from playwright.sync_api import sync_playwright

def inspect_phase5():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        print("Navigating to Bloom3D...")
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        # -----------------------------------------------------------
        # A. Inspect About Section
        # -----------------------------------------------------------
        about_data = page.evaluate("""() => {
            const about = document.querySelector('.section_about, [class*=\"about\"]');
            if (!about) return null;

            const textEl = about.querySelector('.about_text, p, h2');
            const words = Array.from(about.querySelectorAll('.about_text span, [class*=\"word\"], span')).filter(s => s.textContent.trim().length > 0 && s.closest('.about_text'));
            const stats = Array.from(about.querySelectorAll('.about_num, [class*=\"num\"], [class*=\"stat\"]')).map(st => {
                const num = st.querySelector('[class*=\"number\"], h2, h3, span');
                const label = st.querySelector('[class*=\"label\"], p, span:last-child');
                return {
                    class: st.className,
                    text: st.textContent.trim(),
                    numText: num ? num.textContent.trim() : null,
                    labelText: label ? label.textContent.trim() : null,
                    rect: st.getBoundingClientRect()
                };
            });

            // Get computed style of main text
            const csText = textEl ? window.getComputedStyle(textEl) : null;

            return {
                section: {
                    class: about.className,
                    bgColor: window.getComputedStyle(about).backgroundColor,
                    padding: window.getComputedStyle(about).padding,
                    height: about.getBoundingClientRect().height,
                    top: about.getBoundingClientRect().top + window.scrollY
                },
                text: {
                    fullText: textEl ? textEl.textContent.trim() : null,
                    fontSize: csText?.fontSize,
                    fontWeight: csText?.fontWeight,
                    lineHeight: csText?.lineHeight,
                    letterSpacing: csText?.letterSpacing,
                    color: csText?.color,
                    maxWidth: csText?.maxWidth,
                    textAlign: csText?.textAlign
                },
                wordCount: words.length,
                firstWord: words[0] ? {
                    tag: words[0].tagName,
                    class: words[0].className,
                    style: words[0].getAttribute('style'),
                    opacity: window.getComputedStyle(words[0]).opacity,
                    color: window.getComputedStyle(words[0]).color
                } : null,
                stats
            };
        }""")
        print("About Data:", json.dumps(about_data, indent=2))

        # -----------------------------------------------------------
        # B. Inspect Advantages Section
        # -----------------------------------------------------------
        adv_data = page.evaluate("""() => {
            const adv = document.querySelector('.section_advantages, [class*=\"advantages\"]');
            const wrapper = document.querySelector('.advantages_wrapper, [class*=\"advantages_wrapper\"]');
            if (!adv) return null;

            const items = Array.from(adv.querySelectorAll('.advantages_item, [class*=\"advantages\"] [class*=\"item\"]')).map((item, idx) => {
                const s = window.getComputedStyle(item);
                const r = item.getBoundingClientRect();
                const title = item.querySelector('h2, h3, [class*=\"title\"]');
                const desc = item.querySelector('p, [class*=\"text\"], [class*=\"desc\"]');
                const num = item.querySelector('[class*=\"num\"], span');
                return {
                    index: idx,
                    class: item.className,
                    num: num ? num.textContent.trim() : null,
                    title: title ? title.textContent.trim() : null,
                    desc: desc ? desc.textContent.trim() : null,
                    height: r.height,
                    width: r.width,
                    opacity: s.opacity
                };
            });

            const images = Array.from(adv.querySelectorAll('img, .advantages_img, [class*=\"advantages\"] [class*=\"img\"]')).map(img => {
                const r = img.getBoundingClientRect();
                const s = window.getComputedStyle(img);
                return {
                    tag: img.tagName,
                    class: img.className,
                    src: img.src || null,
                    width: r.width,
                    height: r.height,
                    opacity: s.opacity,
                    transform: s.transform
                };
            });

            return {
                section: {
                    class: adv.className,
                    bgColor: window.getComputedStyle(adv).backgroundColor,
                    height: adv.getBoundingClientRect().height,
                    top: adv.getBoundingClientRect().top + window.scrollY
                },
                wrapper: wrapper ? {
                    class: wrapper.className,
                    position: window.getComputedStyle(wrapper).position,
                    top: window.getComputedStyle(wrapper).top,
                    height: wrapper.getBoundingClientRect().height
                } : null,
                items,
                images
            };
        }""")
        print("Advantages Data:", json.dumps(adv_data, indent=2))

        # Check ScrollTrigger settings for both
        triggers = page.evaluate("""() => {
            if (!window.ScrollTrigger) return [];
            return window.ScrollTrigger.getAll().filter(st => {
                const c = (st.trigger?.className || '') + ' ' + (st.pin?.className || '');
                return c.includes('about') || c.includes('advantages');
            }).map(st => ({
                trigger: st.trigger?.className,
                pin: st.pin?.className,
                start: st.start,
                end: st.end,
                vars: {
                    start: st.vars.start,
                    end: st.vars.end,
                    scrub: st.vars.scrub,
                    pin: st.vars.pin
                }
            }));
        }""")
        print("Triggers:", json.dumps(triggers, indent=2))

        with open("audit/phase5_bloom_inspection.json", "w") as f:
            json.dump({"about": about_data, "advantages": adv_data, "triggers": triggers}, f, indent=2)

        browser.close()

if __name__ == "__main__":
    inspect_phase5()

