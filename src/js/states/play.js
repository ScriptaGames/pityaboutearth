class PlayState extends Phaser.State {
    create(playerRole='Humanity') {
        console.log('[play] starting play state');

        window.play = this;

        this.createBackground();
        this.createSounds();

        this.createActors();

        this.playMusic();
    }

    update() {
        this.updateCollisions();
    }

    render() {
        // for (const block of this.capturedBlocks) {
        //     this.game.debug.body(block);
        // }
        // for (const block of this.blockSprites) {
        //     this.game.debug.body(block);
        // }
        // this.game.debug.body(this.portalIn);
    }

    shutdown() {
    }

    /* create functions */

    createActors() {
        this.actors = {
            earth: this.createEarth(),
            barrier: this.createBarrier(),
            // comet and asteroid only populated here for testing
            comets: [this.createComet()],
            asteroids: [this.createAsteroid()],
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
        bg.scale.set(10, 10);
        return bg;
    }

    createEarth() {
        console.log('[play] creating earth');
        const earth = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'earth');
        earth.scale.set(10, 10);
        earth.anchor.set(0.5, 0.5);
        return earth;
    }

    createAsteroid() {
        const ast = this.game.add.sprite(20, 26, 'asteroid');
        ast.scale.set(10, 10);
        return ast;
    }

    createComet() {
        const com = this.game.add.sprite(220, 26, 'comet');
        com.scale.set(10, 10);
        return com;
    }

    createBarrier() {
        const barrier = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'barrier');
        barrier.scale.set(10, 10);
        barrier.anchor.set(0.5, 0.5);
        return barrier;
    }

    /* update functions */

    updateCollisions() {
        // this.game.physics.arcade.collide(this.portalIn, this.blockSprites, null, this.blockOverlap, this);
        // this.game.physics.arcade.collide(this.fallingVuln, [this.leftWall, this.rightWall]);
        // this.game.physics.arcade.collide(this.portalIn, [this.leftWall, this.rightWall]);
        // this.game.physics.arcade.collide(this.well, this.capturedBlocks, null, this.blockSplash, this);
    }

    /* misc functions */

    playMusic() {
        this.sounds.PlayMusic.play();
    }

}
