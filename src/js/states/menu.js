class MenuState extends Phaser.State {

    create() {
        console.log('[splash] showing main menu');
        this.next();
    }

    next() {
        this.game.stateTransition.to('PlayState');
    }
}
