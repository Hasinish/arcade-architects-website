import json
from playwright.sync_api import sync_playwright

def inspect_bloom_css():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        data = page.evaluate("""() => {
            const hero = document.querySelector('.section_hero');
            const portfolio = document.querySelector('.section_portfolio');
            
            const heroRect = hero ? hero.getBoundingClientRect() : null;
            const heroStyle = hero ? window.getComputedStyle(hero) : null;

            const portRect = portfolio ? portfolio.getBoundingClientRect() : null;
            const portStyle = portfolio ? window.getComputedStyle(portfolio) : null;

            // Check margin, top, transform on portfolio
            return {
                hero: {
                    height: heroStyle?.height,
                    position: heroStyle?.position,
                    top: heroStyle?.top,
                    marginTop: heroStyle?.marginTop,
                    marginBottom: heroStyle?.marginBottom,
                },
                portfolio: {
                    height: portStyle?.height,
                    position: portStyle?.position,
                    top: portStyle?.top,
                    marginTop: portStyle?.marginTop,
                    transform: portStyle?.transform,
                    zIndex: portStyle?.zIndex
                },
                scrollTriggerCount: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0,
                scrollTriggers: window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => ({
                    trigger: st.trigger?.className,
                    pin: st.pin?.className,
                    start: st.start,
                    end: st.end,
                    vars: {
                        pin: st.vars.pin,
                        scrub: st.vars.scrub,
                        start: st.vars.start,
                        end: st.vars.end
                    }
                })) : []
            };
        }""")

        print(json.dumps(data, indent=2))
        browser.close()

if __name__ == "__main__":
    inspect_bloom_css()

