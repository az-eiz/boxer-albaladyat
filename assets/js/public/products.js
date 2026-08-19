(function initProducts() {
    const grid = document.querySelector(".products-grid");

    if (!grid || !window.db) return;

    function escapeHtml(value = "") {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function formatPrice(price) {
        return `${Number(price || 0).toLocaleString("en-US")} <span class="currency">د.ع</span>`;
    }

    function renderProducts(products) {
        if (!products.length) {
            grid.innerHTML = `<p class="empty-state">لا توجد منتجات معروضة حالياً.</p>`;
            return;
        }

        grid.innerHTML = products.map(product => {
            const whatsappText = encodeURIComponent(`أريد شراء: ${product.name || "منتج"}`);

            return `
                <div class="product-card reveal">
                    <div class="product-image" style="background-image: url('${escapeHtml(product.image || "")}');">
                        ${product.available === false
                    ? '<span class="product-badge">غير متوفر</span>'
                    : ''}
                        <div class="product-overlay">
                            <a href="https://wa.me/9647713733002?text=${whatsappText}"
                                class="product-action" target="_blank" rel="noopener">
                                <i class="fab fa-whatsapp"></i> اطلب الآن
                            </a>
                        </div>
                    </div>
                    <div class="product-details">
                        <h4>${escapeHtml(product.name || "")}</h4>
                        <p class="product-desc">${escapeHtml(product.description || "")}</p>
                        <div class="product-price">${formatPrice(product.price)}</div>
                    </div>
                </div>
            `;
        }).join("");
    }

    async function loadProducts() {
        const { data, error } = await window.db
            .from("products")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            console.warn("Failed to load products:", error.message);
            return;
        }

        renderProducts(data || []);
    }

    loadProducts();

    window.db
        .channel("public-products-updates")
        .on("postgres_changes", { event: "*", schema: "public", table: "products" }, loadProducts)
        .subscribe();
})();
