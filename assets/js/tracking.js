// Odryss — Analytics & Event Tracking

// Scroll depth tracking
(function () {
    var depths = [25, 50, 75, 100];
    var fired = {};

    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        var pct = Math.round((scrollTop / docHeight) * 100);

        depths.forEach(function (d) {
            if (pct >= d && !fired[d]) {
                fired[d] = true;
                gtag('event', 'scroll_depth', { depth_percent: d });
            }
        });
    }, { passive: true });
})();

// CTA button click tracking (handles all pages)
document.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;

    var text = btn.textContent.trim();

    var labels = {
        'View Product':       'view_product',
        'Our Mission':        'our_mission',
        'Technical Specs':    'technical_specs',
        'See the Technology': 'see_technology',
        'Send Message':       'contact_send_message'
    };

    if (labels[text]) {
        gtag('event', 'cta_click', { button: labels[text], page: window.location.pathname });
    }
});

// Nav "Contact Us" click (nav loaded dynamically — use delegation)
document.addEventListener('click', function (e) {
    var a = e.target.closest('a.nav-cta');
    if (a) {
        gtag('event', 'nav_contact_click', { page: window.location.pathname });
    }
});

// Contact form submission tracking
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('main-contact-form');
    if (!form) return;

    form.addEventListener('submit', function () {
        var subject = document.getElementById('subject');
        gtag('event', 'contact_form_submit', {
            subject: subject ? subject.value : 'unknown'
        });
    });
});
