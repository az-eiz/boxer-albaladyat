async function loadSettings() {
    const { data, error } = await window.db
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
    $("locationName").value = settings.locationName || "بوكسر البلديات، بغداد";
    $("mapUrl").value =
        settings.mapUrl ||
        "https://maps.app.goo.gl/BCq1bYCt6n1ikpqB7";
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

    const { error } = await window.db.from("site_settings").upsert(
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

function wireSettings() {
    $("saveButton").addEventListener("click", saveSettings);
}
