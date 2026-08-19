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
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        return await res.text();
    } catch (e) {
        console.warn('Failed to load', url, e);
        // return a minimal placeholder so layout doesn't break
        return `<!-- failed to load ${url} -->\n<div style="padding:2rem;background:#fff;border:1px solid #eee;border-radius:8px;text-align:center;">
            <img src="assets/images/placeholder.svg" alt="placeholder" style="max-width:240px;opacity:.95"/>
            <p style="color:#666;margin-top:.6rem">مكوّن غير متاح مؤقتاً</p>
        </div>`;
    }
}

async function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function loadComponents() {
    for (const name of components) {
        const target = document.querySelector(`[data-component="${name}"]`);
        if (!target) continue;
        const html = await fetchWithFallback(`components/${name}.html`);
        target.innerHTML = html;
    }
    // تحميل الـ main.js بعد المكونات
    await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
    await loadScript("assets/js/main.js");
}

loadComponents().catch(console.error);
