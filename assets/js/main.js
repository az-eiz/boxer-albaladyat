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
const publicDb = window.supabase.createClient(
    "https://umqezfgbfznnhiqzkcfx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtcWV6ZmdiZnpubmhpcXprY2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwOTY2NzMsImV4cCI6MjEwMjY3MjY3M30.v-kBl4vXDGHa2xDO4Q3N5LD6ffp55nUtFJv3b_poqJk"
);

async function renderProducts() { /* ...existing renderProducts implementation... */ }
async function renderServices() { /* ...existing renderServices implementation... */ }

renderProducts();
renderServices();

publicDb
    .channel("website-updates")
    .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => renderProducts())
    .on("postgres_changes", { event: "*", schema: "public", table: "services" }, () => renderServices())
    .subscribe();

    
/* ---------- FAQ Section ---------- */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', function () {
        const isOpen = item.classList.contains('active');

        faqItems.forEach(function (other) {
            other.classList.remove('active');

            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) {
                otherAnswer.style.maxHeight = null;
            }
        });

        if (!isOpen) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        }
    });

    if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
    }
});

const sectionIds = ['home', 'services', 'products', 'gallery', 'faq', 'contact'];

