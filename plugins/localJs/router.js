// =============================================================
// router.js — vanilla SPA client-side router for GitHub Pages
// =============================================================

var IS_FILE_PROTOCOL = window.location.protocol === 'file:';

function normalisePath(path) {
    var resolved = (path || '').trim();
    resolved = resolved.replace(/^\.\//, '').replace(/\.html$/, '');
    if (resolved === '' || resolved === 'index') return '/';
    if (resolved.charAt(0) !== '/') resolved = '/' + resolved;
    return resolved;
}

function getCurrentPath() {
    if (IS_FILE_PROTOCOL) {
        var hash = window.location.hash || '';
        if (hash.indexOf('#/') === 0) return normalisePath(hash.slice(1));
        return '/';
    }
    return normalisePath(window.location.pathname);
}

function updateUrl(path, title, push) {
    if (!push) return;
    if (IS_FILE_PROTOCOL) {
        var nextHash = path === '/' ? '' : '#' + path;
        if (window.location.hash !== nextHash) {
            window.location.hash = nextHash;
        }
        return;
    }
    window.history.pushState({ path: path }, title, path);
}

// --- Step 1: GitHub Pages 404 redirect fix ---
// When GH Pages serves 404.html for /about, the 404.html encodes
// the path as /?/about and redirects. Here we decode it back.
(function () {
    var qs = window.location.search;
    if (qs[1] === '/') {
        var parts = qs.slice(1).split('&').map(function (s) {
            return s.replace(/~and~/g, '&');
        });
        window.history.replaceState(
            null, null,
            parts.shift() + (parts.length ? '?' + parts.join('&') : '') + window.location.hash
        );
    }
}());

// --- Step 2: Route table ---
var ROUTES = {
    '/': {
        title:      'Abhimanyu Vashisht',
        bodyClass:  'page-hero',
        templateId: 'view-home',
        desc:       'Abhimanyu Vashisht - Lead Software Engineer, Full-Stack Developer, and AI Enthusiast.',
        onEnter:    function () { initHomePage(); }
    },
    '/about': {
        title:      'About — Abhimanyu Vashisht',
        bodyClass:  'page-fill',
        templateId: 'view-about',
        desc:       'About Abhimanyu Vashisht — Lead Software Engineer, Full-Stack Developer, and AI Enthusiast.',
        onEnter:    null
    },
    '/work': {
        title:      'Work — Abhimanyu Vashisht',
        bodyClass:  'page-fill',
        templateId: 'view-work',
        desc:       'Work and projects by Abhimanyu Vashisht — Lead Software Engineer at BrowserStack.',
        onEnter:    null
    },
    '/contact': {
        title:      'Contact — Abhimanyu Vashisht',
        bodyClass:  'page-fill',
        templateId: 'view-contact',
        desc:       'Get in touch with Abhimanyu Vashisht — Lead Software Engineer.',
        onEnter:    null
    },
    '/404': {
        title:      '404 — Abhimanyu Vashisht',
        bodyClass:  'page-fill',
        templateId: 'view-404',
        desc:       'The requested page could not be found.',
        onEnter:    null
    }
};

// --- Step 3: Core navigate function ---
function navigate(path, push) {
    var normalised = normalisePath(path);
    var route = ROUTES[normalised] || ROUTES['/404'];
    var canonical = ROUTES[normalised] ? normalised : '/404';

    updateUrl(canonical, route.title, push);

    // Update <title> and meta
    document.title = route.title;
    var metaDesc = document.getElementById('meta-description');
    if (metaDesc) metaDesc.setAttribute('content', route.desc);
    var metaOgUrl = document.getElementById('meta-og-url');
    if (metaOgUrl) metaOgUrl.setAttribute('content', 'https://abhimanyuvashisht.com' + canonical);

    // Swap body class (drives layout + navbar CSS)
    document.body.className = route.bodyClass;

    // Update nav active states
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
        var href = normalisePath(link.getAttribute('href'));
        var active = href === canonical;
        link.classList.toggle('active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // Fade out current content
    var main = document.getElementById('main-content');
    main.style.transition = 'none';
    main.style.opacity    = '0';
    main.style.transform  = 'translateY(10px)';

    setTimeout(function () {
        // Swap template content in
        var tmpl = document.getElementById(route.templateId);
        main.innerHTML = '';
        if (tmpl) main.appendChild(document.importNode(tmpl.content, true));

        // Scroll reset
        window.scrollTo(0, 0);
        main.scrollTop = 0;

        // Re-bind navbar scroll listener for the new body class
        if (typeof window.rebindNavbarScroll === 'function') {
            window.rebindNavbarScroll();
        }

        // Fade in
        requestAnimationFrame(function () {
            main.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            requestAnimationFrame(function () {
                main.style.opacity   = '1';
                main.style.transform = 'translateY(0)';
            });
        });

        // Page-specific init
        if (route.onEnter) route.onEnter();

        // Collapse mobile nav if open
        var navCollapse = document.getElementById('navbarNav');
        if (navCollapse && navCollapse.classList.contains('show')) {
            var toggler = document.querySelector('.navbar-toggler');
            if (toggler) toggler.click();
        }
    }, 140);
}

// --- Step 4: Home page init (typewriter + profile tilt) ---
function initHomePage() {
    var el = document.getElementById('typewriter');
    if (el) {
        var text = 'Engineering Intelligent, Scalable Solutions for Tomorrow';
        var i = 0;
        el.textContent = '';
        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i++);
                setTimeout(type, 40);
            }
        }
        type();
    }
    if (typeof initProfileTilt === 'function') initProfileTilt();
}

// --- Step 5: Intercept all internal link clicks ---
document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href]');
    if (!anchor) return;

    var href = anchor.getAttribute('href');
    if (!href) return;

    // Let the browser handle: external, new-tab, hash-only, special protocols
    if (anchor.target ||
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')) {
        return;
    }

    var path = normalisePath(href);

    e.preventDefault();
    if (path !== getCurrentPath()) {
        navigate(path, true);
    }
});

// --- Step 6: Browser back / forward ---
window.addEventListener('popstate', function () {
    navigate(getCurrentPath(), false);
});

window.addEventListener('hashchange', function () {
    if (!IS_FILE_PROTOCOL) return;
    navigate(getCurrentPath(), false);
});

// --- Step 7: Boot on first load ---
document.addEventListener('DOMContentLoaded', function () {
    navigate(getCurrentPath(), false);
});
