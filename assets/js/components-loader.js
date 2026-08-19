const components = [
    "header",
    "hero",
    "services",
    "process",
    "products",
    "gallery",
    "faq",
    "delivery",
    "contact",
    "floating-ui",
    "footer"
];

async function fetchWithFallback(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        return await response.text();
    } catch (error) {
        console.warn("Failed to load:", url, error);

        return `
            <div class="component-error">
                <img src="assets/images/placeholder.svg" alt="مكوّن غير متاح">
                <p>هذا الجزء غير متاح مؤقتًا.</p>
            </div>
        `;
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

async function loadComponents() {
    for (const name of components) {
        const target = document.querySelector(`[data-component="${name}"]`);

        if (!target) {
            console.warn(`Component target not found: ${name}`);
            continue;
        }

        target.innerHTML = await fetchWithFallback(`components/${name}.html`);
    }

    await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
    await loadScript("assets/js/supabase-client.js");
    await loadScript("assets/js/public/navigation.js");
    await loadScript("assets/js/public/scroll-effects.js");
    await loadScript("assets/js/public/shop-clock.js");
    await loadScript("assets/js/public/gallery-filter.js");
    await loadScript("assets/js/public/faq.js");
    await loadScript("assets/js/public/products.js");
    await loadScript("assets/js/public/services.js");
    await loadScript("assets/js/features/contact-form.js");
}

loadComponents().catch(console.error);
