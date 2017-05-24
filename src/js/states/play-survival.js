class PlaySurvivalState extends PlayState {
    beginGame() {
        // here's the big one text!
        this.game.time.events.add(800, () => {
            const bigOne = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 400, 'big-one');
            bigOne.alpha = 0;
            bigOne.anchor.set(0.5, 1);
            this.game.add
                .tween(bigOne)
                .to( { alpha: 1.0, },
                    1200,
                    Phaser.Easing.Quadratic.In,
                    true,
                    0,
                    0,
                    true
                );
        });
        // Create single asteroid to start the game ("The Big One")
        this.game.time.events.add(1400, () => {
            const ast = this.createAsteroid();
            ast.position.set(this.game.world.centerX, -200);
            ast.body.velocity.set(0, 200);
        });
        this.game.time.events.add(8000, () => {
            const dots = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 400, 'dots');
            dots.anchor.set(0.5, 1);
            dots.alpha = 0;
            this.game.add
                .tween(dots)
                .to( { alpha: 1.0, },
                    1200,
                    Phaser.Easing.Quadratic.In,
                    true, 0, 0, true
                );
        });
        this.game.time.events.add(11000, () => {
            const uhoh = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 400, 'uh-oh');
            uhoh.alpha = 0;
            uhoh.anchor.set(0.5, 1);
            this.game.add
                .tween(uhoh)
                .to( { alpha: 1.0, },
                    1200,
                    Phaser.Easing.Quadratic.In,
                    true, 0, 0, true
                );
        });

        this.game.time.events.add(10300, () => {
            if (config.STRAYS_ENABLED) {
                this.game.time.events.add(config.RATE_CREATE_ASTEROID, this.singleAsteroidLoop, this);
                this.game.time.events.add(config.RATE_CREATE_COMET, this.singleCometLoop, this);
            }
            this.game.time.events.loop(config.RATE_RAISE_DIFFICULTY, () => this.stats.difficulty += config.DIFFICULTY_INCREASE_RATE, this); // Increase the difficulty
            this.game.time.events.add(2000, this.fireBarrage.bind(this), this);
        }, this);
        this.game.time.events.add(13300, () => {
            this.game.time.events.loop(config.RATE_LAUNCH_TRANSPORT, this.launchTransport, this);
        }, this);
    }
}
