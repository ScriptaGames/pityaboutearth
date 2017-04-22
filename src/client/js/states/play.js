class PlayState extends Phaser.State {
    init({ playerRole=PlayerRoles.Humanity }={}) {
        console.log(`[play] playing as ${playerRole}`);
        this.playerRole = playerRole;
    }

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
        this.updateControls();

        if (this.isHumanity()) {
            this.updateBarrierRotation();
        }

        if (this.isUniverse()) {
            this.updateAttackPlacement();
        }
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
            placementAsteroid: this.createAsteroid(false),
            placementComet: this.createComet(false),
            asteroids: this.game.add.group(),
            comets: this.game.add.group(),
        };

        // these two are just used for attack placement, they shouldn't exist
        // until attack placement happens
        this.actors.placementAsteroid.exists = false;
        this.actors.placementAsteroid.alpha = 0.5;
        this.actors.placementComet.exists = false;
        this.actors.placementComet.alpha = 0.5;
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

        // DEBUG
        earth.inputEnabled = true;
        earth.events.onInputDown.add(() => this.sounds.Siren.play(), this);

        return earth;
    }

    createAsteroid(addToGroup=true) {
        const ast = this.game.add.sprite(20, 26, 'asteroid');
        ast.scale.set(10, 10);
        ast.anchor.set(0.5, 0.5);
        ast.bringToTop();

        if (addToGroup) {
            this.actors.asteroids.add(ast);
        }

        // DEBUG
        ast.inputEnabled = true;
        ast.events.onInputDown.add(() => this.sounds.AsteroidHit1.play(), this);

        return ast;
    }

    createComet(addToGroup=true) {
        const com = this.game.add.sprite(220, 26, 'comet');
        com.scale.set(10, 10);
        com.anchor.set(0.5, 0.5);
        com.bringToTop();

        if (addToGroup) {
            this.actors.comets.add(com);
        }

        // DEBUG
        com.inputEnabled = true;
        com.events.onInputDown.add(() => this.sounds.AsteroidHit2.play(), this);

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

    updateControls() {
        // console.log(`[play] mouse at ${this.game.input.mousePointer.x},${this.game.input.mousePointer.y}`);
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

    updateAttackPlacement() {
        const x = this.game.input.mousePointer.x;
        const y = this.game.input.mousePointer.y;
        if (this.game.input.mousePointer.justReleased()) {
            // now that mouse is released, figure out whether player had
            // asteroid or comet selected, and add it to the scene
            if (this.actors.placementAsteroid.exists) {
                const ast = this.createAsteroid();
                ast.position.copyFrom(this.game.input.mousePointer);
            }
            else if (this.actors.placementComet.exists) {
                const com = this.createComet();
                com.position.copyFrom(this.game.input.mousePointer);
            }

            // and disable both placement sprites until next time
            this.actors.placementAsteroid.exists = false;
            this.actors.placementComet.exists = false;
        }
        if (this.game.input.mousePointer.isDown) {
            console.log(`[play] place asteroid at ${x},${y}`);
            const timePressed = new Date().getTime() - this.game.input.mousePointer.timeDown;
            if (timePressed < config.COMET_PRESS_DELAY) {
                this.actors.placementAsteroid.exists = true;
                this.actors.placementAsteroid.position.copyFrom(this.game.input.mousePointer);
            }
            else {
                this.actors.placementAsteroid.exists = false;
                this.actors.placementComet.exists = true;
                this.actors.placementComet.position.copyFrom(this.game.input.mousePointer);
            }
        }
    }

    /* misc functions */

    playMusic() {
        this.sounds.PlayMusic.play();
    }

    isUniverse() {
        return this.playerRole === PlayerRoles.Universe;
    }

    isHumanity() {
        return this.playerRole === PlayerRoles.Humanity;
    }

}
