async function loadProducts() {
    const { data, error } = await window.db
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        $("productsMessage").textContent = error.message;
        return;
    }

    $("productsAdmin").innerHTML = data.map(product => `
        <article class="admin-product" data-id="${product.id}">
            <img class="product-preview"
                 src="${escapeHtml(product.image || "")}"
                 alt="${escapeHtml(product.name || "منتج")}">

            <label>اسم المنتج</label>
            <input class="product-name"
                   value="${escapeHtml(product.name || "")}">

            <label>الوصف</label>
            <textarea class="product-description">${escapeHtml(product.description || "")}</textarea>

            <label>السعر بالدينار</label>
            <input class="product-price"
                   type="number"
                   value="${product.price || 0}">

            <label>استبدال الصورة</label>
            <input class="product-file" type="file" accept="image/*">

            <button class="save-product btn btn-primary">
                حفظ التعديل
            </button>

            <button class="delete-product btn">
                حذف المنتج
            </button>
        </article>
    `).join("");

    document.querySelectorAll(".save-product")
        .forEach(button => button.addEventListener("click", saveProduct));

    document.querySelectorAll(".delete-product")
        .forEach(button => button.addEventListener("click", deleteProduct));
}

async function uploadImage(file) {
    const extension = file.name.split(".").pop().toLowerCase();
    const path = `products/${crypto.randomUUID()}.${extension}`;

    const { error } = await window.db.storage
        .from("site-images")
        .upload(path, file);

    if (error) throw error;

    const { data } = window.db.storage
        .from("site-images")
        .getPublicUrl(path);

    return data.publicUrl;
}

async function saveProduct(event) {
    const card = event.target.closest(".admin-product");
    const id = card.dataset.id;

    try {
        const file = card.querySelector(".product-file").files[0];

        const update = {
            name: card.querySelector(".product-name").value.trim(),
            description: card.querySelector(".product-description").value.trim(),
            price: Number(card.querySelector(".product-price").value)
        };

        if (file) {
            update.image = await uploadImage(file);
        }

        const { error } = await window.db
            .from("products")
            .update(update)
            .eq("id", id);

        if (error) throw error;

        $("productsMessage").textContent = "تم تعديل المنتج ✅";
        await loadProducts();
    } catch (error) {
        $("productsMessage").textContent = `خطأ: ${error.message}`;
    }
}

async function deleteProduct(event) {
    const card = event.target.closest(".admin-product");

    if (!confirm("هل تريد حذف هذا المنتج؟")) return;

    const { error } = await window.db
        .from("products")
        .delete()
        .eq("id", card.dataset.id);

    if (error) {
        $("productsMessage").textContent = error.message;
        return;
    }

    $("productsMessage").textContent = "تم حذف المنتج ✅";
    await loadProducts();
}

function wireProducts() {
    $("addProductButton").addEventListener("click", async () => {
        const { error } = await window.db.from("products").insert({
            name: "منتج جديد",
            description: "",
            price: 0,
            image: "",
            available: true
        });

        if (error) {
            $("productsMessage").textContent = error.message;
            return;
        }

        await loadProducts();
    });
}
