import json
from playwright.sync_api import sync_playwright

def inspect_local_positions():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1648, "height": 900})
        page.goto("http://localhost:5173/", wait_until="load", timeout=15000)
        page.wait_for_timeout(1000)

        data = page.evaluate("""() => {
            const logo = document.querySelector('header a');
            const burger = document.querySelector('header button');
            const heading = document.querySelector('h1');
            const buttons = document.querySelectorAll('section a[href*=\"portfolio\"], section button');

            return {
                viewport: { width: window.innerWidth, height: window.innerHeight },
                logo: logo ? {
                    rect: logo.getBoundingClientRect(),
                    left: logo.getBoundingClientRect().left
                } : null,
                burger: burger ? {
                    rect: burger.getBoundingClientRect(),
                    rightFromEdge: window.innerWidth - burger.getBoundingClientRect().right,
                    left: burger.getBoundingClientRect().left
                } : null,
                heading: heading ? {
                    rect: heading.getBoundingClientRect(),
                    left: heading.getBoundingClientRect().left,
                    bottom: window.innerHeight - heading.getBoundingClientRect().bottom,
                    width: heading.getBoundingClientRect().width,
                    text: heading.innerText
                } : null,
                buttons: Array.from(buttons).map(b => ({
                    text: b.textContent?.trim(),
                    rect: b.getBoundingClientRect(),
                    rightFromEdge: window.innerWidth - b.getBoundingClientRect().right,
                    bottomFromEdge: window.innerHeight - b.getBoundingClientRect().bottom
                }))
            };
        }""")

        print(json.dumps(data, indent=2))
        browser.close()

if __name__ == "__main__":
    inspect_local_positions()

