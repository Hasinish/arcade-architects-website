import urllib.request
import re

url = "https://www.snohetta.com/assets/1790159390/bundle.es.js"
print("Downloading bundle.es.js...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        code = resp.read().decode('utf-8')
        print(f"Downloaded {len(code)} characters.")
        
        # Search for carousel / slider / drag logic
        matches = [m.start() for m in re.finditer(r'(carousel|slider|draggable|pointerdown|pan|track)', code, re.IGNORECASE)]
        print(f"Found {len(matches)} matches.")
        
        # Let's search for the image scaling calculation
        # look for 0.666 or 1.5 or scale or width calculation
        math_matches = [m.start() for m in re.finditer(r'(ratio|scale|width|aspect|clamp|lerp|active)', code, re.IGNORECASE)]
        print(f"Found {len(math_matches)} math matches.")
        
        # Write matches near 'frontpage' or 'gallery'
        for m in re.finditer(r'(frontpage|hero|header)', code, re.IGNORECASE):
            idx = m.start()
            snippet = code[max(0, idx-100):min(len(code), idx+300)]
            if 'image' in snippet or 'slide' in snippet or 'drag' in snippet or 'touch' in snippet:
                print("--- SNIPPET ---")
                print(snippet)
                break

except Exception as e:
    print("Error:", e)

