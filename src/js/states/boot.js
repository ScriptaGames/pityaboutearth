class BootState extends Phaser.State {
    create() {
        console.log('[boot] booting');
        this.state.start('PreloadState');

        // resize the canvas to fit the screen
        this.game.scale.maxWidth = config.CANVAS_WIDTH;
        this.game.scale.maxHeight = config.CANVAS_HEIGHT;
        this.updateCanvasSize();
        window.addEventListener('resize', this.updateCanvasSize.bind(this));

        // Phaser will automatically pause if the browser tab the game is in
        // loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        // Initialize the state transition library
        this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);

        this.game.stateTransition.configure({
            duration: 0.618 * Phaser.Timer.SECOND,
            ease: Phaser.Easing.Exponential.Out,
            properties: {
                alpha: 0,
            },
        });
    }

    updateCanvasSize() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.updateLayout();
        console.log(`[boot] resized canvas`);
    }
}
