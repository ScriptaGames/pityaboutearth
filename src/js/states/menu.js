class MenuState extends Phaser.State {

    create() {
        console.log('[menu] showing main menu');

        window.menu = this;

        this.music = this.game.add.audio('MenuMusic', 0.7, true);
        this.music.play();

        const bg = this.game.add.sprite(0, 0, 'background');
        bg.tint = 0x3f3f3f;

        const logo = this.game.add.sprite(this.game.world.centerX, 120, 'logo');
        logo.anchor.set(0.5, 0);
        logo.scale.set(0.96, 0.96);

        this.fontSet = `! "#$%^'()* +,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_abcdefghijklmnopqrstuvwxyz{|}~`;

        this.story = [
            `Humanity, listen up. This is`,
            `the Univese. I am sick of`,
            `your incessant nosing about.`,
            `The incoming asteroid should`,
            `resolve matters.`,
            `       -- Yours, the Universe`,
            ``,
            `(Protect Earth while shuttles`,
            `ferry "repopulation experts"`,
            `to other, safer worlds)`,

            // `The universe, growing tired of`,
            // `Humanity's constant, tedious`,
            // `nosing about, is endeavoring`,
            // `to erase us.`,
            // ``,
            // `Protect Earth while escape pods`,
            // `shuttle "repopulation experts"`,
            // `to new worlds.`,


            // `Our planet is a lonely speck`,
            // `in the great enveloping cosmic`,
            // `dark.`,
            // ``,
            // `In our obscurity -- in all this`,
            // `vastness, there is no hint that`,
            // `help will come from elsewhere`,
            // `to save us.`,
            // ``,
            // `                  -- Carl Sagan`,
        ];

        const btnHum = this.game.add.button(
            this.game.world.centerX,
            this.game.world.height - 130,
            'btn-play',
            this.next,
            this,
            1, // over
            0, // out
            2  // down
        );
        btnHum.anchor.set(0.5, 1);
        btnHum.onDownSound = this.game.add.audio('ButtonTap');
        btnHum.onOverSound = this.game.add.audio('Barrier');

        if (config.SKIP_MENU) {
            this.next();
        }

        this.timeBetweenLines = 150;
        this.timePerChar = 40;
        this.lineHeight = 60;

        let acc = 0;
        this.story.forEach((line, i) => {
            this.game.time.events.add(i * this.timeBetweenLines + acc, () => {
                this.writeLine(line, i);
            }, this);
            acc += line.length * this.timePerChar
        });

        this.drawMissileHelp();
        this.drawBarrierHelp();

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

    drawBarrierHelp() {
        const x = -370;
        const y = 68;
        const barrier = this.game.add.sprite(this.game.world.centerX + x - 100, this.game.world.height - 670 + y, 'barrier');
        const font = this.game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
        const text = this.game.add.image(80, 80, font);
        text.scale.set(0.5,0.5);
        font.text = 'Barrier';
        text.tint = 0x777777;
        text.position.x = this.game.world.centerX + x;
        text.position.y = this.game.world.height - 608 + y;
    }

    drawMissileHelp() {
        const x = 140;
        const y = 40;
        const mouse = this.game.add.sprite(this.game.world.centerX - 44 + x, this.game.world.height - 600 + y, 'mouse');
        mouse.anchor.set(0.5, 0.5);

        const font = this.game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
        const text = this.game.add.image(80, 80, font);
        text.scale.set(0.5,0.5);
        font.text = 'Missile';
        text.tint = 0x777777;
        text.position.x = this.game.world.centerX + x;
        text.position.y = this.game.world.height - 608 + y;

    }

    writeLine(line, index) {
        const font = this.game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
        const text = this.game.add.image(80, 80, font);
        text.scale.set(0.5,0.5);
        font.text = '';
        // text.tint = 0x51B5E0;
        text.position.x = 60;
        text.position.y = index * this.lineHeight + 600;
        let i = 0;

        this.game.time.events.loop(this.timePerChar, () => {
            font.text = line.slice(0, i);
            i += 1;
        }, this);
    }

}
