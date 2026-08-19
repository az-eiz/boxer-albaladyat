(function initTestimonials() {
    const grid = document.getElementById("testimonialsGrid");
    const section = document.getElementById("testimonials");

    if (!grid || !window.db) return;

    if (section) section.hidden = true;

    function escapeHtml(value = "") {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function stars(rating) {
        const full = Math.min(5, Math.max(0, Number(rating) || 0));
        return Array.from({ length: 5 }, (_, i) =>
            `<i class="fa-star ${i < full ? "fas" : "far"}"></i>`
        ).join("");
    }

    function updateRatingBadge(testimonials) {
        const badge = document.getElementById("ratingBadge");
        const text = document.getElementById("ratingBadgeText");

        if (!badge || !text) return;

        if (!testimonials.length) {
            badge.hidden = true;
            return;
        }

        const average = testimonials.reduce((sum, t) => sum + (Number(t.rating) || 0), 0) / testimonials.length;
        text.textContent = `${average.toFixed(1)} (${testimonials.length})`;
        badge.hidden = false;
    }

    function renderTestimonials(testimonials) {
        if (section) section.hidden = testimonials.length === 0;
        updateRatingBadge(testimonials);

        grid.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card reveal">
                <div class="testimonial-stars">${stars(testimonial.rating)}</div>
                <p class="testimonial-comment">${escapeHtml(testimonial.comment || "")}</p>
                <p class="testimonial-author">- ${escapeHtml(testimonial.author_name || "زبون")}</p>
            </div>
        `).join("");
    }

    async function loadTestimonials() {
        const { data, error } = await window.db
            .from("testimonials")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.warn("Failed to load testimonials:", error.message);
            return;
        }

        renderTestimonials(data || []);
    }

    loadTestimonials();

    window.db
        .channel("public-testimonials-updates")
        .on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, loadTestimonials)
        .subscribe();
})();
