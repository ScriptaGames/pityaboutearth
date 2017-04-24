class MenuState extends Phaser.State {

    create() {
        console.log('[menu] showing main menu');

        window.menu = this;

        this.music = this.game.add.audio('MenuMusic');
        this.music.play();

        const bg = this.game.add.sprite(0, 0, 'background');
        bg.tint = 0x3f3f3f;

        // const logo = this.game.add.sprite(this.game.world.centerX, 300, 'logo');
        // logo.anchor.set(0.5, 0);

        const fontSet = `! "#$%^'()* +,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_abcdefghijklmnopqrstuvwxyz{|}~`;
        this.font = game.add.retroFont('gelatin-font', 70, 110, fontSet, 18, 0, 0);
        this.text = this.game.add.image(80, 80, this.font);
        this.text.scale.set(0.5,0.5);
        this.font.text = '';
        this.text.tint = 0x65b219;

        this.i = 0;

        this.story = `Pity about Earth...`;

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

    update() {
        this.i += 1;

        this.font.text = this.story.slice(0, this.i);
    }

    next() {
        this.game.stateTransition.to('PlayState');
    }

    shutdown() {
        this.music.stop();
    }

}
