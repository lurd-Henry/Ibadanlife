const Missions = {
    current: {
        title: "Your First Day in Lagos",

        description:
            "Find the yellow marker and complete your first delivery.",

        completed: false
    },

    interact() {
        const job = World.jobs.find(
            item => !item.completed
        );

        if (!job) {
            UI.notify(
                "You've completed every available job. More missions are coming."
            );

            return;
        }

        const distance = Math.hypot(
            Player.x - job.x,
            Player.y - job.y
        );

        if (distance > 65) {
            UI.notify(
                "Move closer to the yellow job marker to interact."
            );

            return;
        }

        job.completed = true;

        Player.cash += job.reward;
        Player.respect += 10;

        this.current.completed = true;

        this.current.title = "Delivery Completed!";

        this.current.description =
            `You earned ₦${job.reward.toLocaleString("en-NG")} and 10 respect.`;

        UI.notify(
            `Mission complete! ₦${job.reward.toLocaleString("en-NG")} added to your balance.`
        );

        UI.update();
    }
};
