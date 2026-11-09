from PIL import Image

def generate_report():
    # 1. Word illumination progression (Faded -> Midway -> Full)
    faded = Image.open("audit/frames/local_about_step_-800.png")
    midway = Image.open("audit/frames/local_about_step_-400.png")
    full = Image.open("audit/frames/local_about_step_0.png")

    # Crop to just the text region (y: 100 to 650)
    w, h = faded.width, faded.height
    crop_box = (0, 100, w, 650)
    c_faded = faded.crop(crop_box)
    c_midway = midway.crop(crop_box)
    c_full = full.crop(crop_box)

    combined_about = Image.new("RGB", (w, c_faded.height * 3))
    combined_about.paste(c_faded, (0, 0))
    combined_about.paste(c_midway, (0, c_faded.height))
    combined_about.paste(c_full, (0, c_faded.height * 2))
    combined_about.save("audit/comparisons/comp_phase5_about_illumination_progression.png")
    print("Saved comp_phase5_about_illumination_progression.png")

    # 2. Advantages sequence (01 -> 02 -> 03 -> 04)
    adv1 = Image.open("audit/frames/local_adv_01.png")
    adv2 = Image.open("audit/frames/local_adv_02.png")
    adv3 = Image.open("audit/frames/local_adv_03.png")
    adv4 = Image.open("audit/frames/local_adv_04.png")

    # 2x2 grid of advantages sequence
    grid = Image.new("RGB", (adv1.width * 2, adv1.height * 2))
    grid.paste(adv1, (0, 0))
    grid.paste(adv2, (adv1.width, 0))
    grid.paste(adv3, (0, adv1.height))
    grid.paste(adv4, (adv1.width, adv1.height))
    grid.save("audit/comparisons/comp_phase5_advantages_grid.png")
    print("Saved comp_phase5_advantages_grid.png")

if __name__ == "__main__":
    generate_report()

