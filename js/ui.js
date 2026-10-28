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
    }
};
