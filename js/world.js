const World = {
width: 2400,
height: 1800,
tileSize: 80,

buildings: [],
roads: [],
init() {
    this.buildings = [
        { x: 100, y: 100, w: 240, h: 180 },
        { x: 460, y: 100, w: 200, h: 180 },
        { x: 820, y: 100, w: 300, h: 180 },
        { x: 100, y: 420, w: 240, h: 220 },
        { x: 460, y: 420, w: 200, h: 220 },
        { x: 820, y: 420, w: 300, h: 220 },
        { x: 1400, y: 100, w: 260, h: 180 },
        { x: 1780, y: 100, w: 260, h: 180 },
        { x: 1400, y: 420, w: 260, h: 220 },
        { x: 1780, y: 420, w: 260, h: 220 },
        { x: 100, y: 1000, w: 280, h: 200 },
        { x: 500, y: 1000, w: 280, h: 200 },
        { x: 900, y: 1000, w: 280, h: 200 },
        { x: 1400, y: 1000, w: 260, h: 200 },
        { x: 1780, y: 1000, w: 260, h: 200 }
    ];
    this.roads = [
        { x: 0, y: 300, w: 2400, h: 90 },
        { x: 0, y: 700, w: 2400, h: 100 },
        { x: 0, y: 900, w: 2400, h: 80 },
        { x: 350, y: 0, w: 90, h: 1800 },
        { x: 700, y: 0, w: 90, h: 1800 },
        { x: 1200, y: 0, w: 100, h: 1800 },
        { x: 1700, y: 0, w: 90, h: 1800 }
    ];
},
draw(ctx) {
    // Ground
    ctx.fillStyle = "#657d49";
    ctx.fillRect(0, 0, this.width, this.height);
    // Grass texture
    ctx.fillStyle = "#708953";
    for (let x = 0; x < this.width; x += 80) {
        for (let y = 0; y < this.height; y += 80) {
            ctx.fillRect(x + 10, y + 10, 2, 2);
        }
    }
    // Roads
    for (const road of this.roads) {
        ctx.fillStyle = "#34383d";
        ctx.fillRect(road.x, road.y, road.w, road.h);
        // Road markings
        ctx.strokeStyle = "#e8dca6";
        ctx.lineWidth = 3;
        ctx.setLineDash([24, 20]);
        ctx.beginPath();
        if (road.w > road.h) {
            const centerY = road.y + road.h / 2;
            ctx.moveTo(road.x, centerY);
            ctx.lineTo(road.x + road.w, centerY);
        } else {
            const centerX = road.x + road.w / 2;
            ctx.moveTo(centerX, road.y);
            ctx.lineTo(centerX, road.y + road.h);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }
    // Buildings
    for (let i = 0; i < this.buildings.length; i++) {
        const b = this.buildings[i];
        ctx.fillStyle = "#41464d";
        ctx.fillRect(b.x + 8, b.y + 10, b.w, b.h);
        ctx.fillStyle = [
            "#c7a27c",
            "#d1b58b",
            "#9eacb4",
            "#b4a18b"
        ][i % 4];
        ctx.fillRect(b.x, b.y, b.w, b.h);
        // Roof
        ctx.fillStyle = "#777b7d";
        ctx.fillRect(b.x, b.y, b.w, 18);
        // Windows
        ctx.fillStyle = "#547b8c";
        for (let wx = b.x + 18; wx < b.x + b.w - 15; wx += 40) {
            for (let wy = b.y + 35; wy < b.y + b.h - 15; wy += 40) {
                ctx.fillRect(wx, wy, 18, 22);
            }
        }
        // Entrance
        ctx.fillStyle = "#49372b";
        ctx.fillRect(
            b.x + b.w / 2 - 12,
            b.y + b.h - 35,
            24,
            35
        );
    }
},
isBlocked(x, y, width = 26, height = 34) {
    return this.buildings.some(b =>
        x < b.x + b.w &&
        x + width > b.x &&
        y < b.y + b.h &&
        y + height > b.y
    );
}

};

World.init();
