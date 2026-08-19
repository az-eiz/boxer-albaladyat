(function initContactForm() {
    const submitButton = document.getElementById("contactSubmit");
    const messageEl = document.getElementById("contactFormMessage");

    if (!submitButton) return;

    const fields = {
        name: document.getElementById("customerName"),
        phone: document.getElementById("customerPhone"),
        governorate: document.getElementById("customerGovernorate"),
        serviceType: document.getElementById("serviceType"),
        message: document.getElementById("customerMessage")
    };

    function showMessage(text) {
        if (messageEl) messageEl.textContent = text;
    }

    function validate() {
        if (!fields.name.value.trim() || fields.name.value.trim().length < 2) {
            return "الرجاء إدخال الاسم الكامل";
        }

        if (!/^[0-9\s\-+]{10,15}$/.test(fields.phone.value.trim())) {
            return "الرجاء إدخال رقم هاتف صحيح";
        }

        if (!fields.governorate.value) {
            return "الرجاء اختيار المحافظة";
        }

        if (!fields.serviceType.value) {
            return "الرجاء اختيار نوع الطلب";
        }

        return null;
    }

    submitButton.addEventListener("click", () => {
        const error = validate();

        if (error) {
            showMessage(error);
            return;
        }

        showMessage("");

        const lines = [
            "مرحباً، أريد تقديم طلب جديد:",
            `الاسم: ${fields.name.value.trim()}`,
            `الهاتف: ${fields.phone.value.trim()}`,
            `المحافظة: ${fields.governorate.value}`,
            `نوع الطلب: ${fields.serviceType.value}`
        ];

        if (fields.message.value.trim()) {
            lines.push(`التفاصيل: ${fields.message.value.trim()}`);
        }

        const whatsappUrl = `https://wa.me/9647713733002?text=${encodeURIComponent(lines.join("\n"))}`;

        window.open(whatsappUrl, "_blank", "noopener");
    });
})();
