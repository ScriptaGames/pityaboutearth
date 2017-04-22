class MenuState extends Phaser.State {

    create() {
        console.log('[menu] showing main menu');
        this.music = this.game.add.audio('MenuMusic');
        this.music.play();

        this.scoreText = game.add.text(game.world.centerX, 4, "MAIN MENU", { fill: "#ffffff", align: "center" });
        this.scoreText.fontSize = 124;
        this.scoreText.anchor.set(0.5, 0);

        this.game.time.events.add(4000, this.next, this);
    }

    next() {
        this.game.stateTransition.to('PlayState');
    }

    shutdown() {
        this.music.stop();
    }
}
