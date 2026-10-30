const World = {
    width: 2400,
    height: 1800,

    buildings: [
        {
            x: 100, y: 100, width: 220, height: 150,
            name: "MAMA PUT",
            color: "#d9b68a",
            enterable: true,
            interior: "restaurant",
            entranceX: 210,
            entranceY: 275,
        },
        {
            x: 390, y: 100, width: 190, height: 150,
            name: "PROVISIONS",
            color: "#e5ce8c"
        },
        {
            x: 100, y: 350, width: 210, height: 160,
            name: "BARBER SHOP",
            color: "#d3a58a"
        },
        {
            x: 390, y: 350, width: 200, height: 160,
            name: "LAGOS MART",
            color: "#d9c28e"
        },
        {
            x: 900, y: 100, width: 280, height: 180,
            name: "BUSINESS PLAZA",
            color: "#b8c6b4"
        },
        {
            x: 900, y: 360, width: 300, height: 170,
            name: "MOTOR PARK",
            color: "#c6b39a"
        },
        {
            x: 1450, y: 100, width: 250, height: 170,
            name: "EATERIES",
            color: "#d9ad7f"
        },
        {
            x: 1450, y: 370, width: 250, height: 170,
            name: "PHARMACY",
            color: "#b9d3ae"
        }
    ],

    jobs: [
        {
            x: 740,
            y: 700,
            name: "Delivery Job",
            reward: 2500,
            completed: false
        }
    ],

    isBlocked(x, y, player) {
        const halfW = player.width / 2;
        const halfH = player.height / 2;

        if (
            x - halfW < 0 ||
            y - halfH < 0 ||
            x + halfW > this.width ||
            y + halfH > this.height
        ) {
            return true;
        }

        return this.buildings.some(building => {
            return (
                x + halfW > building.x &&
                x - halfW < building.x + building.width &&
                y + halfH > building.y &&
                y - halfH < building.y + building.height
            );
        });
    },

    draw(ctx, camera, canvas) {
        // Ground
        ctx.fillStyle = "#b4c69a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();

        ctx.translate(-camera.x, -camera.y);

        // Decorative grass details
        ctx.fillStyle = "#a4b88c";

        for (let x = 20; x < this.width; x += 80) {
            for (let y = 20; y < this.height; y += 80) {
                ctx.fillRect(x, y, 3, 3);
            }
        }

        // Main horizontal road
        ctx.fillStyle = "#737b77";
        ctx.fillRect(0, 600, this.width, 110);

        // Road markings
        ctx.strokeStyle = "#eee0a7";
        ctx.lineWidth = 3;
        ctx.setLineDash([30, 25]);

        ctx.beginPath();
        ctx.moveTo(0, 655);
        ctx.lineTo(this.width, 655);
        ctx.stroke();

        ctx.setLineDash([]);

        // Main vertical road
        ctx.fillStyle = "#737b77";
        ctx.fillRect(650, 0, 100, this.height);

        ctx.strokeStyle = "#eee0a7";
        ctx.lineWidth = 3;
        ctx.setLineDash([30, 25]);

        ctx.beginPath();
        ctx.moveTo(700, 0);
        ctx.lineTo(700, this.height);
        ctx.stroke();

        ctx.setLineDash([]);

        // Buildings
        this.buildings.forEach(building => {
            // Shadow
            ctx.fillStyle = "#8b967f";

            ctx.fillRect(
                building.x + 7,
                building.y + 7,
                building.width,
                building.height
            );

            // Building body
            ctx.fillStyle = building.color;

            ctx.fillRect(
                building.x,
                building.y,
                building.width,
                building.height
            );

            // Roof border
            ctx.fillStyle = "#796a53";

            ctx.fillRect(
                building.x,
                building.y,
                building.width,
                8
            );

            // Windows
            ctx.fillStyle = "#819f9b";

            for (
                let x = building.x + 20;
                x < building.x + building.width - 15;
                x += 45
            ) {
                ctx.fillRect(
                    x,
                    building.y + 25,
                    24,
                    25
                );
            }

            // Door
            ctx.fillStyle = "#705540";

            ctx.fillRect(
                building.x + building.width / 2 - 12,
                building.y + building.height - 35,
                24,
                35
            );

            // Building name
            ctx.fillStyle = "#272c24";
            ctx.font = "bold 13px Arial";
            ctx.textAlign = "center";

            ctx.fillText(
                building.name,
                building.x + building.width / 2,
                building.y + building.height - 45
            );
        });

        // Job markers
        this.jobs.forEach(job => {
            if (job.completed) return;

            const pulse = 20 + Math.sin(Date.now() / 180) * 4;

            ctx.fillStyle = "rgba(245, 205, 58, 0.25)";
            ctx.beginPath();

            ctx.arc(job.x, job.y, pulse + 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#f5cd3a";
            ctx.beginPath();

            ctx.arc(job.x, job.y, pulse / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#292516";
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";

            ctx.fillText("₦", job.x, job.y + 5);
        });

        ctx.restore();
    }
};
