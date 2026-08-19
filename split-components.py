from pathlib import Path
import re

source = Path("Boxer_ALbaladyat.html")
html = source.read_text(encoding="utf-8")

sections = {
    "header.html": r"<!-- Header -->.*?(?=<!-- Hero Section -->)",
    "hero.html": r"<!-- Hero Section -->.*?(?=<!-- Services Section -->)",
    "services.html": r"<!-- Services Section -->.*?(?=<!-- Work Process Section -->)",
    "process.html": r"<!-- Work Process Section -->.*?(?=<!-- Products Section -->)",
    "products.html": r"<!-- Products Section -->.*?(?=<!-- Gallery Section)",
    "gallery.html": r"<!-- Gallery Section.*?-->.*?(?=<!-- FAQ Section -->)",
    "faq.html": r"<!-- FAQ Section -->.*?(?=<!-- Delivery & Map Section -->)",
    "delivery.html": r"<!-- Delivery & Map Section -->.*?(?=<!-- Contact Section)",
    "contact.html": r"<!-- Contact Section.*?-->.*?(?=<!-- WhatsApp Floating Button -->)",
    "floating-ui.html": r"<!-- WhatsApp Floating Button -->.*?(?=<!-- Footer -->)",
    "footer.html": r"<!-- Footer -->.*?(?=<script src=)",
}

components = Path("components")

for filename, pattern in sections.items():
    match = re.search(pattern, html, re.DOTALL)
    if match:
        (components / filename).write_text(match.group(0).strip() + "\n", encoding="utf-8")
        print(f"Created: components/{filename}")
    else:
        print(f"Not found: {filename}")

body_pattern = r"(?s)(?<=<body>).*?(?=</body>)"

body = """
    <div id="scrollProgress"></div>

    <div data-component="header"></div>
    <div data-component="hero"></div>
    <div data-component="services"></div>
    <div data-component="process"></div>
    <div data-component="products"></div>
    <div data-component="gallery"></div>
    <div data-component="faq"></div>
    <div data-component="delivery"></div>
    <div data-component="contact"></div>
    <div data-component="floating-ui"></div>
    <div data-component="footer"></div>

    <script src="assets/js/components-loader.js"></script>
    <script src="assets/js/main.js"></script>
"""

html = re.sub(body_pattern, body, html)
source.write_text(html, encoding="utf-8")

print("HTML successfully separated.")
