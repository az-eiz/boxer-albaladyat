const $ = id => document.getElementById(id);

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function uploadImage(file, folder = "products") {
    const extension = file.name.split(".").pop().toLowerCase();
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } = await window.db.storage
        .from("site-images")
        .upload(path, file);

    if (error) throw error;

    const { data } = window.db.storage
        .from("site-images")
        .getPublicUrl(path);

    return data.publicUrl;
}
