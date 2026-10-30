const Player = {
    x: 100,
    y: 100,

    width: 26,
    height: 34,

    speed: 180,
    runMultiplier: 1.65,

    gender: "male",
    name: "Player",

    cash: 5000,
    respect: 0,

    color: "#c58b62",

    init() {
        const saved = this.load();

        if (saved) {
            this.name = saved.name || "Player";
            this.gender = saved.gender || "male";

            this.cash = Number.isFinite(saved.cash)
                ? saved.cash
                : 5000;

            this.respect = Number.isFinite(saved.respect)
                ? saved.respect
                : 0;

            if (
                Number.isFinite(saved.x) &&
                Number.isFinite(saved.y)
            ) {
                this.x = saved.x;
                this.y = saved.y;
            }
        }

        // Recover invalid or obstructed saved positions.
        if (World.isBlocked(
            this.x,
            this.y,
            this.width,
            this.height
        )) {
            this.x = 480;
            this.y = 800;
        }

        this.updateAppearance();
    },

    updateAppearance() {
        this.color = this.gender === "female"
            ? "#d9a17d"
            : "#c58b62";
    },

    createCharacter(name, gender) {
        this.name = name.trim() || "Player";
        this.gender = gender === "female"
            ? "female"
            : "male";

        this.x = 480;
        this.y = 800;

        this.cash = 5000;
        this.respect = 0;

        this.updateAppearance();
        this.save();
    },

    move(dx, dy, dt, running = false) {
        const length = Math.hypot(dx, dy);

        if (length < 0.05) return;

        if (length > 1) {
            dx /= length;
            dy /= length;
        }

        const speed = this.speed *
            (running ? this.runMultiplier : 1);

        const distance = speed * dt;

        const nextX = this.x + dx * distance;
        const nextY = this.y + dy * distance;

        let blockedX;
        let blockedY;

        if (Interiors.active) {
            blockedX = Interiors.isBlocked(
                nextX,
                this.y,
                this.width,
                this.height
            );

            blockedY = Interiors.isBlocked(
                this.x,
                nextY,
                this.width,
                this.height
            );
        } else {
            blockedX = World.isBlocked(
                nextX,
                this.y,
                this.width,
                this.height
            );

            blockedY = World.isBlocked(
                this.x,
                nextY,
                this.width,
                this.height
            );
        }

        if (!blockedX) this.x = nextX;
        if (!blockedY) this.y = nextY;

        this.save();
    },

    draw(ctx) {
        const x = this.x;
        const y = this.y;

        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.ellipse(x, y + 12, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#26332a";
        ctx.fillRect(x - 7, y + 2, 5, 12);
        ctx.fillRect(x + 2, y + 2, 5, 12);

        ctx.fillStyle = this.gender === "female"
            ? "#c66ba5"
            : "#c8ff54";

        ctx.fillRect(x - 9, y - 9, 18, 15);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y - 14, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#30251e";
        ctx.beginPath();
        ctx.arc(x, y - 17, 8, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center";

        ctx.fillStyle = "#fff";
        ctx.fillText(this.name, x, y - 27);
    },

    save() {
        try {
            localStorage.setItem(
                "lagosLifePlayer",
                JSON.stringify({
                    name: this.name,
                    gender: this.gender,
                    cash: this.cash,
                    respect: this.respect,
                    x: this.x,
                    y: this.y
                })
            );
        } catch (error) {
            console.warn(error);
        }
    },

    load() {
        try {
            return JSON.parse(
                localStorage.getItem("lagosLifePlayer")
            );
        } catch (error) {
            return null;
        }
    }
};
