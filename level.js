// Level data moved from script.js
const groundY = 1100;

const level = {
    worldWidth: 3000,
    worldHeight: 1200,

    solids: [
        { x: 0, y: groundY, width: 3000, height: 100 },  // suelo
        { x: 320,  y: groundY - 180, width: 220, height: 20 },    
        { x: 200, y: groundY - 1000, width: 40, height: 920 }, // pared 1  
        { x: 600, y: groundY - 1000, width: 40, height: 1000 }  // pared 2
    ],

    platforms: [
        { x: 300,  y: groundY - 120, width: 220, height: 10 },       
        { x: 330,  y: groundY - 220, width: 220, height: 10 },
        { x: 340,  y: groundY - 270, width: 220, height: 10 },
        { x: 350,  y: groundY - 350, width: 200, height: 10 },
        { x: 360,  y: groundY - 410, width: 220, height: 10 },
        { x: 370,  y: groundY - 490, width: 220, height: 10 },
        { x: 350,  y: groundY - 570, width: 220, height: 10 },
        { x: 340,  y: groundY - 650, width: 220, height: 10 },
        { x: 360,  y: groundY - 730, width: 220, height: 10 },
        { x: 370,  y: groundY - 810, width: 220, height: 10 },
        { x: 360,  y: groundY - 900, width: 220, height: 10 },
        { x: 350,  y: groundY - 950, width: 220, height: 10 },
        { x: 1000, y: groundY - 100, width: 200, height: 10 }
    ],
    
    mobile_platforms: [
        { x: 300,  y: groundY - 70, width: 220, height: 10, speed: 1, dir: -1},
        { x: 650,  y: groundY - 950, width: 220, height: 10, speed: 5, dir: -1}
    ],
    enemies: [
        { x: 220, y: groundY - 230, width: 10, height: 6, speed: 0, dir: -1 },
        { x: 400, y: groundY - 20, width: 40, height: 20, speed: 1.5, dir: 1 }
    ]
};

// Expose `level` globally (already global when loaded as a script)
