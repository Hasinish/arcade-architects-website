import asyncio
from playwright.async_api import async_playwright

html = """
<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; }
    .track {
      position: relative;
      width: 1000px;
      height: 240px;
      background: red;
    }
    .slide {
      position: absolute;
      top: 0;
      left: 32%;
      width: 36%;
      height: 0;
      padding-bottom: 24%;
      background: green;
    }
    .inner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: blue;
    }
  </style>
</head>
<body>
  <div class="track">
    <div class="slide">
      <div class="inner"></div>
    </div>
  </div>
</body>
</html>
"""

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page()
        await page.set_content(html)
        inner_rect = await page.evaluate("""() => {
            const inner = document.querySelector('.inner');
            const r = inner.getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height };
        }""")
        print('Inner rect:', inner_rect)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())

