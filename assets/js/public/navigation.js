(function initNavigation() {
    const sectionIds = [
        "home",
        "services",
        "products",
        "gallery",
        "faq",
        "delivery",
        "contact"
    ];

    const desktopLinks = document.querySelectorAll(
        '#navLinks a[href^="#"]'
    );

    const mobileLinks = document.querySelectorAll(
        ".mobile-nav-item[data-section]"
    );

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const selector = link.getAttribute("href");

            if (!selector || selector === "#") return;

            const target = document.querySelector(selector);

            if (!target) return;

            event.preventDefault();

            const offset = window.innerWidth <= 768 ? 70 : 90;
            const top =
                target.getBoundingClientRect().top +
                window.scrollY -
                offset;

            window.scrollTo({
                top,
                behavior: "smooth"
            });
        });
    });

    function updateActiveSection() {
        let activeSection = "home";

        for (let index = sectionIds.length - 1; index >= 0; index--) {
            const section = document.getElementById(sectionIds[index]);

            if (section && section.getBoundingClientRect().top <= 150) {
                activeSection = sectionIds[index];
                break;
            }
        }

        desktopLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${activeSection}`
            );
        });

        mobileLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.section === activeSection
            );
        });
    }

    window.addEventListener("scroll", updateActiveSection, {
        passive: true
    });

    window.addEventListener("resize", updateActiveSection);

    updateActiveSection();
})();