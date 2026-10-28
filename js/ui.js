const UI = {
    update() {
        const cash = document.getElementById("hud-cash");
        const name = document.getElementById("hud-player-name");

        if (cash) {
            cash.textContent =
                "₦" + Player.cash.toLocaleString("en-NG");
        }

        if (name) {
            name.textContent = Player.name;
        }

        const status = document.getElementById("hud-status");

        if (status) {
            status.textContent = "Exploring Lagos";
        }
    },

    notify(message) {
        if (typeof Game !== "undefined" && Game.showMessage) {
            Game.showMessage(message);
        } else {
            console.log(message);
        }
    }
};
