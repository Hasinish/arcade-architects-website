import os
import json
import time
from playwright.sync_api import sync_playwright

def main():
    os.makedirs("audit/frames/navbar", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:5173/", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        # Get positions of key sections
        positions = page.evaluate("""() => {
            const getTop = (sel) => {
                const el = document.querySelector(sel);
                return el ? el.getBoundingClientRect().top + window.scrollY : 0;
            };
            return {
                hero: 0,
                portfolio: getTop('#portfolio') + 200,
                services: getTop('#services') + 200,
                about: getTop('#about') + 200,
                advantages: getTop('#advantages') + 200,
                cta: getTop('#cta') + 200,
                faq: getTop('#faq') + 200,
                footer: document.body.scrollHeight - 500
            };
        }""")
        print("Test scroll targets:", json.dumps(positions, indent=2))

        results = []

        for name, y in positions.items():
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(400) # wait for smooth transition
            
            nav_state = page.evaluate("""() => {
                const logoText = document.querySelector('header a span');
                const burgerBar = document.querySelector('header button span');
                const header = document.querySelector('header');
                
                return {
                    logoColor: logoText ? window.getComputedStyle(logoText).color : null,
                    burgerBg: burgerBar ? window.getComputedStyle(burgerBar).backgroundColor : null,
                };
            }""")
            
            # Save screenshot of the top 120px header region
            page.screenshot(
                path=f"audit/frames/navbar/nav_{name}.png",
                clip={"x": 0, "y": 0, "width": 1440, "height": 140}
            )
            
            is_white = "255, 255, 255" in (nav_state["logoColor"] or "")
            results.append({
                "section": name,
                "scrollY": y,
                "logoColor": nav_state["logoColor"],
                "burgerBg": nav_state["burgerBg"],
                "mode": "WHITE / LIGHT" if is_white else "DARK / CHARCOAL"
            })
            print(f"[{name.upper()}] y={y} -> Mode: {'WHITE / LIGHT' if is_white else 'DARK / CHARCOAL'} (Logo: {nav_state['logoColor']})")

        with open("audit/navbar_adaptive_audit.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)

        browser.close()

if __name__ == "__main__":
    main()

