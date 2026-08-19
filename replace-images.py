from pathlib import Path
import re

image_folder = Path("assets/images")

images = [
    "mechanic.png",
    "boxer-showroom.png",
    "workshop.png",
    "piston-rings.png",
    "brake-shoes.png",
    "battery.png",
    "before-after.png",
    "another-before-after.png",
    "spare-parts.png",
    "front-view.png",
    "boxer-side.png",
    "used-boxer.png",
    "rider.png",
    "owner.png",
]

external_pattern = re.compile(
    r"https?://[^'\" )]+(?:trae\.ai|coresg-normal|text_to-image)[^'\" )]*",
    re.IGNORECASE
)

index = 0

for file in Path("components").glob("*.html"):
    content = file.read_text(encoding="utf-8")

    def replace_image(match):
        global index
        image = images[index % len(images)]
        index += 1
        return f"assets/images/{image}"

    updated = external_pattern.sub(replace_image, content)

    if updated != content:
        file.write_text(updated, encoding="utf-8")
        print(f"Updated: {file}")

print(f"Replaced images: {index}")
