const Player = {
    x: 480,
    y: 300,

    width: 22,
    height: 30,

    speed: 3,

    cash: 5000,
    respect: 0,

    direction: "down",

    reset() {
        this.x = 480;
        this.y = 300;
        this.cash = 5000;
        this.respect = 0;
        this.direction = "down";
    },

    move(dx, dy, world) {
        if (dx === 0 && dy === 0) return;

        // Prevent diagonal movement from being faster.
        const length = Math.hypot(dx, dy);

        dx = (dx / length) * this.speed;
        dy = (dy / length) * this.speed;

        const nextX = this.x + dx;
        const nextY = this.y + dy;

        if (!world.isBlocked(nextX, this.y, this)) {
            this.x = nextX;
        }

        if (!world.isBlocked(this.x, nextY, this)) {
            this.y = nextY;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
            this.direction = dx > 0 ? "right" : "left";
        } else {
            this.direction = dy > 0 ? "down" : "up";
        }
    },

    draw(ctx, camera) {
        const x = this.x - camera.x;
        const y = this.y - camera.y;

        // Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
        ctx.beginPath();
        ctx.ellipse(
            x,
            y + 12,
            12,
            5,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Legs
        ctx.fillStyle = "#252e3c";
        ctx.fillRect(x - 7, y + 7, 5, 10);
        ctx.fillRect(x + 2, y + 7, 5, 10);

        // Body
        ctx.fillStyle = "#304c7a";
        ctx.fillRect(x - 9, y - 5, 18, 15);

        // Head
        ctx.fillStyle = "#b97851";
        ctx.beginPath();
        ctx.arc(x, y - 11, 8, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = "#25221f";
        ctx.fillRect(x - 7, y - 18, 14, 5);

        // Name marker
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("YOU", x, y - 26);
    }
};
