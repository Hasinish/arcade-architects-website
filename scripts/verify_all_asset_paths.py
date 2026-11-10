import re
import os

def check_paths():
    src_dir = 'src'
    asset_pattern = re.compile(r"'/assets/[^']+'")
    
    missing = []
    found = []

    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if f.endswith(('.ts', '.tsx', '.js', '.jsx')):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8') as file:
                    content = file.read()
                    matches = asset_pattern.findall(content)
                    for m in matches:
                        clean_m = m.strip("'")
                        disk_path = os.path.join('public', clean_m.lstrip('/'))
                        if not os.path.exists(disk_path):
                            missing.append((p, clean_m, disk_path))
                        else:
                            found.append((clean_m, disk_path))

    print(f"Total asset references checked: {len(found) + len(missing)}")
    print(f"Valid assets found: {len(found)}")
    if missing:
        print("\nMISSING ASSETS:")
        for m in missing:
            print(f"File {m[0]} -> {m[1]} NOT FOUND at {m[2]}")
    else:
        print("\nALL ASSET REFERENCES RESOLVED 100% CLEANLY!")

if __name__ == '__main__':
    check_paths()

