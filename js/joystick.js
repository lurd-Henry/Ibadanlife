const Joystick = {
    base: null,
    knob: null,

    active: false,
    pointerId: null,

    x: 0,
    y: 0,

    maxDistance: 0,

    init() {
        this.base = document.getElementById("joystick-base");
        this.knob = document.getElementById("joystick-knob");

        if (!this.base || !this.knob) return;

        this.base.addEventListener(
            "pointerdown",
            (event) => this.start(event)
        );

        window.addEventListener(
            "pointermove",
            (event) => this.move(event)
        );

        window.addEventListener(
            "pointerup",
            (event) => this.end(event)
        );

        window.addEventListener(
            "pointercancel",
            (event) => this.end(event)
        );

        window.addEventListener("blur", () => this.reset());
    },

    start(event) {
        if (this.active) return;

        event.preventDefault();

        this.active = true;
        this.pointerId = event.pointerId;

        this.base.setPointerCapture?.(event.pointerId);

        this.move(event);
    },

    move(event) {
        if (!this.active) return;

        if (event.pointerId !== this.pointerId) return;

        event.preventDefault();

        const rect = this.base.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = event.clientX - centerX;
        let dy = event.clientY - centerY;

        const knobRadius = this.knob.offsetWidth / 2;

        this.maxDistance = Math.max(
            1,
            rect.width / 2 - knobRadius - 5
        );

        const distance = Math.hypot(dx, dy);

        if (distance > this.maxDistance) {
            dx = (dx / distance) * this.maxDistance;
            dy = (dy / distance) * this.maxDistance;
        }

        this.x = dx / this.maxDistance;
        this.y = dy / this.maxDistance;

        this.knob.style.left =
            `calc(50% + ${dx}px)`;

        this.knob.style.top =
            `calc(50% + ${dy}px)`;
    },

    end(event) {
        if (!this.active) return;

        if (
            event &&
            event.pointerId !== undefined &&
            event.pointerId !== this.pointerId
        ) {
            return;
        }

        this.reset();
    },

    reset() {
        this.active = false;
        this.pointerId = null;

        this.x = 0;
        this.y = 0;

        if (this.knob) {
            this.knob.style.left = "50%";
            this.knob.style.top = "50%";
        }
    },

    getDirection() {
        return {
            x: this.x,
            y: this.y
        };
    }
};
