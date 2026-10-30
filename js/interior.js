const Interiors = {
    active: false,
    current: null,

    meals: [
        { name: "Jollof Rice", price: 2500 },
        { name: "Rice and Stew", price: 2000 },
        { name: "Beans and Bread", price: 1500 },
        { name: "Eba and Soup", price: 2000 },
        { name: "Amala and Ewedu", price: 2500 }
    ],

    enter(building) {
        this.active = true;
        this.current = building;

        // Place player inside the restaurant.
        Player.x = 480;
        Player.y = 490;

        this.closeShopMenu();

        Game.cameraX = 0;
        Game.cameraY = 0;

        Game.showMessage(
            `Welcome to ${building.name}!`
        );
    },

    exit() {
        if (!this.active) return;

        const building = this.current;

        this.active = false;
        this.current = null;

        this.closeShopMenu();

        // Place player outside the entrance.
        Player.x = building.entranceX;
        Player.y = building.entranceY + 35;

        Player.save();

        Game.showMessage(
            `You left ${building.name}.`
        );
    },

    isBlocked(x, y, width, height) {
        const halfW = width / 2;
        const halfH = height / 2;

        // Interior boundaries.
        if (
            x - halfW < 25 ||
            y - halfH < 25 ||
            x + halfW > 775 ||
            y + halfH > 575
        ) {
            return true;
        }

        // Restaurant furniture collision.
        if (
            this.current?.interior === "restaurant"
        ) {
            const furniture = [
                { x: 140, y: 140, w: 140, h: 55 },
                { x: 480, y: 140, w: 150, h: 55 },
                { x: 350, y: 80, w: 130, h: 65 }
            ];

            return furniture.some(item => {
                return (
                    x + halfW > item.x &&
                    x - halfW < item.x + item.w &&
                    y + halfH > item.y &&
                    y - halfH < item.y + item.h
                );
            });
        }

        return false;
    },

    draw(ctx) {
        ctx.fillStyle = "#e8d7b7";
        ctx.fillRect(0, 0, 800, 600);

        // Floor tiles.
        ctx.strokeStyle = "#d2bd98";
        ctx.lineWidth = 1;

        for (let x = 0; x < 800; x += 50) {
            for (let y = 0; y < 600; y += 50) {
                ctx.strokeRect(x, y, 50, 50);
            }
        }

        if (
            this.current?.interior === "restaurant"
        ) {
            this.drawRestaurant(ctx);
        } else {
            this.drawGenericInterior(ctx);
        }

        Player.draw(ctx);

        this.drawExit(ctx);
    },

    drawRestaurant(ctx) {
        // Restaurant counter.
        ctx.fillStyle = "#75452d";
        ctx.fillRect(260, 40, 330, 65);

        ctx.fillStyle = "#e6b76b";
        ctx.fillRect(270, 45, 310, 10);

        // Seller.
        this.drawPerson(ctx, 420, 90, "#c65e39");

        // Food pots.
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = "#45413a";
            ctx.beginPath();
            ctx.ellipse(
                300 + i * 75,
                65,
                23,
                15,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.fillStyle = "#df9d37";
            ctx.beginPath();
            ctx.arc(
                300 + i * 75,
                65,
                13,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Tables.
        this.drawTable(ctx, 140, 180);
        this.drawTable(ctx, 480, 180);
        this.drawTable(ctx, 140, 380);
        this.drawTable(ctx, 480, 380);

        // Restaurant sign.
        ctx.fillStyle = "#35241a";
        ctx.font = "bold 23px Arial";
        ctx.textAlign = "center";
        ctx.fillText("MAMA PUT", 400, 25);

        ctx.font = "13px Arial";
        ctx.fillText("Fresh Nigerian Meals", 400, 125);
    },

    drawTable(ctx, x, y) {
        // Table.
        ctx.fillStyle = "#81502e";
        ctx.fillRect(x, y, 120, 60);

        // Chairs.
        ctx.fillStyle = "#b64f36";
        ctx.fillRect(x - 18, y + 12, 13, 35);
        ctx.fillRect(x + 125, y + 12, 13, 35);

        ctx.fillRect(x + 35, y - 18, 35, 12);
        ctx.fillRect(x + 35, y + 65, 35, 12);
    },

    drawPerson(ctx, x, y, shirt) {
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(x, y - 12, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#bd825e";
        ctx.beginPath();
        ctx.arc(x, y - 10, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = shirt;
        ctx.fillRect(x - 10, y, 20, 23);
    },

    drawGenericInterior(ctx) {
        ctx.fillStyle = "#76543c";
        ctx.fillRect(120, 100, 560, 70);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            this.current?.name || "SHOP",
            400,
            65
        );

        ctx.fillStyle = "#ad8058";
        ctx.fillRect(250, 240, 300, 65);
    },

    drawExit(ctx) {
        ctx.fillStyle = "#397a4c";
        ctx.fillRect(350, 530, 100, 40);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";

        ctx.fillText("EXIT", 400, 555);
    },

    openShopMenu() {
        if (!this.active) return;

        if (this.current?.interior !== "restaurant") {
            Game.showMessage(
                "This shop's services are coming soon."
            );
            return;
        }

        let menu = document.getElementById("restaurant-menu");

        if (!menu) {
            menu = document.createElement("div");
            menu.id = "restaurant-menu";

            menu.innerHTML = `
                <div class="restaurant-panel">
                    <button id="close-food-menu">✕</button>
                    <h2>🍲 Mama Put</h2>
                    <p>Choose your meal</p>
                    <div id="food-items"></div>
                </div>
            `;

            document.body.appendChild(menu);

            document.getElementById("close-food-menu")
                .onclick = () => this.closeShopMenu();
        }

        const items = document.getElementById("food-items");

        items.innerHTML = this.meals.map((meal, index) => `
            <button class="food-item" data-index="${index}">
                <span>${meal.name}</span>
                <strong>₦${meal.price.toLocaleString("en-NG")}</strong>
            </button>
        `).join("");

        items.querySelectorAll(".food-item")
            .forEach(button => {
                button.onclick = () => {
                    this.buyMeal(
                        Number(button.dataset.index)
                    );
                };
            });

        menu.classList.add("visible");
    },

    buyMeal(index) {
        const meal = this.meals[index];

        if (!meal) return;

        if (Player.cash < meal.price) {
            Game.showMessage("Not enough money!");
            return;
        }

        Player.cash -= meal.price;
        Player.save();

        Game.updateHUD();

        Game.showMessage(
            `You purchased ${meal.name}! Enjoy your meal.`
        );

        this.closeShopMenu();
    },

    closeShopMenu() {
        const menu = document.getElementById(
            "restaurant-menu"
        );

        if (menu) menu.classList.remove("visible");
    },

    interact() {
        if (!this.active) return;

        const nearExit =
            Player.y > 500 &&
            Player.x > 320 &&
            Player.x < 480;

        if (nearExit) {
            this.exit();
            return;
        }

        if (
            this.current?.interior === "restaurant" &&
            Player.y < 150
        ) {
            this.openShopMenu();
            return;
        }

        Game.showMessage(
            "Move closer to the counter or exit."
        );
    }
};
