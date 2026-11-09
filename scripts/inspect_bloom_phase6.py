import json
from playwright.sync_api import sync_playwright

def inspect_phase6():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        print("Navigating to Bloom3D...")
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # 1. Inspect CTA Section
        # -------------------------------------------------------------
        cta_data = page.evaluate("""() => {
            const cta = document.querySelector('.section_cta, [class*=\"section_cta\"], [class*=\"cta\"]');
            if (!cta) return null;

            const heading = cta.querySelector('h1, h2, h3, [class*=\"heading\"], [class*=\"title\"]');
            const video = cta.querySelector('video');
            const img = cta.querySelector('img');
            const buttons = Array.from(cta.querySelectorAll('a, button')).map(b => ({
                text: b.textContent.trim(),
                class: b.className,
                rect: b.getBoundingClientRect(),
                style: {
                    background: window.getComputedStyle(b).backgroundColor,
                    color: window.getComputedStyle(b).color,
                    height: window.getComputedStyle(b).height,
                    padding: window.getComputedStyle(b).padding,
                    borderRadius: window.getComputedStyle(b).borderRadius
                }
            }));

            const csH = heading ? window.getComputedStyle(heading) : null;
            const rC = cta.getBoundingClientRect();
            const csC = window.getComputedStyle(cta);

            return {
                section: {
                    class: cta.className,
                    height: rC.height,
                    width: rC.width,
                    top: rC.top + window.scrollY,
                    position: csC.position,
                    overflow: csC.overflow
                },
                media: {
                    hasVideo: !!video,
                    videoSrc: video ? video.querySelector('source')?.src || video.src : null,
                    hasImg: !!img,
                    imgSrc: img ? img.src : null
                },
                heading: {
                    text: heading ? heading.textContent.trim() : null,
                    fontSize: csH?.fontSize,
                    fontWeight: csH?.fontWeight,
                    lineHeight: csH?.lineHeight,
                    letterSpacing: csH?.letterSpacing,
                    textAlign: csH?.textAlign,
                    color: csH?.color
                },
                buttons
            };
        }""")
        print("CTA Data:", json.dumps(cta_data, indent=2))

        # -------------------------------------------------------------
        # 2. Inspect FAQ Section
        # -------------------------------------------------------------
        faq_data = page.evaluate("""() => {
            const faq = document.querySelector('.section_faq, [class*=\"section_faq\"], [class*=\"faq\"]');
            if (!faq) return null;

            const rF = faq.getBoundingClientRect();
            const csF = window.getComputedStyle(faq);
            const heading = faq.querySelector('h2, [class*=\"heading\"]');
            const csH = heading ? window.getComputedStyle(heading) : null;

            const items = Array.from(faq.querySelectorAll('.faq_item, [class*=\"faq\"] [class*=\"item\"], [class*=\"accordion\"]')).map(item => {
                const q = item.querySelector('[class*=\"question\"], [class*=\"title\"], h3, h4');
                const a = item.querySelector('[class*=\"answer\"], [class*=\"text\"], p');
                const icon = item.querySelector('svg, [class*=\"icon\"], span');
                const csQ = q ? window.getComputedStyle(q) : null;
                const csA = a ? window.getComputedStyle(a) : null;

                return {
                    question: q ? q.textContent.trim() : null,
                    answer: a ? a.textContent.trim() : null,
                    qStyle: {
                        fontSize: csQ?.fontSize,
                        fontWeight: csQ?.fontWeight,
                        color: csQ?.color
                    },
                    iconClass: icon?.className
                };
            });

            return {
                section: {
                    class: faq.className,
                    bgColor: csF.backgroundColor,
                    padding: csF.padding,
                    height: rF.height,
                    top: rF.top + window.scrollY
                },
                heading: {
                    text: heading ? heading.textContent.trim() : null,
                    fontSize: csH?.fontSize,
                    fontWeight: csH?.fontWeight,
                    lineHeight: csH?.lineHeight,
                    letterSpacing: csH?.letterSpacing,
                    color: csH?.color
                },
                itemCount: items.length,
                items
            };
        }""")
        print("FAQ Data:", json.dumps(faq_data, indent=2))

        # -------------------------------------------------------------
        # 3. Inspect Footer Section
        # -------------------------------------------------------------
        footer_data = page.evaluate("""() => {
            const footer = document.querySelector('footer, .section_footer, [class*=\"footer\"]');
            if (!footer) return null;

            const rF = footer.getBoundingClientRect();
            const csF = window.getComputedStyle(footer);
            const links = Array.from(footer.querySelectorAll('a')).map(a => ({
                text: a.textContent.trim(),
                href: a.getAttribute('href'),
                color: window.getComputedStyle(a).color,
                fontSize: window.getComputedStyle(a).fontSize
            }));

            const allTexts = Array.from(footer.querySelectorAll('p, span, div, h2, h3, h4')).filter(el => el.children.length === 0 && el.textContent.trim().length > 0).map(el => ({
                tag: el.tagName,
                class: el.className,
                text: el.textContent.trim(),
                color: window.getComputedStyle(el).color,
                fontSize: window.getComputedStyle(el).fontSize
            }));

            return {
                footer: {
                    class: footer.className,
                    bgColor: csF.backgroundColor,
                    padding: csF.padding,
                    height: rF.height,
                    top: rF.top + window.scrollY
                },
                links,
                texts: allTexts
            };
        }""")
        print("Footer Data:", json.dumps(footer_data, indent=2))

        with open("audit/phase6_bloom_inspection.json", "w") as f:
            json.dump({"cta": cta_data, "faq": faq_data, "footer": footer_data}, f, indent=2)

        browser.close()

if __name__ == "__main__":
    inspect_phase6()

