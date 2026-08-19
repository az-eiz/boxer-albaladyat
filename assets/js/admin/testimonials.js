async function loadTestimonials() {
    const { data, error } = await window.db
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        $("testimonialsMessage").textContent = error.message;
        return;
    }

    $("testimonialsAdmin").innerHTML = data.map(testimonial => `
        <article class="admin-product" data-id="${testimonial.id}">
            <label>اسم الزبون</label>
            <input class="testimonial-author" value="${escapeHtml(testimonial.author_name || "")}">

            <label>التقييم (من 1 إلى 5)</label>
            <input class="testimonial-rating" type="number" min="1" max="5" value="${testimonial.rating || 5}">

            <label>نص التقييم</label>
            <textarea class="testimonial-comment">${escapeHtml(testimonial.comment || "")}</textarea>

            <button class="save-testimonial admin-btn primary small"><i class="fas fa-floppy-disk"></i> حفظ التقييم</button>
            <button class="delete-testimonial admin-btn danger small"><i class="fas fa-trash"></i> حذف التقييم</button>
        </article>
    `).join("");

    document.querySelectorAll(".save-testimonial")
        .forEach(button => button.addEventListener("click", saveTestimonial));

    document.querySelectorAll(".delete-testimonial")
        .forEach(button => button.addEventListener("click", deleteTestimonial));
}

async function saveTestimonial(event) {
    const card = event.target.closest(".admin-product");

    const update = {
        author_name: card.querySelector(".testimonial-author").value.trim(),
        rating: Math.min(5, Math.max(1, Number(card.querySelector(".testimonial-rating").value) || 5)),
        comment: card.querySelector(".testimonial-comment").value.trim()
    };

    const { error } = await window.db
        .from("testimonials")
        .update(update)
        .eq("id", card.dataset.id);

    $("testimonialsMessage").textContent = error
        ? `خطأ: ${error.message}`
        : "تم حفظ التقييم ✅";
}

async function deleteTestimonial(event) {
    const card = event.target.closest(".admin-product");

    if (!confirm("هل تريد حذف هذا التقييم؟")) return;

    const { error } = await window.db
        .from("testimonials")
        .delete()
        .eq("id", card.dataset.id);

    if (error) {
        $("testimonialsMessage").textContent = error.message;
        return;
    }

    $("testimonialsMessage").textContent = "تم حذف التقييم ✅";
    await loadTestimonials();
}

function wireTestimonials() {
    $("addTestimonialButton").addEventListener("click", async () => {
        const { error } = await window.db.from("testimonials").insert({
            author_name: "زبون",
            rating: 5,
            comment: ""
        });

        if (error) {
            $("testimonialsMessage").textContent = error.message;
            return;
        }

        await loadTestimonials();
    });
}
