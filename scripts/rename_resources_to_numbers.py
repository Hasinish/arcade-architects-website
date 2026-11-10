import os
import shutil
from PIL import Image

# Mapping of folder relative to Resources -> list of original filenames in desired sequence (1.jpg, 2.jpg, ...)
PROJECT_IMAGE_MAPPINGS = {
    os.path.join("Exterior", "Hazi Bari Project"): [
        "01.png",
        "02.png",
        "03.png",
        "02_01.jpg"
    ],
    os.path.join("Exhibition", "Ford"): [
        "01_Photo - 10 (FILEminimizer).jpg",
        "01_Photo - 7 (FILEminimizer).jpg",
        "01_Photo - 8 (FILEminimizer).jpg",
        "01_Photo - 9 (FILEminimizer).jpg"
    ],
    os.path.join("Interior", "Cafe"): [
        "nidasheena (1).jpg",
        "nidasheena (6).jpg",
        "nidasheena (7).jpg",
        "nidasheena (8).jpg",
        "nidasheena (9).jpg",
        "nidasheena (10).jpg",
        "nidasheena (11).jpg",
        "nidasheena (12).jpg"
    ],
    os.path.join("Exterior", "CHANDINA PROJECT"): [
        "D.V-02.png",
        "D.V-03.png",
        "N.V-01.png"
    ],
    os.path.join("Interior", "Appart", "New folder"): [
        "001.png",
        "005.png",
        "D5_Image 5_20230726_154605.png",
        "D5_Image_20230726_160035.png",
        "D5_Image 6_20230726_154318.png"
    ],
    os.path.join("Exterior", "USA"): [
        "001_10 - Photo.jpg",
        "001_8 - Photo.jpg",
        "001_9 - Photo.jpg",
        "001_Orthographic - Elevation.jpg"
    ],
    os.path.join("Exterior", "KOTBARI PROJECT"): [
        "01.png",
        "03.png",
        "04.png"
    ],
    os.path.join("Exterior", "Laksam Project"): [
        "01.png",
        "02.png",
        "03.png",
        "04.png"
    ],
    os.path.join("Interior", "Appart", "New folder (2)"): [
        "002.png",
        "D5_Image_20231207_175834.png",
        "D5_Image_20231210_160251 copy.jpg",
        "D5_Image_20231210_181837 copy.jpg",
        "D5_Image_20231210_182153 copy.jpg"
    ],
    os.path.join("Interior", "Resi"): [
        "m (2).jpg",
        "m (3).jpg",
        "m (4).jpg",
        "m (5).jpg",
        "01 (1) (FILEminimizer).jpg",
        "02 (1) (FILEminimizer).jpg",
        "04 (FILEminimizer).jpg"
    ]
}

def process_directory(base_dir):
    print(f"\nProcessing base directory: {base_dir}")
    for rel_folder, file_list in PROJECT_IMAGE_MAPPINGS.items():
        folder_path = os.path.join(base_dir, rel_folder)
        if not os.path.exists(folder_path):
            print(f"Directory not found: {folder_path}")
            continue

        print(f"\n--- {rel_folder} ---")
        temp_dir = os.path.join(folder_path, "_temp_numbered")
        os.makedirs(temp_dir, exist_ok=True)

        # 1. Convert/copy each image to numbered 1.jpg, 2.jpg... in temp_dir
        for idx, orig_name in enumerate(file_list, start=1):
            src_path = os.path.join(folder_path, orig_name)
            target_name = f"{idx}.jpg"
            dest_path = os.path.join(temp_dir, target_name)

            if os.path.exists(src_path):
                # Open with PIL, convert to RGB if needed, and save as high-quality JPG
                try:
                    with Image.open(src_path) as im:
                        rgb_im = im.convert("RGB")
                        rgb_im.save(dest_path, "JPEG", quality=95, optimize=True)
                    print(f"Converted: '{orig_name}' -> '{target_name}'")
                except Exception as e:
                    print(f"Error converting {src_path}: {e}")
            else:
                # Check if it was already renamed to idx.jpg
                existing = os.path.join(folder_path, target_name)
                if os.path.exists(existing):
                    shutil.copy2(existing, dest_path)
                    print(f"Already numbered: {target_name}")
                else:
                    print(f"WARNING: File not found: {src_path}")

        # 2. Remove old un-numbered image files in folder_path
        for f in os.listdir(folder_path):
            if f == "_temp_numbered":
                continue
            full_p = os.path.join(folder_path, f)
            if os.path.isfile(full_p) and f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                os.remove(full_p)

        # 3. Move numbered files from temp_dir to folder_path
        for f in os.listdir(temp_dir):
            shutil.move(os.path.join(temp_dir, f), os.path.join(folder_path, f))
        os.rmdir(temp_dir)
        print(f"Finished {rel_folder}: {os.listdir(folder_path)}")

def main():
    # Process Resources directory
    process_directory("Resources")
    
    # Process public/assets directory
    process_directory(os.path.join("public", "assets"))

if __name__ == "__main__":
    main()

