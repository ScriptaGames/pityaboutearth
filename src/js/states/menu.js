class MenuState extends Phaser.State {

    create() {
        console.log('[menu] showing main menu');

        window.menu = this;

        this.music = this.game.add.audio('MenuMusic');
        this.music.play();

        const bg = this.game.add.sprite(0, 0, 'background');
        bg.tint = 0x3f3f3f;

        const logo = this.game.add.sprite(this.game.world.centerX, 166, 'logo');
        logo.anchor.set(0.5, 0);

        this.fontSet = `! "#$%^'()* +,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_abcdefghijklmnopqrstuvwxyz{|}~`;

        this.story = [
            `Our planet is a lonely speck`,
            `in the great enveloping cosmic`,
            `dark.`,
            ``,
            `In our obscurity -- in all this`,
            `vastness, there is no hint that`,
            `help will come from elsewhere`,
            `to save us.`,
            ``,
            `                  -- Carl Sagan`,
        ];

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

        this.timeBetweenLines = 400;
        this.timePerChar = 48;

        let acc = 0;
        this.story.forEach((line, i) => {
            this.game.time.events.add(i * this.timeBetweenLines + acc, () => {
                this.writeLine(line, i);
            }, this);
            acc += line.length * this.timePerChar
        });

    }

    update() {
    }

    next() {
        this.game.stateTransition.to('PlayState');
    }

    shutdown() {
        this.music.stop();
    }

    getLine(index) {
        return this.story[i];
    }

    writeLine(line, index) {
        const font = game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
        const text = this.game.add.image(80, 80, font);
        text.scale.set(0.5,0.5);
        font.text = '';
        text.tint = 0x51B5E0;
        text.position.x = 40;
        text.position.y = index * 80 + 600;
        let i = 0;

        this.game.time.events.loop(this.timePerChar, () => {
            font.text = line.slice(0, i);
            i += 1;
        }, this);
    }

}
