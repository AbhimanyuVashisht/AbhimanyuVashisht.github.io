document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar-themed');
    // On page-fill pages the body is locked; scroll lives inside <main>
    const scrollSource = document.body.classList.contains('page-fill')
        ? document.querySelector('main')
        : window;

    function toggleNavbarTransparency() {
        const scrollY = document.body.classList.contains('page-fill')
            ? document.querySelector('main').scrollTop
            : window.scrollY;
        if (scrollY > 50) {
            navbar.classList.remove('navbar-transparent');
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.add('navbar-transparent');
            navbar.classList.remove('navbar-scrolled');
        }
    }

    toggleNavbarTransparency();
    scrollSource.addEventListener('scroll', toggleNavbarTransparency);
});
