async function loadServices() {
    const { data, error } = await window.db
        .from("services")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        $("servicesMessage").textContent = error.message;
        return;
    }

    $("servicesAdmin").innerHTML = data.map(service => `
        <article class="admin-service" data-id="${service.id}">
            ${service.image ? `<img class="product-preview" src="${escapeHtml(service.image)}" alt="${escapeHtml(service.title || "خدمة")}">` : ""}

            <label>اسم الخدمة</label>
            <input class="service-title"
                   value="${escapeHtml(service.title || "")}">

            <label>الوصف</label>
            <textarea class="service-description">${escapeHtml(service.description || "")}</textarea>

            <label>السعر بالدينار</label>
            <input class="service-price"
                   type="number"
                   value="${service.price || 0}">

            <label>صورة الخدمة (اختياري، إذا ما رفعت صورة تظهر أيقونة افتراضية)</label>
            <input class="service-file" type="file" accept="image/*">

            <label>
                <input class="service-available"
                       type="checkbox"
                       ${service.available ? "checked" : ""}>
                الخدمة متاحة
            </label>

            <button class="save-service admin-btn primary small">
                <i class="fas fa-floppy-disk"></i> حفظ الخدمة
            </button>

            <button class="delete-service admin-btn danger small">
                <i class="fas fa-trash"></i> حذف الخدمة
            </button>
        </article>
    `).join("");

    document.querySelectorAll(".save-service")
        .forEach(button => button.addEventListener("click", saveService));

    document.querySelectorAll(".delete-service")
        .forEach(button => button.addEventListener("click", deleteService));
}

async function saveService(event) {
    const card = event.target.closest(".admin-service");

    try {
        const file = card.querySelector(".service-file").files[0];

        const update = {
            title: card.querySelector(".service-title").value.trim(),
            description: card.querySelector(".service-description").value.trim(),
            price: Number(card.querySelector(".service-price").value),
            available: card.querySelector(".service-available").checked
        };

        if (file) {
            update.image = await uploadImage(file, "services");
        }

        const { error } = await window.db
            .from("services")
            .update(update)
            .eq("id", card.dataset.id);

        if (error) throw error;

        $("servicesMessage").textContent = "تم حفظ الخدمة ✅";
        await loadServices();
    } catch (error) {
        $("servicesMessage").textContent = `خطأ: ${error.message}`;
    }
}

async function deleteService(event) {
    const card = event.target.closest(".admin-service");

    if (!confirm("هل تريد حذف هذه الخدمة؟")) return;

    const { error } = await window.db
        .from("services")
        .delete()
        .eq("id", card.dataset.id);

    if (error) {
        $("servicesMessage").textContent = error.message;
        return;
    }

    await loadServices();
    $("servicesMessage").textContent = "تم حذف الخدمة ✅";
}

function wireServices() {
    $("addServiceButton").addEventListener("click", async () => {
        const { error } = await window.db.from("services").insert({
            title: "خدمة جديدة",
            description: "",
            price: 0,
            image: "",
            available: true
        });

        if (error) {
            $("servicesMessage").textContent = error.message;
            return;
        }

        await loadServices();
    });
}
