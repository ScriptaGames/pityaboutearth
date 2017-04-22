class PlayState extends Phaser.State {
    create() {
        console.log('[play] starting play state');
        this.createSounds();
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
