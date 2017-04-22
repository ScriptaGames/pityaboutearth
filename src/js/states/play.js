class PlayState extends Phaser.State {
    create() {
        console.log('[play] starting play state');

        window.play = this;

        this.createSounds();
        this.createBackground();
        this.createEarth();
        this.createAsteroid();
        this.createComet();
        this.createBarrier();

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
    }

    createEarth() {
        this.earth = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'earth');
        this.earth.scale.set(10, 10);
        this.earth.anchor.set(0.5, 0.5);
    }

    createAsteroid() {
        const ast = this.game.add.sprite(20, 26, 'asteroid');
        ast.scale.set(10, 10);
    }

    createComet() {
        const com = this.game.add.sprite(220, 26, 'comet');
        com.scale.set(10, 10);
    }

    createBarrier() {
        this.barrier = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'barrier');
        this.barrier.scale.set(10, 10);
        this.barrier.anchor.set(0.5, 0.5);
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
