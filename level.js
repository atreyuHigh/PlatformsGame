// Level data moved from script.js
const groundY = 1100;

const level = {
    worldWidth: 3000,
    worldHeight: 1200,

    solids: [
        { x: 0, y: groundY, width: 3000, height: 100 },        // suelo
        { x: 600, y: groundY - 300, width: 40, height: 300 }  // pared
    ],

    platforms: [
        { x: 300,  y: groundY - 120, width: 220, height: 10 },
        { x: 320,  y: groundY - 180, width: 220, height: 10 },
        { x: 330,  y: groundY - 220, width: 220, height: 10 },
        { x: 340,  y: groundY - 270, width: 220, height: 10 },
        { x: 350,  y: groundY - 330, width: 220, height: 10 },
        { x: 360,  y: groundY - 410, width: 220, height: 10 },
        { x: 370,  y: groundY - 490, width: 220, height: 10 },
        { x: 1000, y: groundY - 100, width: 200, height: 10 }
    ],

    enemies: [
        { x: 400, y: groundY - 20, width: 40, height: 20, speed: 1.5, dir: 1 }
    ]
};

// Expose `level` globally (already global when loaded as a script)
