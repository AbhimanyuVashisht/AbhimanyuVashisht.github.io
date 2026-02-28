// Highlight the active nav link based on the current page filename
document.addEventListener('DOMContentLoaded', function () {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href === page) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
});
