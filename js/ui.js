const UI = {
    notify(message) {
        document.getElementById("notification").textContent =
            message;
    },

    update() {
        document.getElementById("cash").textContent =
            "₦" + Player.cash.toLocaleString("en-NG");

        document.getElementById("respect").textContent =
            Player.respect + " REP";

        document.getElementById("mission-title").textContent =
            Missions.current.title;

        document.getElementById("mission-description").textContent =
            Missions.current.description;

        const time = document.getElementById("game-time");

        const hours = 8 + Math.floor(Game.elapsed / 3600) % 12;

        const minutes = Math.floor(Game.elapsed / 60) % 60;

        time.textContent =
            `DAY 01 · ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }
};
