from PIL import Image

img = Image.open(r"C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b\.user_uploaded\media_1794325519726_5ea84b13.png")
print("Size:", img.size)

# The image is 1024x512 or similar. Let's see what is on the left and right edges!
w, h = img.size
left_strip = img.crop((0, 0, 100, h))
left_strip.save("audit/services_left_strip.png")

right_strip = img.crop((w - 100, 0, w, h))
right_strip.save("audit/services_right_strip.png")
print("Saved strips")

