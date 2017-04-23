class MenuState extends Phaser.State {

    create() {
        console.log('[menu] showing main menu');

        this.music = this.game.add.audio('MenuMusic');
        this.music.play();

        const bg = this.game.add.sprite(0, 0, 'background');
        bg.tint = 0x3f3f3f;

        this.scoreText = game.add.text(game.world.centerX, 4, "MAIN MENU", { fill: "#ffffff", align: "center" });
        this.scoreText.fontSize = 124;
        this.scoreText.anchor.set(0.5, 0);

        const btnHum = game.add.button(
            game.world.centerX - 160,
            game.world.height - 80,
            'btn-play',
            this.next,
            this
        );
        btnHum.anchor.set(0.5, 1);

        if (config.SKIP_MENU) {
            this.next();
        }

    }

    next() {
        this.game.stateTransition.to('PlayState');
    }

    shutdown() {
        this.music.stop();
    }

    story() {
        return `There is nowhere else, at least in the near future, to which our species could migrate... Like it or not, for the moment the Earth is where we make our stand.`;
    }
}
