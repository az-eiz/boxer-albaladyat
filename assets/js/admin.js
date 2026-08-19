const SUPABASE_URL = "https://umqezfgbfznnhiqzkcfx.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtcWV6ZmdiZnpubmhpcXprY2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwOTY2NzMsImV4cCI6MjEwMjY3MjY3M30.v-kBl4vXDGHa2xDO4Q3N5LD6ffp55nUtFJv3b_poqJk";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const $ = id => document.getElementById(id);

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function loadSettings() {
    const { data, error } = await db
        .from("site_settings")
        .select("value")
        .eq("key", "main")
        .maybeSingle();

    if (error) {
        $("saveMessage").textContent = error.message;
        return;
    }

    const settings = data?.value || {};

    $("siteTitle").value = settings.title || "";
    $("phone").value = settings.phone || "";
    $("hours").value = settings.hours || "";
    $("heroText").value = settings.heroText || "";
    $("locationName").value = settings.locationName || "";
    $("mapUrl").value =
        settings.mapUrl ||
        "https://maps.app.goo.gl/Dqd6VUGC9ceePGnq6";
}

async function saveSettings() {
    const value = {
        title: $("siteTitle").value.trim(),
        phone: $("phone").value.trim(),
        hours: $("hours").value.trim(),
        heroText: $("heroText").value.trim(),
        locationName: $("locationName").value.trim(),
        mapUrl: $("mapUrl").value.trim()
    };

    const { error } = await db.from("site_settings").upsert(
        {
            key: "main",
            value,
            updated_at: new Date().toISOString()
        },
        { onConflict: "key" }
    );

    $("saveMessage").textContent = error
        ? `خطأ: ${error.message}`
        : "تم حفظ الإعدادات ✅";
}

async function loadProducts() {
    const { data, error } = await db
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

    const { error } = await db.storage
        .from("site-images")
        .upload(path, file);

    if (error) throw error;

    const { data } = db.storage
        .from("site-images")
        .getPublicUrl(path);

    return data.publicUrl;
}

async function saveProduct(event) {
    const card = event.target.closest(".admin-product");
    const id = card.dataset.id;
    const file = card.querySelector(".product-file").files[0];

    const update = {
        name: card.querySelector(".product-name").value.trim(),
        description: card.querySelector(".product-description").value.trim(),
        price: Number(card.querySelector(".product-price").value)
    };

    try {
        if (file) {
            update.image = await uploadImage(file);
        }

        const { error } = await db
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

    const { error } = await db
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

$("addProductButton").addEventListener("click", async () => {
    const { error } = await db.from("products").insert({
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

$("saveButton").addEventListener("click", saveSettings);
$("loginButton").addEventListener("click", async () => {
    const { error } = await db.auth.signInWithPassword({
        email: $("email").value.trim(),
        password: $("password").value
    });

    if (error) {
        $("loginMessage").textContent = error.message;
        return;
    }

    $("loginBox").hidden = true;
    $("dashboard").hidden = false;

    await loadSettings();
    await loadProducts();
});

$("logoutButton").addEventListener("click", async () => {
    await db.auth.signOut();
    $("loginBox").hidden = false;
    $("dashboard").hidden = true;
});

(async () => {
    const { data } = await db.auth.getSession();

    if (data.session) {
        $("loginBox").hidden = true;
        $("dashboard").hidden = false;
        await loadSettings();
        await loadProducts();
    }
})();
