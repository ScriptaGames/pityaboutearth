class MenuState extends Phaser.State {

    create() {
        console.log('[menu] showing main menu');
        this.music = this.game.add.audio('MenuMusic');
        this.music.play();
        this.game.time.events.add(5000, this.next, this);
    }

    next() {
        this.game.stateTransition.to('PlayState');
    }

    shutdown() {
        this.music.stop();
    }
}
