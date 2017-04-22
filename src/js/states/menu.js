class MenuState extends Phaser.State {

    create() {
        console.log('[menu] showing main menu');
        this.music = this.game.add.audio('MenuMusic');
        this.music.play();

        const bg = this.game.add.sprite(0, 0, 'background');
        bg.scale.set(10, 10);
        bg.tint = 0x3f3f3f;

        this.scoreText = game.add.text(game.world.centerX, 4, "MAIN MENU", { fill: "#ffffff", align: "center" });
        this.scoreText.fontSize = 124;
        this.scoreText.anchor.set(0.5, 0);

        this.game.time.events.add(0, this.next, this);
    }

    next() {
        this.game.stateTransition.to('PlayState');
    }

    shutdown() {
        this.music.stop();
    }
}
