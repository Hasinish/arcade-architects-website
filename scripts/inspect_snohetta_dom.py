from playwright.sync_api import sync_playwright
import json

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.snohetta.com/", wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(1000)

        # Inspect DOM structure of the slider element
        structure = page.evaluate("""() => {
            const img = document.querySelector('img');
            // get chain of parents up to body
            const parents = [];
            let curr = img;
            while (curr && curr !== document.body) {
                parents.push({
                    tag: curr.tagName,
                    class: curr.className,
                    id: curr.id,
                    dataAttributes: Array.from(curr.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}=${a.value}`),
                    style: curr.getAttribute('style')
                });
                curr = curr.parentElement;
            }
            return parents;
        }""")
        print("DOM Parent Chain:")
        print(json.dumps(structure, indent=2))

        browser.close()

if __name__ == "__main__":
    main()

