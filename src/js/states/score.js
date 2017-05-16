class ScoreState extends Phaser.State {

    init({ stats, music }) {
        this.stats = stats;
        this.previousMusic = music;
    }
    create() {
        console.log('[score] showing score menu');

        window.menu = this;

        this.music = this.game.add.audio('VictoryMusic', 0.7, true);

        const bg = this.game.add.sprite(0, 0, 'background');
        bg.tint = 0x3f3f3f;
        bg.alpha = 0.6;

        const logo = this.game.add.sprite(this.game.world.centerX, 120, 'logo');
        logo.anchor.set(0.5, 0);
        logo.scale.set(0.96, 0.96);

        this.fontSet = `! "#$%^'()* +,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_abcdefghijklmnopqrstuvwxyz{|}~`;

        const score = this.stats.transportsLaunched * 1000;
        const hiscore = JSON.parse(localStorage.hiscore || '0');

        localStorage.hiscore = Math.max(hiscore, score);

            console.log(`[play] score is ${score}`);
        if (score > hiscore) {
            console.log(`[play] ${score} > ${hiscore}, new HISCORE!!!`);
        }
        else {
            console.log(`[play] hiscore is still ${hiscore}`);
        }

        if (this.stats.transportsLaunched === 0) {
            this.story = [
                `Really, you saved ZERO`,
                `people?  You monster.`,
            ];
        }
        else if (this.stats.transportsLaunched < 20) {
            this.story = [
                `You saved ${score}`,
                `people... that's not nearly`,
                `enough to repopulate the`,
                `species.`,
                ``,
                `Humanity is doomed.`,
                ``,
                `"Job well done!" -- Universe`,
            ];
        }
        else if (this.stats.transportsLaunched >= 45) {
            this.previousMusic.fadeOut(100);
            this.music.fadeIn(100, true);
            this.story = [
                `WOW, you saved ${score}`,
                `people!!!  Humanity survives!`,
            ];
        }
        else {
            this.music.play();
            this.previousMusic.fadeOut(100);
            this.music.fadeIn(100, true);
            this.story = [
                `Well done, you saved ${score}`,
                `people.  Humanity is probably`,
                `still doomed, but will have`,
                `a good time with the`,
                `repopulation effort.`,

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
        }

        const btnHum = game.add.button(
            game.world.centerX,
            game.world.height - 130,
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
        btnHum.input.useHandCursor = false;

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

    }

    next() {
        this.game.stateTransition.to('PlayState');
    }

    shutdown() {
        this.music.stop();
        this.previousMusic.stop();
    }

    getLine(index) {
        return this.story[i];
    }

    writeLine(line, index) {
        const font = game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
        const text = this.game.add.image(80, 80, font);
        text.scale.set(0.5,0.5);
        font.text = '';
        // text.tint = 0x51B5E0;
        text.position.x = this.game.world.centerX - 490;
        text.position.y = index * this.lineHeight + 636;
        let i = 0;

        this.game.time.events.loop(this.timePerChar, () => {
            font.text = line.slice(0, i);
            i += 1;
        }, this);
    }

}
