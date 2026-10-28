const Game = {
    canvas: null,
    ctx: null,

    keys: new Set(),

    camera: {
        x: 0,
        y: 0
    },

    running: false,
    elapsed: 0,
    lastTime: 0,
    animationId: null,

    init() {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.bindControls();

        this.running = true;

        this.lastTime = performance.now();

        this.loop();

        UI.update();

        UI.notify(
            "Welcome to Lagos. Find the yellow marker to start your first job."
        );
    },

    bindControls() {
        window.addEventListener("keydown", event => {
            const key = event.key.toLowerCase();

            if (
                ["arrowup", "arrowdown", "arrowleft", "arrowright",
                 "w", "a", "s", "d", " "].includes(key)
            ) {
                event.preventDefault();
            }

            this.keys.add(key);

            if (key === "e") {
                Missions.interact();
            }

            if (key === "escape") {
                this.togglePause();
            }
        });

        window.addEventListener("keyup", event => {
            this.keys.delete(event.key.toLowerCase());
        });

        window.addEventListener("blur", () => {
            this.keys.clear();
        });

        document.querySelectorAll("[data-move]").forEach(button => {
            const direction = button.dataset.move;

            const keys = {
                up: "arrowup",
                down: "arrowdown",
                left: "arrowleft",
                right: "arrowright"
            };

            const key = keys[direction];

            const press = event => {
                event.preventDefault();

                this.keys.add(key);
            };

            const release = () => {
                this.keys.delete(key);
            };

            button.addEventListener("pointerdown", press);

            button.addEventListener("pointerup", release);

            button.addEventListener("pointercancel", release);

            button.addEventListener("pointerleave", release);
        });

        document.getElementById("interact-button")
            .addEventListener("click", () => {
                Missions.interact();
            });

        document.getElementById("pause-button")
            .addEventListener("click", () => {
                this.togglePause();
            });

        document.getElementById("resume-button")
            .addEventListener("click", () => {
                this.togglePause();
            });

        document.getElementById("job-button")
            .addEventListener("click", () => {
                UI.notify(
                    "Your first delivery job is marked in yellow on the map."
                );
            });

        document.getElementById("map-button")
            .addEventListener("click", () => {
                UI.notify(
                    `You are at coordinates X: ${Math.round(Player.x)}, Y: ${Math.round(Player.y)}.`
                );
            });
    },

    togglePause() {
        this.running = !this.running;

        document.getElementById("pause-overlay")
            .classList.toggle("hidden", this.running);

        document.getElementById("pause-button").textContent =
            this.running ? "II" : "▶";

        if (this.running) {
            this.lastTime = performance.now();

            this.animationId = requestAnimationFrame(
                time => this.loop(time)
            );
        } else {
            cancelAnimationFrame(this.animationId);
            this.keys.clear();
        }
    },

    update(delta) {
        if (!this.running) return;

        let dx = 0;
        let dy = 0;

        if (this.keys.has("arrowup") || this.keys.has("w")) {
            dy -= 1;
        }

        if (this.keys.has("arrowdown") || this.keys.has("s")) {
            dy += 1;
        }

        if (this.keys.has("arrowleft") || this.keys.has("a")) {
            dx -= 1;
        }

        if (this.keys.has("arrowright") || this.keys.has("d")) {
            dx += 1;
        }

        Player.move(dx * delta, dy * delta, World);

        this.elapsed += delta / 1000;

        // Keep the camera near the player.
        this.camera.x = Math.max(
            0,
            Math.min(
                World.width - this.canvas.width,
                Player.x - this.canvas.width / 2
            )
        );

        this.camera.y = Math.max(
            0,
            Math.min(
                World.height - this.canvas.height,
                Player.y - this.canvas.height / 2
            )
        );
    },

    draw() {
        World.draw(
            this.ctx,
            this.camera,
            this.canvas
        );

        Player.draw(
            this.ctx,
            this.camera
        );
    },

    loop(time = performance.now()) {
        if (!this.running) return;

        const delta = Math.min(
            time - this.lastTime,
            40
        );

        this.lastTime = time;

        this.update(delta);

        this.draw();

        UI.update();

        this.animationId = requestAnimationFrame(
            nextTime => this.loop(nextTime)
        );
    }
};
