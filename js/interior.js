const Interiors = {

    active: false,
    current: null,

    inventory: {},

    locations: {

        restaurant: {
            title: "Mama Put",
            counter: "FOOD COUNTER",

            items: [
                { name: "Jollof Rice", price: 2500 },
                { name: "Rice and Stew", price: 2000 },
                { name: "Beans and Bread", price: 1500 },
                { name: "Eba and Soup", price: 2000 },
                { name: "Amala and Ewedu", price: 2500 }
            ]
        },

        grocery: {
            title: "Provisions Store",
            counter: "CHECKOUT",

            items: [
                { name: "Bottled Water", price: 300 },
                { name: "Soft Drink", price: 500 },
                { name: "Biscuits", price: 400 },
                { name: "Bread", price: 1200 },
                { name: "Milk", price: 1500 },
                { name: "Instant Noodles", price: 700 }
            ]
        },

        supermarket: {
            title: "Lagos Mart",
            counter: "PAYMENT COUNTER",

            items: [
                { name: "Soft Drink Pack", price: 2500 },
                { name: "Cereal", price: 3500 },
                { name: "Cooking Oil", price: 2800 },
                { name: "Rice (Small Bag)", price: 9000 },
                { name: "Snacks Bundle", price: 1800 },
                { name: "Toiletries", price: 2200 }
            ]
        },

        barber: {
            title: "Fresh Cuts Barber Shop",
            counter: "BARBER",

            items: [
                { name: "Regular Haircut", price: 1500 },
                { name: "Premium Haircut", price: 3000 },
                { name: "Haircut and Beard", price: 4000 },
                { name: "Hair Treatment", price: 5000 }
            ]
        },

        pharmacy: {
            title: "City Pharmacy",
            counter: "PHARMACIST",

            items: [
                { name: "First Aid Kit", price: 3500 },
                { name: "Bandages", price: 800 },
                { name: "Antiseptic", price: 1200 },
                { name: "Vitamins", price: 2500 }
            ]
        },

        eatery: {
            title: "Lagos Eateries",
            counter: "ORDER HERE",

            items: [
                { name: "Chicken and Chips", price: 4500 },
                { name: "Shawarma", price: 3000 },
                { name: "Burger", price: 3500 },
                { name: "Pizza Slice", price: 2500 },
                { name: "Fried Rice", price: 3000 }
            ]
        },

        transport: {
            title: "Lagos Motor Park",
            counter: "TICKET COUNTER",

            items: [
                { name: "Local Bus Ticket", price: 1000 },
                { name: "City Taxi Ticket", price: 2500 },
                { name: "Intercity Ticket", price: 7000 }
            ]
        },

        office: {
            title: "Business Plaza",
            counter: "RECEPTION",

            items: [
                { name: "Employment Enquiries", price: 0 }
            ]
        },

        club: {
            title: "Lagos Nightlife",
            counter: "BAR",

            items: [
                { name: "Soft Drink", price: 1000 },
                { name: "Mocktail", price: 2500 },
                { name: "Club Entry", price: 3000 }
            ]
        }
    },

    enter(building) {

        if (!this.locations[building.interior]) {
            Game.showMessage("This location is unavailable.");
            return;
        }

        this.active = true;
        this.current = building;

        Player.x = 400;
        Player.y = 480;

        this.closeMenu();

        Game.cameraX = 0;
        Game.cameraY = 0;

        Player.save();

        Game.showMessage(
            `Welcome to ${this.locations[building.interior].title}!`
        );
    },

    exit() {

        if (!this.active) return;

        const building = this.current;

        this.active = false;
        this.current = null;

        this.closeMenu();

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

        return (
            x - halfW < 25 ||
            y - halfH < 25 ||
            x + halfW > 775 ||
            y + halfH > 575
        );
    },

    draw(ctx) {

        const type = this.current.interior;
        const location = this.locations[type];

        // Floor
        ctx.fillStyle = type === "club"
            ? "#242033"
            : "#e7d6b8";

        ctx.fillRect(0, 0, 800, 600);

        this.drawFloor(ctx, type);

        // Interior walls
        ctx.fillStyle = type === "club"
            ? "#413354"
            : "#b98e67";

        ctx.fillRect(0, 0, 800, 22);
        ctx.fillRect(0, 0, 22, 600);
        ctx.fillRect(778, 0, 22, 600);

        // Location title
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";

        ctx.fillText(location.title, 400, 48);

        // Main counter
        this.drawCounter(ctx, type, location.counter);

        // Furniture and displays
        this.drawFurniture(ctx, type);

        // NPC behind counter
        this.drawPerson(ctx, 400, 105, "#d28c66");

        // Player
        Player.draw(ctx);

        // Exit
        ctx.fillStyle = "#267d48";
        ctx.fillRect(350, 535, 100, 38);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Arial";
        ctx.fillText("EXIT", 400, 559);
    },

    drawFloor(ctx, type) {

        ctx.strokeStyle = type === "club"
            ? "#514466"
            : "#d1bd9a";

        ctx.lineWidth = 1;

        for (let x = 0; x < 800; x += 50) {
            for (let y = 0; y < 600; y += 50) {
                ctx.strokeRect(x, y, 50, 50);
            }
        }
    },

    drawCounter(ctx, type, label) {

        ctx.fillStyle = type === "club"
            ? "#714e9b"
            : "#81502e";

        ctx.fillRect(250, 75, 300, 65);

        ctx.fillStyle = "#e5b86c";
        ctx.fillRect(250, 75, 300, 9);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";

        ctx.fillText(label, 400, 160);
    },

    drawFurniture(ctx, type) {

        if (type === "restaurant" || type === "eatery") {

            [140, 480].forEach(x => {
                this.drawTable(ctx, x, 240);
                this.drawTable(ctx, x, 400);
            });

        } else if (
            type === "grocery" ||
            type === "supermarket" ||
            type === "pharmacy"
        ) {

            [80, 620].forEach(x => {

                ctx.fillStyle = "#90633f";

                ctx.fillRect(x, 190, 100, 280);

                for (let y = 210; y < 450; y += 65) {

                    ctx.fillStyle = "#d7a75c";
                    ctx.fillRect(x + 8, y, 84, 12);

                    ctx.fillStyle = "#5a9a75";
                    ctx.fillRect(x + 15, y - 17, 14, 17);

                    ctx.fillStyle = "#d65d4d";
                    ctx.fillRect(x + 40, y - 20, 18, 20);

                    ctx.fillStyle = "#e5c85c";
                    ctx.fillRect(x + 67, y - 15, 15, 15);
                }
            });

        } else if (type === "barber") {

            [230, 500].forEach(x => {

                ctx.fillStyle = "#555";

                ctx.fillRect(x, 250, 90, 100);

                ctx.fillStyle = "#b7d5d8";
                ctx.fillRect(x + 5, 180, 80, 60);

                ctx.fillStyle = "#8c5b3e";
                ctx.fillRect(x + 20, 260, 50, 60);
            });

        } else if (type === "club") {

            // Dance floor
            ctx.fillStyle = "#44345e";
            ctx.fillRect(200, 200, 400, 260);

            // DJ booth
            ctx.fillStyle = "#9c59c9";
            ctx.fillRect(310, 180, 180, 50);

            ctx.fillStyle = "#fff";
            ctx.font = "bold 15px Arial";
            ctx.fillText("DJ BOOTH", 400, 210);

            // Tables
            this.drawTable(ctx, 100, 300);
            this.drawTable(ctx, 610, 300);

        } else if (type === "office") {

            ctx.fillStyle = "#79553c";
            ctx.fillRect(180, 250, 440, 100);

            ctx.fillStyle = "#e6c99a";
            ctx.fillRect(200, 265, 400, 12);

        } else if (type === "transport") {

            ctx.fillStyle = "#79553c";
            ctx.fillRect(100, 240, 600, 80);

            ctx.fillStyle = "#f4d17b";
            ctx.fillRect(100, 240, 600, 12);

            ctx.fillStyle = "#fff";
            ctx.fillText("TICKET OFFICE", 400, 285);
        }
    },

    drawTable(ctx, x, y) {

        ctx.fillStyle = "#80502f";
        ctx.fillRect(x, y, 120, 55);

        ctx.fillStyle = "#ad543c";

        ctx.fillRect(x - 15, y + 10, 12, 35);
        ctx.fillRect(x + 123, y + 10, 12, 35);
    },

    drawPerson(ctx, x, y, shirt) {

        ctx.fillStyle = "#bd825e";

        ctx.beginPath();
        ctx.arc(x, y - 10, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = shirt;
        ctx.fillRect(x - 12, y, 24, 24);
    },

    interact() {

        if (!this.active) return;

        // Exit area
        if (
            Player.y > 510 &&
            Player.x > 320 &&
            Player.x < 480
        ) {
            this.exit();
            return;
        }

        // Service counter
        if (
            Player.y < 195 &&
            Player.x > 280 &&
            Player.x < 520
        ) {
            this.openMenu();
            return;
        }

        Game.showMessage(
            "Approach the counter or exit to continue."
        );
    },

    openMenu() {

        const location = this.locations[
            this.current.interior
        ];

        let menu = document.getElementById("shop-menu");

        if (!menu) {

            menu = document.createElement("div");

            menu.id = "shop-menu";

            menu.innerHTML = `
                <div class="shop-panel">

                    <button id="shop-close">✕</button>

                    <h2 id="shop-title"></h2>

                    <p>Available services and products</p>

                    <div id="shop-items"></div>

                </div>
            `;

            document.body.appendChild(menu);

            document.getElementById("shop-close")
                .onclick = () => this.closeMenu();
        }

        document.getElementById("shop-title")
            .textContent = location.title;

        const items = document.getElementById("shop-items");

        items.innerHTML = location.items.map((item, index) => `
            <button class="shop-item" data-index="${index}">

                <span>${item.name}</span>

                <strong>
                    ${item.price === 0
                        ? "FREE"
                        : "₦" + item.price.toLocaleString("en-NG")}
                </strong>

            </button>
        `).join("");

        items.querySelectorAll(".shop-item")
            .forEach(button => {

                button.onclick = () => {

                    this.purchase(
                        Number(button.dataset.index)
                    );

                };
            });

        menu.classList.add("visible");
    },

    purchase(index) {

        const location = this.locations[
            this.current.interior
        ];

        const item = location.items[index];

        if (!item) return;

        if (Player.cash < item.price) {

            Game.showMessage("Insufficient funds!");

            return;
        }

        if (
            this.current.interior === "office" &&
            item.price === 0
        ) {

            Game.showMessage(
                "Employment services are coming soon!"
            );

            return;
        }

        Player.cash -= item.price;

        this.inventory[item.name] =
            (this.inventory[item.name] || 0) + 1;

        Player.save();

        Game.updateHUD();

        Game.showMessage(
            `You purchased ${item.name}!`
        );

        this.closeMenu();
    },

    closeMenu() {

        const menu = document.getElementById("shop-menu");

        if (menu) {
            menu.classList.remove("visible");
        }
    }
};
