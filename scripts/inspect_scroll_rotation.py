from playwright.sync_api import sync_playwright
import json

def inspect_scroll_rotation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        # Get the scroll triggers on carousel
        triggers = page.evaluate("""() => {
            if (!window.ScrollTrigger) return [];
            return window.ScrollTrigger.getAll().filter(st => {
                const tr = st.trigger?.className || '';
                const pin = st.pin?.className || '';
                return tr.includes('carousel') || pin.includes('carousel') || tr.includes('service');
            }).map(st => ({
                trigger: st.trigger?.className,
                start: st.start,
                end: st.end,
                pin: st.pin?.className,
                vars: {
                    scrub: st.vars.scrub,
                    start: st.vars.start,
                    end: st.vars.end,
                    pin: st.vars.pin
                }
            }));
        }""")
        print("Triggers:", json.dumps(triggers, indent=2))

        # Check rotation at different scroll positions
        data_steps = []
        c_top = page.evaluate("() => document.querySelector('.carousel_wrapper').getBoundingClientRect().top + window.scrollY")
        for delta in [-500, -250, 0, 250, 500, 750, 1000]:
            y = c_top + delta
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(200)
            rot = page.evaluate("""() => {
                const c = document.querySelector('.carousel');
                return {
                    scrollY: window.scrollY,
                    style: c?.getAttribute('style'),
                    transform: c ? window.getComputedStyle(c).transform : null
                };
            }""")
            data_steps.append(rot)
            print(f"delta={delta}:", rot)

        # Also check drag listeners
        listeners = page.evaluate("""() => {
            const wrapper = document.querySelector('.carousel_wrapper');
            // check draggable or Hammer or mouse listeners
            return {
                isDraggable: !!window.Draggable,
                wrapperClass: wrapper?.className
            };
        }""")
        print("Listeners:", listeners)

        browser.close()

if __name__ == "__main__":
    inspect_scroll_rotation()

