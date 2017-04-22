class SearchingState extends Phaser.State {
    init({ music }) {
        this.music = music;
    }
    create() {
        console.log('[searching] searching for opponent');

        const bg = this.game.add.sprite(0, 0, 'background');
        bg.scale.set(10, 10);
        bg.tint = 0x3f3f3f;

        this.scoreText = game.add.text(
            game.world.centerX,
            4,
            `Searching for opponent...\n(DEBUG: choose a side)`,
            { fill: "#ffffff", align: "center" }
        );
        this.scoreText.fontSize = 64;
        this.scoreText.anchor.set(0.5, 0);

        // this.game.time.events.add(5000, () => this.next(PlayerRoles.Humanity), this);

        const btnHum = game.add.button(
            game.world.centerX - 160,
            game.world.height - 80,
            'btn-humanity',
            () => this.next(PlayerRoles.Humanity),
            this
        );
        btnHum.anchor.set(0.5, 1);
        btnHum.scale.set(4, 4);

        const btnUni = game.add.button(
            game.world.centerX + 160,
            game.world.height - 80,
            'btn-universe',
            () => this.next(PlayerRoles.Universe),
            this
        );
        btnUni.anchor.set(0.5, 1);
        btnUni.scale.set(4, 4);
    }

    next(playerRole) {
        this.game.stateTransition.to('PlayState', true, false, { playerRole });
    }

    shutdown() {
        this.music.stop();
    }
}
