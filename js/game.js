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
    messageTimer: null,

    // =====================================
    // INITIALIZATION
    // =====================================

    init() {
        this.canvas = document.getElementById("game-canvas");

        if (!this.canvas) {
            console.error("Game canvas not found.");
            return;
        }

        this.ctx = this.canvas.getContext("2d");

        if (!this.ctx) {
            console.error("Canvas rendering is unavailable.");
            return;
        }

        if (typeof Joystick !== "undefined") {
            Joystick.init();
        }

        this.bindControls();
        this.resizeCanvas();

        window.addEventListener("resize", () => {
            this.resizeCanvas();
            this.render();
        });

        if (typeof Player !== "undefined") {
            Player.init();
        }

        this.running = false;
        this.paused = false;

        this.updateCamera();
        this.renderInitialWorld();

        console.log("Lagos Life initialized successfully.");
    },

    // =====================================
    // CANVAS RESIZING
    // =====================================

    resizeCanvas() {
        if (!this.canvas || !this.ctx) return;

        const rect = this.canvas.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) return;

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        const pixelWidth = Math.round(rect.width * dpr);
        const pixelHeight = Math.round(rect.height * dpr);

        if (
            this.canvas.width !== pixelWidth ||
            this.canvas.height !== pixelHeight
        ) {
            this.canvas.width = pixelWidth;
            this.canvas.height = pixelHeight;
        }

        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    },

    // =====================================
    // CAMERA
    // =====================================

    updateCamera() {
        if (!this.canvas || !Player || !World) return;

        if (typeof Interiors !== "undefined" && Interiors.active) {
            this.cameraX = 0;
            this.cameraY = 0;
            return;
        }

        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.cameraX = Player.x - width / 2;
        this.cameraY = Player.y - height / 2;

        this.cameraX = Math.max(
            0,
            Math.min(
                this.cameraX,
                Math.max(0, World.width - width)
            )
        );

        this.cameraY = Math.max(
            0,
            Math.min(
                this.cameraY,
                Math.max(0, World.height - height)
            )
        );
    },

    // =====================================
    // CONTROLS
    // =====================================

    bindControls() {
        window.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();

            const movementKeys = [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                " "
            ];

            if (movementKeys.includes(key)) {
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

            if (typeof Joystick !== "undefined") {
                Joystick.reset();
            }
        });

        const startButton = document.getElementById("start-game");

        if (startButton) {
            startButton.addEventListener("click", () => {
                this.startNewGame();
            });
        }

        document.querySelectorAll(".gender-option").forEach((button) => {
            button.addEventListener("click", () => {
                document.querySelectorAll(".gender-option").forEach((item) => {
                    item.classList.remove("selected");
                    item.setAttribute("aria-pressed", "false");
                });

                button.classList.add("selected");
                button.setAttribute("aria-pressed", "true");
            });
        });

        const fullscreenButton = document.getElementById("fullscreen-button");

        if (fullscreenButton) {
            fullscreenButton.addEventListener("click", () => {
                this.toggleFullscreen();
            });
        }

        const pauseButton = document.getElementById("pause-button");

        if (pauseButton) {
            pauseButton.addEventListener("click", () => {
                this.togglePause();
            });
        }

        const resumeButton = document.getElementById("resume-game");

        if (resumeButton) {
            resumeButton.addEventListener("click", () => {
                this.togglePause(false);
            });
        }

        const runButton = document.getElementById("run-button");

        if (runButton) {
            const startRunning = (event) => {
                event.preventDefault();
                this.isRunning = true;
            };

            const stopRunning = () => {
                this.isRunning = false;
            };

            runButton.addEventListener("pointerdown", startRunning);
            runButton.addEventListener("pointerup", stopRunning);
            runButton.addEventListener("pointercancel", stopRunning);
            runButton.addEventListener("lostpointercapture", stopRunning);

            window.addEventListener("pointerup", stopRunning);
        }

        const interactButton = document.getElementById("interact-button");

        if (interactButton) {
            interactButton.addEventListener("click", () => {
                this.interact();
            });
        }
    },

    // =====================================
    // START GAME
    // =====================================

    startNewGame() {
        const nameInput = document.getElementById("character-name");

        const selectedGender = document.querySelector(
            ".gender-option.selected"
        );

        const name = nameInput?.value.trim() || "Player";
        const gender = selectedGender?.dataset.gender || "male";

        Player.createCharacter(name, gender);

        const characterScreen = document.getElementById("character-screen");
        const gameScreen = document.getElementById("game-screen");

        if (characterScreen) {
            characterScreen.classList.add("hidden");
        }

        if (gameScreen) {
            gameScreen.classList.remove("hidden");
        }

        // Allow the browser to calculate the newly visible canvas size.
        requestAnimationFrame(() => {
            this.resizeCanvas();

            this.running = true;
            this.paused = false;

            this.lastTime = 0;
            this.elapsed = 0;

            this.cameraX = 0;
            this.cameraY = 0;

            this.updateCamera();
            this.updateHUD();
            this.renderInitialWorld();

            requestAnimationFrame((time) => {
                this.loop(time);
            });
        });
    },

    // =====================================
    // GAME LOOP
    // =====================================

    loop(timestamp) {
        if (!this.running || this.paused) return;

        const deltaTime = this.lastTime
            ? Math.min((timestamp - this.lastTime) / 1000, 0.05)
            : 0;

        this.lastTime = timestamp;
        this.elapsed += deltaTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => {
            this.loop(time);
        });
    },

    // =====================================
    // PLAYER AND WORLD UPDATES
    // =====================================

    update(deltaTime) {
        let dx = 0;
        let dy = 0;

        if (this.keys["arrowup"] || this.keys["w"]) dy -= 1;
        if (this.keys["arrowdown"] || this.keys["s"]) dy += 1;
        if (this.keys["arrowleft"] || this.keys["a"]) dx -= 1;
        if (this.keys["arrowright"] || this.keys["d"]) dx += 1;

        if (typeof Joystick !== "undefined") {
            const direction = Joystick.getDirection();

            dx += direction.x;
            dy += direction.y;
        }

        const moving = Math.hypot(dx, dy) > 0.05;

        Player.move(
            dx,
            dy,
            deltaTime,
            this.isRunning
        );

        this.updateCamera();
        this.updateHUD();

        if (typeof UI !== "undefined" && UI.update) {
            UI.update();
        }

        if (typeof AudioSystem !== "undefined") {
            AudioSystem.setWalking(moving);
        }
    },

    // =====================================
    // WORLD RENDERING
    // =====================================

    render() {
        if (!this.ctx || !this.canvas) return;

        const ctx = this.ctx;

        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        if (width <= 0 || height <= 0) return;

        // Clear previous frame.
        ctx.clearRect(0, 0, width, height);

        // Interior rendering.
        if (typeof Interiors !== "undefined" && Interiors.active) {
            ctx.save();

            ctx.scale(
                width / 800,
                height / 600
            );

            Interiors.draw(ctx);

            ctx.restore();

            return;
        }

        // Outside world rendering.
        ctx.save();

        ctx.translate(
            -this.cameraX,
            -this.cameraY
        );

        World.draw(ctx);
        Player.draw(ctx);

        ctx.restore();
    },

    // =====================================
    // INITIAL WORLD RENDERING
    // =====================================

    renderInitialWorld() {
        if (!this.ctx || !this.canvas) return;

        this.resizeCanvas();
        this.updateCamera();
        this.render();
    },

    // =====================================
    // HUD
    // =====================================

    updateHUD() {
        const nameElement = document.getElementById("hud-player-name");
        const cashElement = document.getElementById("hud-cash");
        const avatarElement = document.getElementById("player-avatar");

        if (nameElement) {
            nameElement.textContent = Player.name;
        }

        if (cashElement) {
            cashElement.textContent =
                "₦" + Player.cash.toLocaleString("en-NG");
        }

        if (avatarElement) {
            avatarElement.textContent =
                Player.gender === "female" ? "♀" : "♂";
        }
    },

    // =====================================
    // INTERACTIONS
    // =====================================

    interact() {
        if (!this.running || this.paused) return;

        if (typeof Interiors !== "undefined" && Interiors.active) {
            Interiors.interact();
            return;
        }

        let building = null;

        if (typeof World.getNearbyBuilding === "function") {
            building = World.getNearbyBuilding();
        } else {
            building = World.buildings.find((item) => {
                if (!item.enterable) return false;

                return Math.hypot(
                    Player.x - item.entranceX,
                    Player.y - item.entranceY
                ) < 65;
            }) || null;
        }

        if (building) {
            Interiors.enter(building);
            this.updateCamera();
            this.render();
            return;
        }

        if (
            typeof Missions !== "undefined" &&
            typeof Missions.interact === "function"
        ) {
            Missions.interact();
            return;
        }

        this.showMessage("Nothing to interact with here.");
    },

    // =====================================
    // GAME MESSAGES
    // =====================================

    showMessage(message) {
        const element = document.getElementById("game-message");

        if (!element) return;

        element.textContent = message;
        element.classList.remove("hidden");

        clearTimeout(this.messageTimer);

        this.messageTimer = setTimeout(() => {
            element.classList.add("hidden");
        }, 2200);
    },

    // =====================================
    // PAUSE AND RESUME
    // =====================================

    togglePause(forceState) {
        if (!this.running) return;

        this.paused = typeof forceState === "boolean"
            ? forceState
            : !this.paused;

        const overlay = document.getElementById("pause-overlay");

        if (overlay) {
            overlay.classList.toggle("hidden", !this.paused);
        }

        if (this.paused) {
            if (typeof AudioSystem !== "undefined") {
                AudioSystem.setWalking(false);
            }

            if (typeof Joystick !== "undefined") {
                Joystick.reset();
            }

            this.keys = {};
            this.isRunning = false;
            this.lastTime = 0;

        } else {
            this.lastTime = 0;

            requestAnimationFrame((time) => {
                this.loop(time);
            });
        }
    },

    // =====================================
    // FULLSCREEN
    // =====================================

    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen?.();
            } else {
                await document.exitFullscreen?.();
            }

            setTimeout(() => {
                this.resizeCanvas();
                this.updateCamera();
                this.render();
            }, 200);

        } catch (error) {
            console.warn("Fullscreen unavailable:", error);

            this.showMessage(
                "Fullscreen isn't supported in this browser."
            );
        }
    }
};
