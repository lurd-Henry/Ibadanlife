const Game = {
    canvas: null,
    ctx: null,

    running: false,
    paused: false,

    lastTime: 0,
    cameraX: 0,
    cameraY: 0,

    elapsed: 0,

    keys: {},

    isRunning: false,

    init() {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");

        Joystick.init();
        this.bindControls();
        this.resizeCanvas();

        window.addEventListener(
            "resize",
            () => this.resizeCanvas()
        );

        Player.init();

        this.running = false;
        this.paused = false;

        this.renderInitialWorld();
    },

    resizeCanvas() {
        if (!this.canvas) return;

        const rect = this.canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        this.canvas.width = Math.round(rect.width * dpr);
        this.canvas.height = Math.round(rect.height * dpr);

        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    },

    bindControls() {
        window.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();

            if (
                [
                    "arrowup",
                    "arrowdown",
                    "arrowleft",
                    "arrowright",
                    " "
                ].includes(key)
            ) {
                event.preventDefault();
            }

            this.keys[key] = true;

            if (key === "escape") {
                this.togglePause();
            }

            if (key === "e") {
                this.interact();
            }
        });

        window.addEventListener("keyup", (event) => {
            this.keys[event.key.toLowerCase()] = false;
        });

        window.addEventListener("blur", () => {
            this.keys = {};
            this.isRunning = false;
        });

        document.getElementById("start-game")
            .addEventListener("click", () => {
                this.startNewGame();
            });

        document.querySelectorAll(".gender-option")
            .forEach((button) => {
                button.addEventListener("click", () => {
                    document.querySelectorAll(".gender-option")
                        .forEach((item) => {
                            item.classList.remove("selected");
                            item.setAttribute("aria-pressed", "false");
                        });

                    button.classList.add("selected");
                    button.setAttribute("aria-pressed", "true");
                });
            });

        document.getElementById("fullscreen-button")
            .addEventListener("click", () => {
                this.toggleFullscreen();
            });

        document.getElementById("pause-button")
            .addEventListener("click", () => {
                this.togglePause();
            });

        document.getElementById("resume-game")
            .addEventListener("click", () => {
                this.togglePause(false);
            });

        const runButton = document.getElementById("run-button");

        runButton.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            this.isRunning = true;
        });

        const stopRunning = () => {
            this.isRunning = false;
        };

        runButton.addEventListener("pointerup", stopRunning);
        runButton.addEventListener("pointercancel", stopRunning);
        runButton.addEventListener("lostpointercapture", stopRunning);

        window.addEventListener("pointerup", stopRunning);
        window.addEventListener("blur", stopRunning);

        document.getElementById("interact-button")
            .addEventListener("click", () => {
                this.interact();
            });
    },

    startNewGame() {
        const nameInput = document.getElementById("character-name");

        const selected = document.querySelector(
            ".gender-option.selected"
        );

        const name = nameInput.value.trim() || "Player";
        const gender = selected?.dataset.gender || "male";

        Player.createCharacter(name, gender);

        document.getElementById("character-screen")
            .classList.add("hidden");

        document.getElementById("game-screen")
            .classList.remove("hidden");

        this.resizeCanvas();
        this.updateHUD();

        this.running = true;
        this.paused = false;
        this.lastTime = 0;
        this.elapsed = 0;

        this.renderInitialWorld();

        requestAnimationFrame((time) => this.loop(time));
    },

    loop(timestamp) {
if (!this.running) return;
if (this.paused) return;

const deltaTime = this.lastTime
    ? Math.min((timestamp - this.lastTime) / 1000, 0.05)
    : 0;
this.lastTime = timestamp;
this.elapsed += deltaTime;
this.update(deltaTime);
this.render();
// Temporary diagnostic overlay
const ctx = this.ctx;
ctx.save();
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.fillStyle = "white";
ctx.font = "16px Arial";
ctx.fillText("GAME LOOP: RUNNING", 15, 25);
ctx.fillText(
    "PLAYER: " + Math.round(Player.x) + ", " + Math.round(Player.y),
    15,
    50
);
ctx.fillText(
    "INTERIOR: " + (Interiors.active ? "YES" : "NO"),
    15,
    75
);
ctx.restore();
requestAnimationFrame((time) => this.loop(time));

},

    update(deltaTime) {
let dx = 0;
let dy = 0;

if (this.keys["arrowup"] || this.keys["w"]) dy -= 1;
if (this.keys["arrowdown"] || this.keys["s"]) dy += 1;
if (this.keys["arrowleft"] || this.keys["a"]) dx -= 1;
if (this.keys["arrowright"] || this.keys["d"]) dx += 1;
const joystickDirection = Joystick.getDirection();
dx += joystickDirection.x;
dy += joystickDirection.y;
const moving = Math.hypot(dx, dy) > 0.05;
// Always allow the player to move.
Player.move(dx, dy, deltaTime, this.isRunning);
if (Interiors.active) {
    // Keep the interior camera fixed.
    this.cameraX = 0;
    this.cameraY = 0;
} else {
    // Follow the player in the outside world.
    this.cameraX = Player.x - this.canvas.clientWidth / 2;
    this.cameraY = Player.y - this.canvas.clientHeight / 2;
    this.cameraX = Math.max(
        0,
        Math.min(
            this.cameraX,
            World.width - this.canvas.clientWidth
        )
    );
    this.cameraY = Math.max(
        0,
        Math.min(
            this.cameraY,
            World.height - this.canvas.clientHeight
        )
    );
}
this.updateHUD();
if (typeof UI !== "undefined" && UI.update) {
    UI.update();
}
if (typeof AudioSystem !== "undefined") {
    AudioSystem.setWalking(moving);
}

},

    render() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    if (!ctx || !canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    // Test background
    ctx.fillStyle = "#00aa00";
    ctx.fillRect(0, 0, width, height);

    // Red test box
    ctx.fillStyle = "red";
    ctx.fillRect(30, 30, 100, 100);

    // Blue test circle
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(200, 100, 40, 0, Math.PI * 2);
    ctx.fill();

    // Test text
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText("CANVAS TEST WORKING", 30, 200);
},
    updateHUD() {
        const nameElement = document.getElementById("hud-player-name");
        const cashElement = document.getElementById("hud-cash");
        const avatarElement = document.getElementById("player-avatar");

        if (nameElement) nameElement.textContent = Player.name;

        if (cashElement) {
            cashElement.textContent =
                "₦" + Player.cash.toLocaleString("en-NG");
        }

        if (avatarElement) {
            avatarElement.textContent =
                Player.gender === "female" ? "♀" : "♂";
        }
    },

    interact() {
    if (!this.running || this.paused) return;

    if (Interiors.active) {
        Interiors.interact();
        return;
    }

    const building = World.getNearbyBuilding();

    if (building) {
        Interiors.enter(building);
        return;
    }

    if (
        typeof Missions !== "undefined" &&
        Missions.interact
    ) {
        Missions.interact();
        return;
    }

    this.showMessage("Nothing to interact with here.");
},

    showMessage(message) {
        const element = document.getElementById("game-message");

        element.textContent = message;
        element.classList.remove("hidden");

        clearTimeout(this.messageTimer);

        this.messageTimer = setTimeout(() => {
            element.classList.add("hidden");
        }, 2200);
    },

    togglePause(forceState) {
        if (!this.running) return;

        this.paused = typeof forceState === "boolean"
            ? forceState
            : !this.paused;

        document.getElementById("pause-overlay")
            .classList.toggle("hidden", !this.paused);

        if (this.paused) {
            if (typeof AudioSystem !== "undefined") {
                AudioSystem.setWalking(false);
            }

            Joystick.reset();
            this.isRunning = false;
            this.lastTime = 0;
        } else {
            this.lastTime = 0;
            requestAnimationFrame((time) => this.loop(time));
        }
    },

    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen?.();
            } else {
                await document.exitFullscreen?.();
            }
        } catch (error) {
            console.warn("Fullscreen unavailable:", error);

            this.showMessage(
                "Fullscreen isn't supported in this browser."
            );
        }
    }
};
