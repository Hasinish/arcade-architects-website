from playwright.sync_api import sync_playwright

def test_sticky_behavior():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        # Test HTML with:
        # Case 1: sticky + overflow-x: clip + negative margin
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { overflow-x: clip; background: #fff; }
            .hero-section {
              position: relative;
              width: 100%;
              height: 200vh;
              margin-bottom: -100vh;
              z-index: 10;
            }
            .hero-sticky {
              position: sticky;
              top: 0;
              left: 0;
              width: 100%;
              height: 100vh;
              background: #222;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .portfolio-section {
              position: relative;
              z-index: 20;
              width: 100%;
              min-height: 200vh;
              background: #F7F7F7;
              color: #111;
              padding: 50px;
            }
          </style>
        </head>
        <body>
          <div class="hero-section">
            <div class="hero-sticky">
              <h1>STICKY HERO VIEWPORT</h1>
            </div>
          </div>
          <div class="portfolio-section">
            <h2>PORTFOLIO CURTAIN</h2>
          </div>
        </body>
        </html>
        """
        page.set_content(html_content)
        
        for y in [0, 200, 450, 700, 900, 1100]:
            page.evaluate(f"window.scrollTo(0, {y})")
            data = page.evaluate("""() => {
                const sticky = document.querySelector('.hero-sticky');
                const port = document.querySelector('.portfolio-section');
                return {
                    scrollY: window.scrollY,
                    stickyTop: sticky.getBoundingClientRect().top,
                    portfolioTop: port.getBoundingClientRect().top
                };
            }""")
            print(f"y={y}: {data}")

        browser.close()

if __name__ == "__main__":
    test_sticky_behavior()

