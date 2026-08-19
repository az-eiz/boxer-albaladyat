(function initShopClock() {
    const timeElement = document.getElementById("liveTime");
    const statusElement = document.getElementById("shopStatus");
    const statusText = document.getElementById("statusText");

    if (!timeElement && !statusElement && !statusText) return;

    function updateShopClock() {
        const now = new Date();

        const time = new Intl.DateTimeFormat("ar-IQ", {
            timeZone: "Asia/Baghdad",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }).format(now);

        if (timeElement) {
            timeElement.textContent = time;
        }

        const weekday = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Baghdad",
            weekday: "short"
        }).format(now);

        const hour = Number(new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Baghdad",
            hour: "numeric",
            hour12: false
        }).format(now));

        const isFriday = weekday === "Fri";
        const isOpen = isFriday
            ? hour >= 14 && hour < 21
            : hour >= 8 && hour < 21;

        if (statusElement) {
            statusElement.classList.toggle("open", isOpen);
            statusElement.classList.toggle("closed", !isOpen);
        }

        if (statusText) {
            statusText.textContent = isOpen
                ? "مفتوح الآن"
                : "مغلق الآن";
        }
    }

    updateShopClock();
    window.setInterval(updateShopClock, 1000);
})();