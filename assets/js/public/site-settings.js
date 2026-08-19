(async function initSiteSettings() {
    if (!window.db) return;

    const { data, error } = await window.db
        .from("site_settings")
        .select("value")
        .eq("key", "main")
        .maybeSingle();

    if (error || !data?.value) return;

    const settings = data.value;

    if (settings.title) {
        const titleEl = document.getElementById("siteTitleText");
        if (titleEl) titleEl.textContent = settings.title;
        document.title = settings.title;
    }

    if (settings.heroText) {
        const heroEl = document.getElementById("heroDescriptionText");
        if (heroEl) heroEl.textContent = settings.heroText;
    }

    if (settings.hours) {
        const hoursEl = document.getElementById("heroHoursText");
        if (hoursEl) hoursEl.textContent = settings.hours;
    }

    if (settings.locationName) {
        const deliveryBadge = document.getElementById("deliveryLocationBadge");
        if (deliveryBadge) deliveryBadge.textContent = settings.locationName;

        const contactAddress = document.getElementById("contactAddressText");
        if (contactAddress) contactAddress.textContent = settings.locationName;
    }

    if (settings.mapUrl) {
        const deliveryMapLink = document.getElementById("deliveryMapLink");
        if (deliveryMapLink) deliveryMapLink.href = settings.mapUrl;

        const contactMapLink = document.getElementById("contactMapLink");
        if (contactMapLink) contactMapLink.href = settings.mapUrl;
    }
})();
