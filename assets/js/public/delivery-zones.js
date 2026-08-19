(function initDeliveryZones() {
    const grid = document.getElementById("deliveryZonesGrid");

    if (!grid || !window.db) return;

    function escapeHtml(value = "") {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function renderZones(zones) {
        if (!zones.length) {
            grid.innerHTML = "";
            return;
        }

        grid.innerHTML = zones.map(zone => `
            <div class="delivery-card">
                <i class="fas fa-${escapeHtml(zone.icon || "truck")}"></i>
                <h5>${escapeHtml(zone.name || "")}</h5>
                <p>${escapeHtml(zone.description || "")}</p>
                <p style="color: var(--primary); font-weight: 800; margin-top:0.35rem;">${escapeHtml(zone.price_label || "")}</p>
            </div>
        `).join("");
    }

    async function loadZones() {
        const { data, error } = await window.db
            .from("delivery_zones")
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) {
            console.warn("Failed to load delivery zones:", error.message);
            return;
        }

        renderZones(data || []);
    }

    loadZones();

    window.db
        .channel("public-delivery-zones-updates")
        .on("postgres_changes", { event: "*", schema: "public", table: "delivery_zones" }, loadZones)
        .subscribe();
})();
