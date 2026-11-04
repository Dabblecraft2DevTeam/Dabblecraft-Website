/*
 * Starfield background — animated connected-dots canvas.
 * Usage: give a page a <canvas id="starfield-canvas"></canvas> and include
 * this script. The canvas is fixed, full-viewport, and sits behind page
 * content (z-index -1) via the #starfield-canvas CSS rule.
 */
(function () {
    var canvas = document.getElementById("starfield-canvas");
    if (!canvas) { return; }

    var ctx = canvas.getContext("2d");
    var FPS = 60;
    var STAR_COUNT = 100;
    var LINK_DISTANCE = 150;
    var MOUSE_LINK_DISTANCE = 150;

    var stars = [];
    var mouse = { x: 0, y: 0 };

    var reducedMotion = false;
    try {
        reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) { /* older browsers */ }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function spawnStars() {
        stars = [];
        for (var i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1 + 1,
                vx: Math.floor(Math.random() * 50) - 25,
                vy: Math.floor(Math.random() * 50) - 25
            });
        }
    }

    function distance(point1, point2) {
        var xs = (point2.x - point1.x);
        var ys = (point2.y - point1.y);
        return Math.sqrt(xs * xs + ys * ys);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "lighter";

        var i, j, s;

        for (i = 0; i < stars.length; i++) {
            s = stars[i];
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.beginPath();
        for (i = 0; i < stars.length; i++) {
            var starI = stars[i];
            ctx.moveTo(starI.x, starI.y);
            if (distance(mouse, starI) < MOUSE_LINK_DISTANCE) {
                ctx.lineTo(mouse.x, mouse.y);
            }
            for (j = i + 1; j < stars.length; j++) {
                var starII = stars[j];
                if (distance(starI, starII) < LINK_DISTANCE) {
                    ctx.lineTo(starII.x, starII.y);
                }
            }
        }
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    function update() {
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.x += s.vx / FPS;
            s.y += s.vy / FPS;
            if (s.x < 0 || s.x > canvas.width) { s.vx = -s.vx; }
            if (s.y < 0 || s.y > canvas.height) { s.vy = -s.vy; }
        }
    }

    var lastTick = 0;
    function tick(timestamp) {
        // Cap to ~60fps and skip frames if the tab can't keep up
        if (timestamp - lastTick >= 1000 / FPS) {
            lastTick = timestamp;
            draw();
            update();
        }
        requestAnimationFrame(tick);
    }

    canvas.addEventListener("mousemove", function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    canvas.addEventListener("mouseleave", function () {
        mouse.x = 0;
        mouse.y = 0;
    });

    window.addEventListener("resize", function () {
        resize();
        spawnStars();
    });

    // Pause when the tab is hidden (rAF already throttles, but this
    // avoids stale mouse positions on return)
    document.addEventListener("visibilitychange", function () {
        mouse.x = 0;
        mouse.y = 0;
    });

    resize();
    spawnStars();

    if (reducedMotion) {
        draw(); // static single frame for users who prefer reduced motion
    } else {
        requestAnimationFrame(tick);
    }
})();