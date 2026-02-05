const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ======================
// PLAYER
// ======================
const player = {
    x: 100,
    y: 1100 - 32,
    width: 24,
    height: 32,
    vx: 0,
    vy: 0,
    speed: 4,
    jumpForce: 12,
    onGround: false,
    prevY: 0
};

const gravity = 0.5;
const keys = {};
let gameOver = false;

// ======================
// INPUT
// ======================
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ======================
// LEVEL
// ======================
// `groundY` and `level` are loaded from level.js

// ======================
// CAMERA
// ======================
const camera = { x: 0, y: 0 };

// ======================
// COLLISION
// ======================
function hit(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// ======================
// PLAYER UPDATE
// ======================
function updatePlayer() {
    player.prevY = player.y;

    // Input
    if (keys["ArrowLeft"] || keys["a"]) player.vx = -player.speed;
    else if (keys["ArrowRight"] || keys["d"]) player.vx = player.speed;
    else player.vx = 0;

    if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && player.onGround) {
        player.vy = -player.jumpForce;
        player.onGround = false;
    }

    player.vy += gravity;

    // ---- X movement + SOLID collision ----
    player.x += player.vx;

    level.solids.forEach(s => {
        if (hit(player, s)) {
            if (player.vx > 0) player.x = s.x - player.width;
            if (player.vx < 0) player.x = s.x + s.width;
        }
    });

    player.x = Math.max(0, Math.min(level.worldWidth - player.width, player.x));

    // ---- Y movement ----
    player.y += player.vy;
    player.onGround = false;

    level.solids.forEach(s => {
        if (hit(player, s) && player.vy > 0) {
            player.y = s.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
        // Optional: Handle head bumping into solids
        else if (hit(player, s) && player.vy < 0) {
            player.y = s.y + s.height;
            player.vy = 0;
        }
    });
    //collision with mobile platforms (only when falling and above the platform)
    level.mobile_platforms.forEach(p => {
        if (
            hit(player, p) &&
            player.prevY + player.height <= p.y &&
            player.vy > 0
        ) {
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    });

    level.platforms.forEach(p => {
        if (
            hit(player, p) &&
            player.prevY + player.height <= p.y &&
            player.vy >= 0
        ) {
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    });

    level.enemies.forEach(e => {
        if (hit(player, e)) gameOver = true;
    });
}

// ======================
// ENEMIES UPDATE
// ======================
function updateEnemies() {
    level.enemies.forEach(e => {
        e.x += e.speed * e.dir;

        level.solids.forEach(s => {
            if (hit(e, s)) {
                if (e.dir > 0) e.x = s.x - e.width;
                else e.x = s.x + s.width;
                e.dir *= -1;
            }
        });

        if (e.x < 0 || e.x + e.width > level.worldWidth) {
            e.dir *= -1;
        }
    });
}
function updateMobilePlatforms() {
    level.mobile_platforms.forEach(p => {
        p.x += p.speed * p.dir;

        level.solids.forEach(s => {
            if (hit(p, s)) {
                if (p.dir > 0) p.x = s.x - p.width;
                else p.x = s.x + s.width;
                p.dir *= -1;
            }
        });

        if (p.x < 0 || p.x + p.width > level.worldWidth) {
            p.dir *= -1;
        }
    });
}

// ======================
// CAMERA
// ======================
function updateCamera() {
    camera.x = player.x + player.width / 2 - canvas.width / 2;
    camera.y = player.y + player.height / 2 - canvas.height / 2;

    camera.x = Math.max(0, Math.min(level.worldWidth - canvas.width, camera.x));
    camera.y = Math.max(0, Math.min(level.worldHeight - canvas.height, camera.y));
}

// ======================
// DRAW
// ======================
function draw() {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#3b7a1e";
    level.solids.forEach(s =>
        ctx.fillRect(s.x - camera.x, s.y - camera.y, s.width, s.height)
    );

    ctx.fillStyle = "#654321";
    level.platforms.forEach(p =>
        ctx.fillRect(p.x - camera.x, p.y - camera.y, p.width, p.height)
    );

    // draw mobile platforms
    ctx.fillStyle = "#008B8B";
    if (level.mobile_platforms) {
        level.mobile_platforms.forEach(p =>
            ctx.fillRect(p.x - camera.x, p.y - camera.y, p.width, p.height)
        );
    }

    ctx.fillStyle = "red";
    level.enemies.forEach(e =>
        ctx.fillRect(e.x - camera.x, e.y - camera.y, e.width, e.height)
    );

    ctx.fillStyle = "#FFD700";
    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        player.width,
        player.height
    );
}

// ======================
// LOOP
// ======================
function loop() {
    if (!gameOver) {
        updateMobilePlatforms();
        updatePlayer();
        updateEnemies();
        updateCamera();
    }
    draw();
    requestAnimationFrame(loop);
}

loop();
