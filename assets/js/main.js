/* =====================================================
           Boxer Albaladyat - Full Dynamic Script
           ===================================================== */

/* ---------- Utility: Smooth Scroll for Anchor Links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href.length <= 1) return;
        var target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            var offset = (window.innerWidth <= 768) ? 70 : 90;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    });
});

/* ---------- Scroll Reveal Animation (IntersectionObserver) ---------- */
(function initRevealObserver() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
})();

