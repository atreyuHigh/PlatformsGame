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
    prevY: 0,
    facing: "right",   // <-- NEW
    standingOn: null
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
    if (keys["ArrowLeft"] || keys["a"]) {
        player.vx = -player.speed;
        player.facing = "left";
    } else if (keys["ArrowRight"] || keys["d"]) {
        player.vx = player.speed;
        player.facing = "right";
    } else {
        player.vx = 0;
    }

    if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && player.onGround) {
        player.vy = -player.jumpForce;
        player.onGround = false;
        player.standingOn = null;
    }

    player.vy += gravity;

    // ---- X movement ----
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
            if (player.vy > 15) gameOver = true;
            player.y = s.y - player.height;
            player.vy = 0;
            player.onGround = true;
        } else if (hit(player, s) && player.vy < 0) {
            player.y = s.y + s.height;
            player.vy = 0;
        }
    });

    level.mobile_platforms.forEach(p => {
        if (
            hit(player, p) &&
            player.prevY + player.height <= p.y &&
            player.vy > 0
        ) {
            if (player.vy > 15) gameOver = true;
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
            player.standingOn = p;
        }
    });

    level.platforms.forEach(p => {
        if (
            hit(player, p) &&
            player.prevY + player.height <= p.y &&
            player.vy >= 0
        ) {
            if (player.vy > 15) gameOver = true;
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    });

    level.enemies.forEach(e => {
        if (hit(player, e)) gameOver = true;
    });

    // Move with mobile platform
    if (player.onGround && player.standingOn) {
        const p = player.standingOn;
        const prev = p.prevX ?? p.x;
        const dx = p.x - prev;

        player.x += dx;

        level.solids.forEach(s => {
            if (hit(player, s)) {
                if (dx > 0) player.x = s.x - player.width;
                else player.x = s.x + s.width;
            }
        });

        player.x = Math.max(0, Math.min(level.worldWidth - player.width, player.x));

        if (Math.abs((player.y + player.height) - p.y) > 0.5) {
            player.standingOn = null;
        }
    } else {
        player.standingOn = null;
    }
}

// ======================
// ENEMIES
// ======================
function updateEnemies() {
    level.enemies.forEach(e => {
        e.x += e.speed * e.dir;

        level.solids.forEach(s => {
            if (hit(e, s)) {
                e.dir *= -1;
            }
        });

        if (e.x < 0 || e.x + e.width > level.worldWidth) {
            e.dir *= -1;
        }
    });
}

// ======================
// MOBILE PLATFORMS
// ======================
function updateMobilePlatforms() {
    level.mobile_platforms.forEach(p => {
        p.prevX = p.x;
        p.x += p.speed * p.dir;

        level.solids.forEach(s => {
            if (hit(p, s)) {
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
// DRAW PLAYER (NEW)
// ======================
function drawPlayer() {
    const px = player.x - camera.x;
    const py = player.y - camera.y;

    // Body
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(px, py, player.width, player.height);

    // Head stripe (red)
    const headHeight = player.height * 0.25;
    ctx.fillStyle = "red";
    ctx.fillRect(px, py, player.width, headHeight);

    // Mouth (black)
    const mouthY = py + headHeight * 1.6;
    const mouthHeight = 3;
    const half = player.width / 2;

    ctx.fillStyle = "black";
    if (player.facing === "right") {
        ctx.fillRect(px + half, mouthY, half - 2, mouthHeight);
    } else {
        ctx.fillRect(px + 2, mouthY, half - 2, mouthHeight);
    }
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

    ctx.fillStyle = "#008B8B";
    level.mobile_platforms.forEach(p =>
        ctx.fillRect(p.x - camera.x, p.y - camera.y, p.width, p.height)
    );

    ctx.fillStyle = "red";
    level.enemies.forEach(e =>
        ctx.fillRect(e.x - camera.x, e.y - camera.y, e.width, e.height)
    );

    drawPlayer();
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
