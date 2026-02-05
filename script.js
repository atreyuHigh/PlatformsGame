// Simple Platformer Game - Fresh Start
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

console.log("Game started!");
console.log("Canvas size:", canvas.width, "x", canvas.height);

// Game state
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

const gravity = 0.5;
const keys = {};

// Input handling
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Game data

const level = {
    worldWidth: 3000,
    solids: [
        { x: 0, y: 420, width: 3000, height: 30 },
        { x: 200, y: 350, width: 50, height: 10 }
    ],
    platforms: [
        { x: 300, y: 340, width: 220, height: 10 },
        { x: 650, y: 300, width: 120, height: 10 },
        { x: 1000, y: 260, width: 120, height: 10 }
    ],
    enemies: [
        { x: 500, y: 380, width: 40, height: 10, speed: 1.5, dir: -1 },
        { x: 1200, y: 380, width: 30, height: 10, speed: 2, dir: 1 }
    ]
};

const camera = { x: 0 };
let gameOver = false;
let lastTime = 0;

// Collision detection
function hit(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Update player
function updatePlayer() {
    player.prevY = player.y;
    
    // Horizontal movement
    if (keys["ArrowLeft"] || keys["a"]) player.vx = -player.speed;
    else if (keys["ArrowRight"] || keys["d"]) player.vx = player.speed;
    else player.vx = 0;
    
    // Jump
    if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && player.onGround) {
        player.vy = -player.jumpForce;
        player.onGround = false;
    }
    
    // Apply gravity
    player.vy += gravity;
    
    // Update X position
    player.x += player.vx;
    
    // Collide with solids (horizontal)
    level.solids.forEach(s => {
        if (hit(player, s)) {
            if (player.vx > 0) player.x = s.x - player.width;
            if (player.vx < 0) player.x = s.x + s.width;
        }
    });
    
    // Update Y position
    player.y += player.vy;
    player.onGround = false;
    
    // Collide with solids (vertical)
    level.solids.forEach(s => {
        if (hit(player, s)) {
            if (player.vy > 0) {
                player.y = s.y - player.height;
                player.vy = 0;
                player.onGround = true;
            }
        }
    });
    
    // Collide with platforms
    level.platforms.forEach(p => {
        if (hit(player, p) && player.prevY + player.height <= p.y && player.vy >= 0) {
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    });
    
    // Check enemy collision
    level.enemies.forEach(e => {
        if (hit(player, e)) gameOver = true;
    });
}

// Update enemies
function updateEnemies() {
    level.enemies.forEach(e => {
        e.x += e.speed * e.dir;
        
        // Bounce at level bounds
        if (e.x < 0 || e.x + e.width > level.worldWidth) {
            e.dir *= -1;
        }
    });
}

// Update camera
function updateCamera() {
    camera.x = player.x - canvas.width / 2;
    camera.x = Math.max(0, Math.min(level.worldWidth - canvas.width, camera.x));
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw solids
    ctx.fillStyle = "#3b7a1e";
    level.solids.forEach(s => {
        ctx.fillRect(s.x - camera.x, s.y, s.width, s.height);
    });
    
    // Draw platforms
    const platformImg = new Image();
    platformImg.src = "platform.jpg";
    level.platforms.forEach(p => {
        ctx.drawImage(platformImg, p.x - camera.x, p.y, p.width, p.height);
    });
    
    // Draw enemies
    ctx.fillStyle = "#FF0000";
    level.enemies.forEach(e => {
        ctx.fillRect(e.x - camera.x, e.y, e.width, e.height);
    });
    
    // Draw player
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(player.x - camera.x, player.y, player.width, player.height);
    
    // Draw game over
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    }
}

// Game loop
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    if (!gameOver) {
        updatePlayer();
        updateEnemies();
        updateCamera();
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
console.log("Starting game loop...");
requestAnimationFrame(gameLoop);
