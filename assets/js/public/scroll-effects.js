(function initScrollEffects() {
    const revealElements = document.querySelectorAll(".reveal");
    const progressBar = document.getElementById("scrollProgress");
    const backToTop = document.getElementById("backToTop");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }

    function updateScrollUI() {
        const documentElement = document.documentElement;
        const scrollTop = window.scrollY;
        const scrollHeight =
            documentElement.scrollHeight - documentElement.clientHeight;

        const percentage = scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (backToTop) {
            backToTop.classList.toggle("visible", scrollTop > 450);
        }
    }

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    window.addEventListener("scroll", updateScrollUI, {
        passive: true
    });

    window.addEventListener("resize", updateScrollUI);

    updateScrollUI();
})();