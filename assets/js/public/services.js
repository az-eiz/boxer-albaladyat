(function initServices() {
    const grid = document.querySelector(".services-grid");

    if (!grid || !window.db) return;

    function escapeHtml(value = "") {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function renderServices(services) {
        if (!services.length) {
            grid.innerHTML = `<p class="empty-state">لا توجد خدمات معروضة حالياً.</p>`;
            return;
        }

        grid.innerHTML = services.map(service => `
            <div class="service-card reveal">
                <div class="service-icon-wrap">
                    <i class="fas fa-wrench service-icon"></i>
                </div>
                <h4>${escapeHtml(service.title || "")}</h4>
                <p>${escapeHtml(service.description || "")}</p>
                <span class="service-price">${service.available === false
                ? "غير متوفر حالياً"
                : `تبدأ من ${Number(service.price || 0).toLocaleString("en-US")} د.ع`
            }</span>
            </div>
        `).join("");
    }

    async function loadServices() {
        const { data, error } = await window.db
            .from("services")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            console.warn("Failed to load services:", error.message);
            return;
        }

        renderServices(data || []);
    }

    loadServices();

    window.db
        .channel("public-services-updates")
        .on("postgres_changes", { event: "*", schema: "public", table: "services" }, loadServices)
        .subscribe();
})();
