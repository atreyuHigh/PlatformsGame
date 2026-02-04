// ===============================
// CANVAS
// ===============================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===============================
// INPUT
// ===============================
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ===============================
// CONSTANTS
// ===============================
const gravity = 0.5;
const WORLD_WIDTH = 3000;

// ===============================
// CAMERA
// ===============================
const camera = { x: 0 };

// ===============================
// PLAYER (WORLD COORDS)
// ===============================
const player = {
    x: 100,
    y: 300,
    width: 24,
    height: 32,
    vx: 0,
    vy: 0,
    speed: 4,
    jumpForce: 12,
    onGround: false,
    prevY: 300
};

// ===============================
// WORLD GEOMETRY
// ===============================

// Sólidos completos (paredes, suelo)
const solids = [
    { x: 0, y: 420, width: WORLD_WIDTH, height: 30 }, // suelo
    { x: 800, y: 370, width: 80, height: 50 }, 
    { x: 1600, y: 250, width: 40, height: 200 }      // pared vertical
];

// Plataformas de salto (one-way)
const platforms = [
    { x: 300,  y: 340, width: 120, height: 10 },
    { x: 650,  y: 300, width: 120, height: 10 },
    { x: 1000, y: 260, width: 120, height: 10 }
];

// ===============================
// AABB
// ===============================
function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// ===============================
// UPDATE PLAYER
// ===============================
function updatePlayer() {
    player.prevY = player.y;

    // --- Input
    player.vx = 0;
    if (keys["ArrowLeft"])  player.vx = -player.speed;
    if (keys["ArrowRight"]) player.vx =  player.speed;

    if (keys["ArrowUp"] && player.onGround) {
        player.vy = -player.jumpForce;
        player.onGround = false;
    }

    // --- Gravity
    player.vy += gravity;

    // ===============================
    // HORIZONTAL (SOLO SOLIDS)
    // ===============================
    player.x += player.vx;
    for (const s of solids) {
        if (isColliding(player, s)) {
            if (player.vx > 0) player.x = s.x - player.width;
            else if (player.vx < 0) player.x = s.x + s.width;
        }
    }

    // ===============================
    // VERTICAL
    // ===============================
    player.y += player.vy;
    player.onGround = false;

    // Solids (suelo, pared)
    for (const s of solids) {
        if (isColliding(player, s)) {
            if (player.vy > 0) {
                player.y = s.y - player.height;
                player.vy = 0;
                player.onGround = true;
            } else if (player.vy < 0) {
                player.y = s.y + s.height;
                player.vy = 0;
            }
        }
    }

    // Platforms (solo si cae desde arriba)
    for (const p of platforms) {
        const wasAbove = player.prevY + player.height <= p.y;
        const isFalling = player.vy >= 0;

        if (isColliding(player, p) && wasAbove && isFalling) {
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    }

    // límites del mundo
    player.x = Math.max(0, Math.min(WORLD_WIDTH - player.width, player.x));
}

// ===============================
// CAMERA (CENTER PLAYER)
// ===============================
function updateCamera() {
    camera.x = player.x + player.width / 2 - canvas.width / 2;
    camera.x = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, camera.x));
}

// ===============================
// DRAW
// ===============================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Solids
    ctx.fillStyle = "#3b7a1e";
    for (const s of solids) {
        ctx.fillRect(s.x - camera.x, s.y, s.width, s.height);
    }

    // Platforms
    ctx.fillStyle = "#2e8b57";
    for (const p of platforms) {
        ctx.fillRect(p.x - camera.x, p.y, p.width, p.height);
    }

    // Player
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(player.x - camera.x, player.y, player.width, player.height);
}

// ===============================
// LOOP
// ===============================
function loop() {
    updatePlayer();
    updateCamera();
    draw();
    requestAnimationFrame(loop);
}

loop();
