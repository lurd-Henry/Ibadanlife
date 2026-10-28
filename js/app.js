document.addEventListener("DOMContentLoaded", () => {
    Game.init();

    const saved = Player.load();

    if (saved) {
        document.getElementById("character-name").value =
            saved.name || "";

        document.querySelectorAll(".gender-option")
            .forEach((button) => {
                const selected = button.dataset.gender === saved.gender;

                button.classList.toggle("selected", selected);

                button.setAttribute(
                    "aria-pressed",
                    String(selected)
                );
            });
    }
});
