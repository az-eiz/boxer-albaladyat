async function loadDeliveryZones() {
    const { data, error } = await window.db
        .from("delivery_zones")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        $("deliveryZonesMessage").textContent = error.message;
        return;
    }

    $("deliveryZonesAdmin").innerHTML = data.map(zone => `
        <article class="admin-product" data-id="${zone.id}">
            <label>اسم المنطقة</label>
            <input class="zone-name" value="${escapeHtml(zone.name || "")}">

            <label>الوصف</label>
            <input class="zone-description" value="${escapeHtml(zone.description || "")}">

            <label>السعر / المدة</label>
            <input class="zone-price-label" value="${escapeHtml(zone.price_label || "")}">

            <label>أيقونة (Font Awesome، بدون "fa-")</label>
            <input class="zone-icon" value="${escapeHtml(zone.icon || "truck")}" placeholder="مثال: city, route, ship">

            <label>ترتيب الظهور</label>
            <input class="zone-sort-order" type="number" value="${zone.sort_order || 0}">

            <button class="save-zone admin-btn primary small"><i class="fas fa-floppy-disk"></i> حفظ المنطقة</button>
            <button class="delete-zone admin-btn danger small"><i class="fas fa-trash"></i> حذف المنطقة</button>
        </article>
    `).join("");

    document.querySelectorAll(".save-zone")
        .forEach(button => button.addEventListener("click", saveDeliveryZone));

    document.querySelectorAll(".delete-zone")
        .forEach(button => button.addEventListener("click", deleteDeliveryZone));
}

async function saveDeliveryZone(event) {
    const card = event.target.closest(".admin-product");

    const update = {
        name: card.querySelector(".zone-name").value.trim(),
        description: card.querySelector(".zone-description").value.trim(),
        price_label: card.querySelector(".zone-price-label").value.trim(),
        icon: card.querySelector(".zone-icon").value.trim() || "truck",
        sort_order: Number(card.querySelector(".zone-sort-order").value) || 0
    };

    const { error } = await window.db
        .from("delivery_zones")
        .update(update)
        .eq("id", card.dataset.id);

    $("deliveryZonesMessage").textContent = error
        ? `خطأ: ${error.message}`
        : "تم حفظ منطقة التوصيل ✅";
}

async function deleteDeliveryZone(event) {
    const card = event.target.closest(".admin-product");

    if (!confirm("هل تريد حذف منطقة التوصيل هذه؟")) return;

    const { error } = await window.db
        .from("delivery_zones")
        .delete()
        .eq("id", card.dataset.id);

    if (error) {
        $("deliveryZonesMessage").textContent = error.message;
        return;
    }

    $("deliveryZonesMessage").textContent = "تم حذف المنطقة ✅";
    await loadDeliveryZones();
}

function wireDelivery() {
    $("addZoneButton").addEventListener("click", async () => {
        const { error } = await window.db.from("delivery_zones").insert({
            name: "منطقة جديدة",
            description: "",
            price_label: "",
            icon: "truck",
            sort_order: 0
        });

        if (error) {
            $("deliveryZonesMessage").textContent = error.message;
            return;
        }

        await loadDeliveryZones();
    });
}
