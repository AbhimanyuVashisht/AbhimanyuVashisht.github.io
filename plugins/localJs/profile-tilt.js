// Profile photo — 3D tilt + sheen on mousemove
// Exposed as window.initProfileTilt() so the SPA router can call it
// each time the home view is inserted into the DOM.

function initProfileTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var visual = document.querySelector('.profile-visual');
    var outer  = document.querySelector('.profile-ring-outer');
    var sheen  = document.querySelector('.profile-sheen');
    if (!visual || !outer || !sheen) return;

    var MAX_TILT_X = 10;
    var MAX_TILT_Y = 14;
    var LERP_SPEED = 0.10;

    var targetX = 0, targetY = 0;
    var currentX = 0, currentY = 0;
    var rafId = null;
    var hovering = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        currentX = lerp(currentX, targetX, LERP_SPEED);
        currentY = lerp(currentY, targetY, LERP_SPEED);

        outer.style.transform =
            'perspective(700px) rotateX(' + currentX.toFixed(3) + 'deg) rotateY(' + currentY.toFixed(3) + 'deg)';

        var settled =
            Math.abs(currentX - targetX) < 0.02 &&
            Math.abs(currentY - targetY) < 0.02;

        if (!settled) {
            rafId = requestAnimationFrame(tick);
        } else {
            if (!hovering) outer.style.transform = '';
            rafId = null;
        }
    }

    function startTick() {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    visual.addEventListener('mousemove', function (e) {
        var rect = outer.getBoundingClientRect();
        var cx = rect.left + rect.width  / 2;
        var cy = rect.top  + rect.height / 2;
        var nx = (e.clientX - cx) / (rect.width  / 2);
        var ny = (e.clientY - cy) / (rect.height / 2);

        targetY =  nx * MAX_TILT_Y;
        targetX = -ny * MAX_TILT_X;

        sheen.style.setProperty('--sx', ((-nx + 1) / 2 * 100).toFixed(1) + '%');
        sheen.style.setProperty('--sy', ((-ny + 1) / 2 * 100).toFixed(1) + '%');
        sheen.style.opacity = '1';

        hovering = true;
        startTick();
    });

    visual.addEventListener('mouseleave', function () {
        targetX = 0;
        targetY = 0;
        hovering = false;
        sheen.style.opacity = '0';
        startTick();
    });
}

// Also run on first page load (when router hasn't started yet)
document.addEventListener('DOMContentLoaded', initProfileTilt);
