class PlayState extends Phaser.State {
    create() {
        console.log('[play] starting play state');

        // for easy access to this state for debugging in browser console
        window.play = this;

        this.createBackground();
        this.createSounds();

        this.createActors();

        this.playMusic();
    }

    update() {
        this.updateCollisions();
        this.updateBarrierRotation();
    }

    render() {
        this.game.debug.body(this.actors.earth);
        this.game.debug.body(this.actors.barrier);
    }

    shutdown() {
    }

    /* create functions */

    createActors() {
        this.actors = {
            earth: this.createEarth(),
            barrier: this.createBarrier(),
            asteroids: this.game.add.group(),
            comets: this.game.add.group(),
        };

    }

    createSounds() {
        this.sounds = {
            AsteroidHit2 : this.game.add.audio('AsteroidHit2'),
            AsteroidHit1 : this.game.add.audio('AsteroidHit1'),
            ButtonTap    : this.game.add.audio('ButtonTap'),
            Random       : this.game.add.audio('Random'),
            Siren        : this.game.add.audio('Siren'),
            PlayMusic    : this.game.add.audio('PlayMusic'),
        };
    }

    createBackground() {
        const bg = this.game.add.sprite(0, 0, 'background');
        return bg;
    }

    createEarth() {
        console.log('[play] creating earth');
        const earth = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'earth');

        this.game.physics.arcade.enableBody(earth);
        earth.body.setCircle(earth.width / 2);
        earth.body.immovable = true;

        earth.anchor.set(0.5, 0.5);
        // DEBUG
        earth.inputEnabled = true;
        earth.events.onInputDown.add(() => this.sounds.Siren.play(), this);

        return earth;
    }

    createAsteroid(addToGroup=true) {
        const ast = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 300, 'asteroid');
        ast.anchor.set(0.5, 0.5);
        ast.bringToTop();

        this.game.physics.arcade.enableBody(ast);
        ast.body.velocity.y = 100;

        if (addToGroup) {
            this.actors.asteroids.add(ast);
        }

        // DEBUG
        ast.inputEnabled = true;

        return ast;
    }

    createComet(addToGroup=true) {
        const com = this.game.add.sprite(220, 26, 'comet');
        // com.scale.set(10, 10);
        com.anchor.set(0.5, 0.5);
        com.bringToTop();

        if (addToGroup) {
            this.actors.comets.add(com);
        }

        // DEBUG
        com.inputEnabled = true;

        return com;
    }

    createBarrier() {
        const barrier = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'barrier');
        // barrier.scale.set(10, 10);
        barrier.anchor.set(0.5, 0.5);
        return barrier;
    }

    /* update functions */

    updateCollisions() {
        this.game.physics.arcade.collide(this.actors.earth, this.actors.asteroids, null, this.asteroidStrike, this);
        this.game.physics.arcade.collide(this.actors.earth, this.actors.comets, null, this.cometStrike, this);
    }

    updateBarrierRotation() {
        const x = this.game.input.mousePointer.x - this.actors.barrier.position.x;
        const y = this.game.input.mousePointer.y - this.actors.barrier.position.y;
        let angle = -1 * Math.atan(x/y) + 2*Math.PI;
        if (y > 0) {
            angle += Math.PI;
        }
        this.actors.barrier.rotation = angle;
    }

    /* misc functions */

    asteroidStrike(earth, asteroid) {
        console.log('[play] asteroid strike');
        this.sounds.AsteroidHit1.play();
        asteroid.destroy();
    }

    cometStrike() {
        console.log('[play] comet strike');
        this.sounds.AsteroidHit2.play();
    }

    playMusic() {
        this.sounds.PlayMusic.fadeIn(300);
    }
}
