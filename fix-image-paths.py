from pathlib import Path
import re

root = Path(".")
image_root = root / "assets" / "images"

image_map = {}
for image in image_root.rglob("*"):
    if image.is_file():
        image_map[image.name.lower()] = image.relative_to(root).as_posix()

files = list((root / "components").glob("*.html"))
files += list((root / "assets" / "css").glob("*.css"))
files += list((root / "assets" / "js").rglob("*.js"))

pattern = re.compile(
    r"(?:assets/images/|images/)([^'\" )?#]+)",
    re.IGNORECASE
)

for file in files:
    content = file.read_text(encoding="utf-8")

    def replace(match):
        filename = Path(match.group(1)).name.lower()
        target = image_map.get(filename)

        if not target:
            return match.group(0)

        # CSS paths are relative to assets/css
        if file.suffix == ".css":
            target = Path(
                __import__("os").path.relpath(target, file.parent)
            ).as_posix()

        return target

    updated = pattern.sub(replace, content)

    if updated != content:
        file.write_text(updated, encoding="utf-8")
        print(f"Fixed: {file}")

print("Image paths fixed.")