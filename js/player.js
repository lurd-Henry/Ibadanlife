const Player = {
    x: 480,
    y: 400,

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
            this.gender = saved.gender || "male";
            this.name = saved.name || "Player";

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

        this.updateAppearance();
    },

    updateAppearance() {
        this.color = this.gender === "female"
            ? "#d9a17d"
            : "#c58b62";
    },

    createCharacter(name, gender) {
        this.name = name.trim() || "Player";
        this.gender = gender === "female" ? "female" : "male";

        this.x = 480;
        this.y = 400;

        this.cash = 5000;
        this.respect = 0;

        this.updateAppearance();
        this.save();
    },

    move(dx, dy, deltaTime, isRunning = false) {
        const magnitude = Math.hypot(dx, dy);

        if (magnitude < 0.05) return;

        // Normalise diagonal movement.
        if (magnitude > 1) {
            dx /= magnitude;
            dy /= magnitude;
        }

        const multiplier = isRunning
            ? this.runMultiplier
            : 1;

        const distance =
            this.speed * multiplier * deltaTime;

        const nextX = this.x + dx * distance;
        const nextY = this.y + dy * distance;

        if (
            !World.isBlocked(
                nextX,
                this.y,
                this.width,
                this.height
            )
        ) {
            this.x = nextX;
        }

        if (
            !World.isBlocked(
                this.x,
                nextY,
                this.width,
                this.height
            )
        ) {
            this.y = nextY;
        }

        this.save();
    },

    draw(ctx) {
        const x = this.x;
        const y = this.y;

        // Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
        ctx.beginPath();
        ctx.ellipse(
            x,
            y + 12,
            12,
            6,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Legs
        ctx.fillStyle = "#26332a";
        ctx.fillRect(x - 7, y + 2, 5, 12);
        ctx.fillRect(x + 2, y + 2, 5, 12);

        // Body
        ctx.fillStyle = this.gender === "female"
            ? "#c66ba5"
            : "#c8ff54";

        ctx.fillRect(x - 9, y - 9, 18, 15);

        // Head
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y - 14, 8, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = "#30251e";
        ctx.beginPath();
        ctx.arc(
            x,
            y - 17,
            this.gender === "female" ? 9 : 8,
            Math.PI,
            Math.PI * 2
        );
        ctx.fill();

        // Name
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";

        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        ctx.fillText(this.name, x + 1, y - 27 + 1);

        ctx.fillStyle = "#ffffff";
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
            console.warn("Player save unavailable:", error);
        }
    },

    load() {
        try {
            const saved = localStorage.getItem("lagosLifePlayer");

            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.warn("Player save unavailable:", error);
            return null;
        }
    }
};
