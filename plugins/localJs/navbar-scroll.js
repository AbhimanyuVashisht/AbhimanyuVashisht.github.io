document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar-themed');

    function toggleNavbarTransparency() {
        if (window.scrollY > 50) {
            navbar.classList.remove('navbar-transparent');
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.add('navbar-transparent');
            navbar.classList.remove('navbar-scrolled');
        }
    }

    // Initially set the navbar transparency
    toggleNavbarTransparency();

    // Add scroll listener
    window.addEventListener('scroll', toggleNavbarTransparency);
});
