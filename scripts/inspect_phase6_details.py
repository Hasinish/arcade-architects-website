from playwright.sync_api import sync_playwright
import json

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)
        
        details = page.evaluate("""() => {
            const ctaWrap = document.querySelector('.cta_wrapper');
            const ctaWrapStyle = ctaWrap ? {
                display: window.getComputedStyle(ctaWrap).display,
                flexDirection: window.getComputedStyle(ctaWrap).flexDirection,
                justifyContent: window.getComputedStyle(ctaWrap).justifyContent,
                height: window.getComputedStyle(ctaWrap).height,
                padding: window.getComputedStyle(ctaWrap).padding,
                position: window.getComputedStyle(ctaWrap).position
            } : null;

            const ctaHeading = document.querySelector('.cta_heading');
            const ctaHeadingStyle = ctaHeading ? {
                fontSize: window.getComputedStyle(ctaHeading).fontSize,
                lineHeight: window.getComputedStyle(ctaHeading).lineHeight,
                maxWidth: window.getComputedStyle(ctaHeading).maxWidth,
                width: window.getComputedStyle(ctaHeading).width
            } : null;

            const ctaBtns = document.querySelector('.cta_btns');
            const ctaBtnsStyle = ctaBtns ? {
                display: window.getComputedStyle(ctaBtns).display,
                gap: window.getComputedStyle(ctaBtns).gap,
                marginTop: window.getComputedStyle(ctaBtns).marginTop
            } : null;

            const faqWrap = document.querySelector('.faq_wrapper');
            const faqWrapStyle = faqWrap ? {
                display: window.getComputedStyle(faqWrap).display,
                gridTemplateColumns: window.getComputedStyle(faqWrap).gridTemplateColumns,
                gap: window.getComputedStyle(faqWrap).gap,
                padding: window.getComputedStyle(faqWrap).padding
            } : null;

            const faqItems = Array.from(document.querySelectorAll('.faq_item')).map(item => {
                const title = item.querySelector('.faq_item_title, [class*="title"], h3');
                const content = item.querySelector('.faq_item_content, [class*="content"], p, [class*="panel"]');
                return {
                    question: title ? title.innerText.trim() : '',
                    answer: content ? content.innerText.trim() : '',
                    borderBottom: window.getComputedStyle(item).borderBottom
                };
            });

            const footer = document.querySelector('.section_footer');
            const footerStyle = footer ? {
                backgroundColor: window.getComputedStyle(footer).backgroundColor,
                padding: window.getComputedStyle(footer).padding,
                height: window.getComputedStyle(footer).height
            } : null;

            const footerCols = Array.from(document.querySelectorAll('.footer_col, [class*="footer_col"]')).map(col => ({
                class: col.className,
                title: col.querySelector('.footer_col_title')?.innerText || '',
                links: Array.from(col.querySelectorAll('a')).map(a => ({
                    text: a.innerText.trim(),
                    href: a.getAttribute('href')
                }))
            }));

            return {
                ctaWrapStyle,
                ctaHeadingStyle,
                ctaBtnsStyle,
                faqWrapStyle,
                faqItems,
                footerStyle,
                footerCols
            };
        }""")
        
        print(json.dumps(details, indent=2))
        with open("audit/phase6_full_details.json", "w", encoding="utf-8") as f:
            json.dump(details, f, indent=2)
            
        browser.close()

if __name__ == "__main__":
    main()

