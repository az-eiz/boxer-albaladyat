
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

        /* ---------- Animated Counters ---------- */
        (function initCounters() {
            var counters = document.querySelectorAll('.stat-number[data-target]');
            if (!counters.length) return;
            var started = false;
            function animateCounter(el) {
                var target = parseInt(el.getAttribute('data-target'), 10);
                if (isNaN(target)) return;
                var duration = 2000;
                var start = null;
                function step(ts) {
                    if (!start) start = ts;
                    var progress = Math.min((ts - start) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target).toLocaleString('ar-EG');
                    if (progress < 1) requestAnimationFrame(step);
                    else el.textContent = target.toLocaleString('ar-EG');
                }
                requestAnimationFrame(step);
            }
            function check() {
                if (started) return;
                var rect = counters[0].getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    started = true;
                    counters.forEach(animateCounter);
                }
            }
            window.addEventListener('scroll', check);
            window.addEventListener('load', check);
        })();

        /* ---------- Gallery Filter ---------- */
        (function initGalleryFilter() {
            var filterBtns = document.querySelectorAll('.gallery-tab');
            var galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

            window.filterGallery = function (category) {
                filterBtns.forEach(function (btn) {
                    btn.classList.toggle(
                        'active',
                        btn.getAttribute('data-filter') === category
                    );
                });

                galleryItems.forEach(function (item) {
                    item.style.display =
                        category === 'all' ||
                            item.getAttribute('data-category') === category
                            ? ''
                            : 'none';
                });
            };
        })();

        /* ---------- Live Baghdad Clock + Shop Open/Closed Status ---------- */
        (function initLiveClock() {
            var timeEl = document.getElementById('liveTime');
            var statusBadge = document.getElementById('shopStatus');
            var statusText = document.getElementById('statusText');
            if (!timeEl || !statusBadge || !statusText) return;
            function pad(n) { return n < 10 ? '0' + n : '' + n; }
            function isOpen(d, h24, m) {
                var mins = h24 * 60 + m;
                if (d === 5) {
                    return mins >= 14 * 60 && mins < 21 * 60;
                } else {
                    return mins >= 8 * 60 && mins < 21 * 60;
                }
            }
            function tick() {
                var now = new Date();
                var baghdad = new Date(now.getTime() + (3 * 60 * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000));
                var h = baghdad.getHours(), m = baghdad.getMinutes(), s = baghdad.getSeconds();
                var day = baghdad.getDay();
                timeEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
                var open = isOpen(day, h, m);
                if (open) {
                    statusBadge.classList.remove('closed');
                    statusBadge.classList.add('open');
                    statusText.textContent = 'مفتوح الآن';
                } else {
                    statusBadge.classList.remove('open');
                    statusBadge.classList.add('closed');
                    statusText.textContent = 'مغلق حالياً';
                }
            }
            tick();
            setInterval(tick, 1000);
        })();

        /* ---------- Weekend Promo Countdown Timer ---------- */
        (function initPromoCountdown() {
            var cdDays = document.getElementById('cd-days');
            var cdHours = document.getElementById('cd-hours');
            var cdMins = document.getElementById('cd-mins');
            var cdSecs = document.getElementById('cd-secs');
            if (!cdDays || !cdHours || !cdMins || !cdSecs) return;
            function pad(n) { return n < 10 ? '0' + n : '' + n; }
            function getTarget() {
                var now = new Date();
                var baghdadOffset = 3 * 60;
                var localOffset = -now.getTimezoneOffset();
                var diff = baghdadOffset - localOffset;
                var bgNow = new Date(now.getTime() + diff * 60 * 1000);
                var day = bgNow.getDay();
                var untilNextThu = (4 - day + 7) % 7;
                if (untilNextThu === 0 && bgNow.getHours() * 60 + bgNow.getMinutes() >= 23 * 60 + 59) {
                    untilNextThu = 7;
                }
                var target = new Date(bgNow);
                target.setDate(bgNow.getDate() + untilNextThu);
                target.setHours(23, 59, 59, 999);
                return new Date(target.getTime() - diff * 60 * 1000);
            }
            var target = getTarget();
            function tick() {
                var now = Date.now();
                var diff = target.getTime() - now;
                if (diff <= 0) { target = getTarget(); diff = target.getTime() - now; }
                var d = Math.floor(diff / 86400000);
                var h = Math.floor((diff % 86400000) / 3600000);
                var m = Math.floor((diff % 3600000) / 60000);
                var s = Math.floor((diff % 60000) / 1000);
                cdDays.textContent = pad(d);
                cdHours.textContent = pad(h);
                cdMins.textContent = pad(m);
                cdSecs.textContent = pad(s);
            }
            tick();
            setInterval(tick, 1000);
        })();

        /* ---------- Testimonials Carousel ---------- */
        (function initCarousel() {
            var track = document.querySelector('.carousel-track');
            var prevBtn = document.getElementById('carouselPrev');
            var nextBtn = document.getElementById('carouselNext');
            var dotsContainer = document.getElementById('carouselDots');
            if (!track) return;
            var slides = track.querySelectorAll('.carousel-slide');
            var total = slides.length;
            var current = 0;
            var dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
            function goTo(n) {
                current = (n + total) % total;
                track.style.transform = 'translateX(' + (-100 * current) + '%)';
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('active', i === current);
                });
            }
            if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
            if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () { goTo(i); resetAuto(); });
            });
            var timer = setInterval(function () { goTo(current + 1); }, 6000);
            function resetAuto() { clearInterval(timer); timer = setInterval(function () { goTo(current + 1); }, 6000); }
            if (track) {
                track.addEventListener('mouseenter', function () { clearInterval(timer); });
                track.addEventListener('mouseleave', function () { timer = setInterval(function () { goTo(current + 1); }, 6000); });
            }
        })();

        /* ---------- FAQ Accordion ---------- */
        (function initFAQ() {
            var faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(function (item) {
                var q = item.querySelector('.faq-question');
                var a = item.querySelector('.faq-answer');
                if (!q || !a) return;
                q.addEventListener('click', function () {
                    var isOpen = item.classList.contains('active');
                    faqItems.forEach(function (other) {
                        other.classList.remove('active');
                        var oa = other.querySelector('.faq-answer');
                        if (oa) oa.style.maxHeight = null;
                    });
                    if (!isOpen) {
                        item.classList.add('active');
                        a.style.maxHeight = a.scrollHeight + 40 + 'px';
                    }
                });
            });
        })();

        /* ---------- Scroll Progress + Back-to-Top + Nav Scrollspy ---------- */
        (function initScrollFeatures() {
            var progress = document.getElementById('scrollProgress');
            var backBtn = document.getElementById('backToTop');
            var navLinks = document.querySelectorAll('#navLinks a[href^="#"]');
            var mobileItems = document.querySelectorAll('.mobile-nav-item[data-section]');
            var sectionIds = ['home', 'services', 'products', 'work', 'testimonials', 'contact'];
            if (backBtn) {
                backBtn.addEventListener('click', function () {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
            function update() {
                var doc = document.documentElement;
                var scrolled = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
                var height = doc.scrollHeight - doc.clientHeight;
                var pct = height > 0 ? (scrolled / height) * 100 : 0;
                if (progress) progress.style.width = pct + '%';
                if (backBtn) {
                    if (scrolled > 450) backBtn.classList.add('visible');
                    else backBtn.classList.remove('visible');
                }
                var activeId = 'home';
                for (var i = sectionIds.length - 1; i >= 0; i--) {
                    var sec = document.getElementById(sectionIds[i]);
                    if (sec) {
                        var rect = sec.getBoundingClientRect();
                        if (rect.top <= 150) { activeId = sectionIds[i]; break; }
                    }
                }
                navLinks.forEach(function (a) {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + activeId);
                });
                mobileItems.forEach(function (item) {
                    item.classList.toggle('active', item.getAttribute('data-section') === activeId);
                });
            }
            window.addEventListener('scroll', update, { passive: true });
            window.addEventListener('resize', update);
            window.addEventListener('load', update);
            update();
        })();

        /* ---------- Contact Form → WhatsApp Redirect ---------- */
        (function initContactForm() {
            var form = document.getElementById('contactForm');
            if (!form) return;
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var name = document.getElementById('customerName').value.trim();
                var phone = document.getElementById('customerPhone').value.trim();
                var gov = document.getElementById('customerGovernorate').value;
                var svc = document.getElementById('serviceType').value;
                var msg = document.getElementById('customerMessage').value.trim();

                if (!name || !phone || !gov || !svc) {
                    alert('الرجاء ملء جميع الحقول المطلوبة (الاسم، الهاتف، المحافظة، نوع الخدمة).');
                    return;
                }

                var lines = [];
                lines.push('*📋 طلب جديد من موقع Boxer Albaladyat*');
                lines.push('');
                lines.push('*👤 الاسم:* ' + name);
                lines.push('*📞 الهاتف:* ' + phone);
                lines.push('*📍 المحافظة:* ' + gov);
                lines.push('*🛠️ نوع الخدمة:* ' + svc);
                if (msg) lines.push('*📝 التفاصيل:* ' + msg);
                lines.push('');
                lines.push('تم الإرسال من نموذج التواصل في الموقع.');

                var text = lines.join('%0A');
                var url = 'https://wa.me/9647713733002?text=' + text;
                window.open(url, '_blank', 'noopener');
            });
        })();

        /* ---------- Initial Log ---------- */
        console.log('%c🚀 Boxer Albaladyat Site Loaded!', 'background:#ff6b00;color:#fff;padding:6px 12px;border-radius:6px;font-weight:bold;');
        console.log('%cجميع الميزات الديناميكية فعالة بنجاح.', 'color:#22c55e;font-weight:600;');
    
