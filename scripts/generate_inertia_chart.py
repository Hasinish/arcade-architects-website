import json
import os
from PIL import Image, ImageDraw, ImageFont

def render_inertia_chart():
    os.makedirs('audit/comparisons', exist_ok=True)
    with open('audit/scroll_inertia_audit.json', 'r') as f:
        frames = json.load(f)

    w, h = 1000, 480
    img = Image.new("RGB", (w, h), "#111114")
    draw = ImageDraw.Draw(img)

    # Header
    draw.rectangle([0, 0, w, 56], fill="#18181C")
    draw.text((28, 18), "ARCADE ARCHITECTS — SUBTLE SCROLL INERTIA & DECELERATION PROFILE", fill="#FFFFFF")

    # Chart Box
    left, right = 80, 940
    top, bottom = 90, 420
    draw.rectangle([left, top, right, bottom], outline="#2A2A30", width=1)

    # Gridlines
    for gy in range(top, bottom + 1, 65):
        draw.line([left, gy, right, gy], fill="#1E1E24", width=1)
    for gx in range(left, right + 1, 140):
        draw.line([gx, top, gx, bottom], fill="#1E1E24", width=1)

    max_vel = max((f['velocity'] for f in frames), default=1)
    max_frames = len(frames)

    points = []
    for i, f in enumerate(frames):
        x = left + (i / (max_frames - 1)) * (right - left)
        # Invert y: velocity max at top, 0 at bottom
        norm_v = max(0, min(1, f['velocity'] / (max_vel * 1.05)))
        y = bottom - norm_v * (bottom - top)
        points.append((x, y))

    # Draw Velocity curve (Cyan / Architectural Blue)
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill="#00D2FF", width=3)

    # Annotate Wheel input stop point
    wheel_stop_x = left + (10 / (max_frames - 1)) * (right - left)
    draw.line([wheel_stop_x, top, wheel_stop_x, bottom], fill="#E45D36", width=2)
    draw.text((wheel_stop_x + 8, top + 15), "Wheel Input Stops Here", fill="#E45D36")
    draw.text((wheel_stop_x + 8, top + 35), "Subtle Inertial Glide (50+ frames of decay) ->", fill="#888899")

    # Labels
    draw.text((20, top - 5), f"{max_vel:.0f} px/s", fill="#888899")
    draw.text((35, bottom - 10), "0 px/s", fill="#888899")
    draw.text((left, bottom + 12), "Frame 0 (Wheel Start)", fill="#888899")
    draw.text((right - 140, bottom + 12), f"Frame {max_frames} (Smooth Settle)", fill="#888899")

    chart_path = "audit/comparisons/scroll_inertia_curve.png"
    img.save(chart_path)
    print(f"Chart saved to {chart_path}!")

if __name__ == '__main__':
    render_inertia_chart()

