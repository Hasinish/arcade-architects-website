from playwright.sync_api import sync_playwright
import json

def inspect_details_phase5():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        data = page.evaluate("""() => {
            const aboutText = document.querySelector('.about_text, [class*=\"about\"] p, [class*=\"about\"] h2');
            const adv = document.querySelector('.section_advantages');
            
            // Check advantage items specifically
            const advItems = adv ? Array.from(adv.querySelectorAll('.advantage_item, [class*=\"advantage\"]')).filter(el => {
                const title = el.querySelector('h2, h3, h4, [class*=\"title\"]');
                return !!title && el.textContent.length > 20;
            }).map(el => {
                return {
                    class: el.className,
                    html: el.innerHTML,
                    text: el.innerText
                };
            }) : [];

            // Let's also grab all text blocks in advantages
            const allAdvTexts = adv ? Array.from(adv.querySelectorAll('*')).filter(el => el.children.length === 0 && el.textContent.trim().length > 0).map(el => ({
                tag: el.tagName,
                class: el.className,
                text: el.textContent.trim(),
                style: {
                    fontSize: window.getComputedStyle(el).fontSize,
                    fontWeight: window.getComputedStyle(el).fontWeight,
                    lineHeight: window.getComputedStyle(el).lineHeight,
                    color: window.getComputedStyle(el).color,
                    opacity: window.getComputedStyle(el).opacity
                }
            })) : [];

            return {
                aboutHtml: aboutText ? aboutText.outerHTML : null,
                advItems,
                allAdvTexts
            };
        }""")

        with open("audit/phase5_details.json", "w") as f:
            json.dump(data, f, indent=2)

        # Check scroll illumination in about section
        about_top = page.evaluate("() => document.querySelector('.section_about').getBoundingClientRect().top + window.scrollY")
        scroll_frames = []
        for y_off in [-200, 0, 150, 300, 450]:
            target_y = about_top + y_off
            page.evaluate(f"window.scrollTo(0, {target_y})")
            page.wait_for_timeout(200)
            words_info = page.evaluate("""() => {
                const words = Array.from(document.querySelectorAll('.about_text span, [class*=\"word\"]')).map(w => ({
                    text: w.textContent.trim(),
                    opacity: window.getComputedStyle(w).opacity,
                    color: window.getComputedStyle(w).color
                }));
                return {
                    scrollY: window.scrollY,
                    words: words.slice(0, 10)
                };
            }""")
            scroll_frames.append(words_info)

        print(json.dumps(scroll_frames, indent=2))
        with open("audit/phase5_word_scroll.json", "w") as f:
            json.dump(scroll_frames, f, indent=2)

        browser.close()

if __name__ == "__main__":
    inspect_details_phase5()

