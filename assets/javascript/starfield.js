/*
 * Starfield background — animated connected-dots canvas.
 * Usage: give a page a <canvas id="starfield-canvas"></canvas> and include
 * this script. The canvas is fixed, full-viewport, and sits behind page
 * content (z-index -1) via the #starfield-canvas CSS rule.
 *
 * Rendering is devicePixelRatio-aware (crisp on retina/high-DPI), links
 * fade with distance, and the mouse attracts links from anywhere on the
 * page (document-level tracking, so the canvas stays click-through).
 */
(function () {
    var canvas = document.getElementById("starfield-canvas");
    if (!canvas) { return; }

    var ctx = canvas.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var FPS = 60;
    var STAR_COUNT = 110;
    var LINK_DISTANCE = 170;        // px, stars link to each other
    var MOUSE_LINK_DISTANCE = 200;  // px, stars link to the cursor
    var LINK_SQ = LINK_DISTANCE * LINK_DISTANCE;
    var MOUSE_SQ = MOUSE_LINK_DISTANCE * MOUSE_LINK_DISTANCE;

    var stars = [];
    var mouse = { x: 0, y: 0, active: false };

    var reducedMotion = false;
    try {
        reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) { /* older browsers */ }

    /* ── geometry ─────────────────────────────────────────────────── */

    function cssWidth() { return window.innerWidth; }
    function cssHeight() { return window.innerHeight; }

    function resize() {
        // Backing store at native device resolution, drawing in CSS pixels.
        canvas.width = Math.max(1, Math.floor(cssWidth() * DPR));
        canvas.height = Math.max(1, Math.floor(cssHeight() * DPR));
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function spawnStars() {
        stars = [];
        for (var i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * cssWidth(),
                y: Math.random() * cssHeight(),
                radius: Math.random() * 1.2 + 0.6,
                vx: Math.floor(Math.random() * 50) - 25,
                vy: Math.floor(Math.random() * 50) - 25,
                tw: Math.random() * Math.PI * 2   // twinkle phase
            });
        }
    }

    /* ── drawing ──────────────────────────────────────────────────── */

    function draw() {
        var w = cssWidth(), h = cssHeight();
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";

        var i, j, s, s2, dx, dy, distSq, alpha;

        // Stars: soft white dots, subtle twinkle, no stroke.
        for (i = 0; i < stars.length; i++) {
            s = stars[i];
            var twinkle = 0.65 + 0.35 * Math.sin(s.tw);
            ctx.globalAlpha = twinkle;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.lineWidth = 0.75;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#ffffff";

        // Star-to-star links: opacity fades with distance.
        for (i = 0; i < stars.length; i++) {
            s = stars[i];
            for (j = i + 1; j < stars.length; j++) {
                s2 = stars[j];
                dx = s2.x - s.x;
                dy = s2.y - s.y;
                distSq = dx * dx + dy * dy;
                if (distSq < LINK_SQ) {
                    alpha = 1 - Math.sqrt(distSq) / LINK_DISTANCE;
                    ctx.globalAlpha = alpha * 0.45;
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(s2.x, s2.y);
                    ctx.stroke();
                }
            }
        }

        // Mouse links: brighter, cursor-anchored constellation.
        if (mouse.active) {
            for (i = 0; i < stars.length; i++) {
                s = stars[i];
                dx = mouse.x - s.x;
                dy = mouse.y - s.y;
                distSq = dx * dx + dy * dy;
                if (distSq < MOUSE_SQ) {
                    alpha = 1 - Math.sqrt(distSq) / MOUSE_LINK_DISTANCE;
                    ctx.globalAlpha = alpha * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
    }

    function update() {
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.x += s.vx / FPS;
            s.y += s.vy / FPS;
            s.tw += 0.02;
            if (s.x < 0 || s.x > cssWidth()) { s.vx = -s.vx; }
            if (s.y < 0 || s.y > cssHeight()) { s.vy = -s.vy; }
        }
    }

    var lastTick = 0;
    function tick(timestamp) {
        if (timestamp - lastTick >= 1000 / FPS) {
            lastTick = timestamp;
            draw();
            update();
        }
        requestAnimationFrame(tick);
    }

    /* ── input: document-level so the canvas stays click-through ──── */

    document.addEventListener("mousemove", function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    document.addEventListener("mouseleave", function () {
        mouse.active = false;
    });

    window.addEventListener("resize", function () {
        resize();
        spawnStars();
    });

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) { mouse.active = false; }
    });

    resize();
    spawnStars();

    if (reducedMotion) {
        draw(); // static single frame for users who prefer reduced motion
    } else {
        requestAnimationFrame(tick);
    }
})();