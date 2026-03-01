// Navbar transparency on scroll — SPA-aware, rebindable by router
(function () {
    var _scrollSource = null;
    var _handler = null;

    function toggleNavbar() {
        var navbar = document.querySelector('.navbar-themed');
        if (!navbar) return;
        // page-fill: CSS keeps navbar always opaque — no JS needed
        if (document.body.classList.contains('page-fill')) return;
        if (window.scrollY > 50) {
            navbar.classList.remove('navbar-transparent');
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.add('navbar-transparent');
            navbar.classList.remove('navbar-scrolled');
        }
    }

    function rebindNavbarScroll() {
        // Detach previous listener
        if (_scrollSource && _handler) {
            _scrollSource.removeEventListener('scroll', _handler);
            _scrollSource = null;
            _handler = null;
        }
        // page-fill: navbar opacity handled by CSS only, nothing to bind
        if (document.body.classList.contains('page-fill')) return;

        _scrollSource = window;
        _handler = toggleNavbar;
        window.addEventListener('scroll', _handler, { passive: true });
        toggleNavbar();
    }

    // Expose so router.js can call after every navigation
    window.rebindNavbarScroll = rebindNavbarScroll;

    document.addEventListener('DOMContentLoaded', rebindNavbarScroll);
}());
