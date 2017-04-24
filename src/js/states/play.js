class PlayState extends Phaser.State {
    create() {
        console.log('[play] starting play state');

        // for easy access to this state for debugging in browser console
        window.play = this;

        this.createBackground();
        this.createSounds();
        this.createStats();

        this.createActors();
        this.generateTransportSpawnPoints();
        this.createMissileLauncher();

        this.playMusic();

        this.game.time.events.loop(1000, this.createAsteroid, this);
        this.game.time.events.loop(5000, this.createComet, this);
        this.game.time.events.loop(20000, this.createBarrageEvent, this);
        this.game.time.events.loop(5000, this.launchTransport, this);

    }

    update() {
        this.updateCelestials();
        this.updateCollisions();
        this.updateBarrierRotation();
    }

    render() {
        // this.game.debug.body(this.actors.earth);
        // this.game.debug.body(this.actors.barrier);
        // this.actors.asteroids.forEach(this.game.debug.body.bind(this.game.debug));
        // this.actors.comets.forEach(this.game.debug.body.bind(this.game.debug));
        // this.actors.booms.forEach(this.game.debug.body.bind(this.game.debug));
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
            missiles: this.game.add.group(),
            booms: this.game.add.group(),
            transports: this.game.add.group(),
        };

    }

    createStats() {
        this.stats = {
            asteroidStrikes     : 0,
            cometStrikes        : 0,
            missilesFired       : 0,
            deflections         : 0,
            transportsLaunched  : 0,
            transportsEscaped   : 0,
            transportsDestroyed : 0,
            celestialsDestroyed : 0,
        };
    }

    createMissileLauncher() {
        this.game.input.onDown.add(_.throttle(this.fireMissile, config.MISSILE_INTERVAL), this);
    }

    createSounds() {
        this.sounds = {
            AsteroidHit1     : this.game.add.audio('AsteroidHit1'),
            AsteroidHit2     : this.game.add.audio('AsteroidHit2'),
            ButtonTap        : this.game.add.audio('ButtonTap'),
            DropExplosion    : this.game.add.audio('DropExplosion'),
            MissileExplosion : this.game.add.audio('MissileExplosion'),
            EscapeLaunch2    : this.game.add.audio('EscapeLaunch2'),
            EscapeLaunch     : this.game.add.audio('EscapeLaunch'),
            Random           : this.game.add.audio('Random'),
            Random2          : this.game.add.audio('Random2'),
            Random3          : this.game.add.audio('Random3'),
            Random4          : this.game.add.audio('Random4'),
            Random5          : this.game.add.audio('Random5'),
            Random6          : this.game.add.audio('Random6'),
            Siren            : this.game.add.audio('Siren'),
            Barrier          : this.game.add.audio('Barrier'),

            PlayMusic    : this.game.add.audio('PlayMusic'),
        };
    }

    createBackground() {
        return this.game.add.sprite(0, 0, 'background');
    }

    createEarth() {
        console.log('[play] creating earth');
        const earth = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'earth');

        this.game.physics.arcade.enableBody(earth);
        earth.body.setCircle(earth.width / 2);
        earth.body.immovable = true;

        earth.anchor.set(0.5, 0.5);

        return earth;
    }

    createAsteroid() {
        return this.createCelestial('asteroid');
    }

    createComet() {
        return this.createCelestial('comet');
    }

    createCelestial(type) {
        let frameRange;
        let group;
        switch (type.toLowerCase()) {
            case 'asteroid':
                frameRange = 4;
                group = this.actors.asteroids;
                break;
            case 'comet':
                frameRange = 2;
                group = this.actors.comets;
                break;
            default:
                frameRange = 4;
                group = this.actors.asteroids;
        }

        let point = this.getRandomOffscreenPoint();
        const celestial = this.game.add.sprite(point.x, point.y, type + '-sheet', Math.floor(Math.random()*frameRange));
        celestial.anchor.set(0.5, 0.5);
        celestial.bringToTop();

        this.game.physics.arcade.enableBody(celestial);
        celestial.body.setCircle(celestial.width / 2);
        celestial.body.velocity.set(Math.random() * 40, Math.random() * 40);
        celestial.body.angularVelocity = 2*(12 * Math.random() - 6);

        group.add(celestial);

        return celestial;
    }

    createBarrageEvent(count=60, radius=1200) {
        // play the siren, wait a bit, then launch the barrage
        this.sounds.Siren.play();

        this.game.time.events.add(config.BARRANGE_WARNING_TIME, () => this.createBarrage(count, radius), this);
    }

    createBarrage(count=60, radius=1200) {
        let x, y;
        let angle = 360 / count;

        this.sounds.Siren.play();

        // spawn asteroids in a circle
        for (let i = 0; i < 360; i += angle) {
            x = this.game.world.centerX + radius * Math.cos(i);
            y = this.game.world.centerY + radius * Math.sin(i);

            let ast = this.createAsteroid();
            ast.position.x = x;
            ast.position.y = y;

            // set initial velocity
            let direction = Phaser.Point.subtract(this.actors.earth.position, ast.position);

            direction.normalize();
            direction.multiply(config.BARRAGE_SPEED, config.BARRAGE_SPEED);

            let vx = this.game.rnd.between(-config.BARRAGE_VARIANCE, config.BARRAGE_VARIANCE);
            let vy = this.game.rnd.between(-config.BARRAGE_VARIANCE, config.BARRAGE_VARIANCE);

            ast.body.velocity.set(direction.x + vx, direction.y + vy);
        }
    }

    createMissile() {
        const missile = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'missile');

        missile.anchor.set(0.5, 0.5);
        missile.bringToTop();

        this.game.physics.arcade.enableBody(missile);

        missile.body.setCircle(missile.width / 2);

        this.actors.missiles.add(missile);

        return missile;
    }

    createBoom() {
        const boom = this.game.add.sprite(0, 0, 'missile-boom');

        boom.alpha = 0.2;
        boom.anchor.set(0.5, 0.5);
        boom.bringToTop();

        this.game.physics.arcade.enableBody(boom);

        boom.body.setCircle(boom.width / 2);
        boom.body.immovable = true;

        this.actors.booms.add(boom);

        return boom;
    }

    createBarrier() {
        const barrier = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'barrier');
        // barrier.scale.set(10, 10);
        barrier.anchor.set(0.5, 0.5);

        this.game.physics.arcade.enableBody(barrier);
        barrier.body.setCircle(barrier.width / 2);
        barrier.body.immovable = true;

        return barrier;
    }

    /* update functions */

    updateCollisions() {
        this.game.physics.arcade.collide(this.actors.barrier, this.actors.comets, this.deflectCelestial, this.barrierOverlap, this);
        this.game.physics.arcade.collide(this.actors.barrier, this.actors.asteroids, this.deflectCelestial, this.barrierOverlap, this);
        this.game.physics.arcade.collide(this.actors.booms, this.actors.asteroids, null, this.boomHit, this);
        this.game.physics.arcade.collide(this.actors.booms, this.actors.comets, null, this.boomHit, this);
        this.game.physics.arcade.collide(this.actors.earth, this.actors.asteroids, this.asteroidStrike, null, this);
        this.game.physics.arcade.collide(this.actors.earth, this.actors.comets, this.cometStrike, null, this);
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

    updateCelestials() {
        this.actors.asteroids.forEach(cel => this.updateCelestial(cel));
        this.actors.comets.forEach(cel => this.updateCelestial(cel));
    }

    updateCelestial(cel) {
        this.game.physics.arcade.accelerateToObject(cel, this.actors.earth);
    }

    /* misc functions */

    asteroidStrike(earth, asteroid) {
        console.log('[play] asteroid strike');
        this.stats.asteroidStrikes += 1;
        this.sounds.AsteroidHit2.play();
        asteroid.destroy();

        const burstEmitter = game.add.emitter(0, 0, 64);
        burstEmitter.makeParticles('asteroid-boom-sheet',
            new Array(64).fill(0).map((v,i) => i),
            64, false, false);
        burstEmitter.gravity = 0;
        burstEmitter.minParticleSpeed.setTo(-200, -200);
        burstEmitter.maxParticleSpeed.setTo(200, 200);
        burstEmitter.particleDrag.set(100, 100);
        burstEmitter.area.width = asteroid.width;
        burstEmitter.area.height = asteroid.height;

        burstEmitter.x = asteroid.position.x;
        burstEmitter.y = asteroid.position.y;

        burstEmitter.alpha = 0.8;
        burstEmitter.start(true, 1000, null, 64);

        const destroyTween = this.game.add
            .tween(burstEmitter)
            .to(
                {
                    alpha: 0.0,
                },
                config.ASTEROID_BURST_FADE_DURATION,
                Phaser.Easing.Linear.None,
                true
            );
        destroyTween.onComplete.add(() => burstEmitter.destroy(), this);

        this.game.camera.shake(config.ASTEROID_CAM_SHAKE_AMOUNT, config.ASTEROID_CAM_SHAKE_DURATION_MS);
    }

    cometStrike(earth, comet) {
        console.log('[play] comet strike');
        this.stats.cometStrikes += 1;
        this.sounds.AsteroidHit2.play();
        comet.destroy();

        const burstEmitter = game.add.emitter(0, 0, 256);
        burstEmitter.makeParticles('comet-boom-sheet',
            new Array(256).fill(0).map((v,i) => i),
            256, false, false);
        burstEmitter.gravity = 0;
        burstEmitter.minParticleSpeed.setTo(-200, -200);
        burstEmitter.maxParticleSpeed.setTo(200, 200);
        burstEmitter.particleDrag.set(100, 100);
        burstEmitter.area.width = comet.width;
        burstEmitter.area.height = comet.height;

        burstEmitter.x = comet.position.x;
        burstEmitter.y = comet.position.y;

        burstEmitter.alpha = 0.8;
        burstEmitter.start(true, 1000, null, 256);

        const destroyTween = this.game.add
            .tween(burstEmitter)
            .to(
                {
                    alpha: 0.0,
                },
                config.COMET_BURST_FADE_DURATION,
                Phaser.Easing.Linear.None,
                true
            );
        destroyTween.onComplete.add(() => burstEmitter.destroy(), this);

        this.game.camera.shake(config.COMET_CAM_SHAKE_AMOUNT, config.COMET_CAM_SHAKE_DURATION_MS);
    }

    deflectCelestial(barrier, cel) {
        if (!cel.data.deflected) {
            console.log('[play] celestial deflect');
            cel.data.deflected = true;
            this.sounds.AsteroidHit1.play();
            this.stats.deflections += 1;
            this.destroyCelestial(cel);
        }
        const bounceDir = Phaser.Point.subtract(cel.position, this.actors.earth.position);
        bounceDir.multiply(0.5, 0.5);
        cel.body.velocity.copyFrom(bounceDir);
    }

    destroyCelestial(cel) {
        const destroyTween = this.game.add
            .tween(cel)
            .to(
                {
                    alpha: 0.6,
                },
                config.DEFLECT_BLINK_DURATION,
                Phaser.Easing.Linear.None,
                true,
                0,
                10,
                true
            );
        destroyTween.onComplete.add(() => cel.destroy(), this);
    }

    barrierOverlap(barrier, celestial) {
        // find the angle between the barrier's center and the point where the
        // asteroid is touching

        const celPoint = celestial.position.clone().subtract(this.game.world.centerX, this.game.world.centerY).normalize();
        const barPoint = this.game.input.mousePointer.position.clone().subtract(this.game.world.centerX, this.game.world.centerY).normalize();

        const distance = barPoint.distance(celPoint);

        return distance < config.BARRIER_WIDTH;
    }

    playMusic() {
        this.sounds.PlayMusic.fadeIn(300);
    }

    launchTransport() {
        let index = this.game.rnd.between(0, this.transportSpawnPoints.length - 1);
        let point = this.transportSpawnPoints[index];
        let transport = this.game.add.sprite(point.x, point.y, 'transport-sheet');

        this.stats.transportsLaunched += 1;

        transport.anchor.set(0.5, 0.5);
        transport.bringToTop();

        this.game.physics.arcade.enableBody(transport);
        transport.body.setCircle(transport.width / 2);

        this.actors.transports.add(transport);

        // play engine fire animation
        transport.animations.add('afterburner');
        transport.animations.play('afterburner', 20, true);

        // set a direction away from the center
        let direction = Phaser.Point.subtract(this.actors.earth.position, transport.position);
        direction.normalize();
        direction.multiply(config.TRANSPORT_SPEED, config.TRANSPORT_SPEED);
        transport.body.velocity.set(-direction.x, -direction.y);

        // rotate the ship so it's pointing in the right direction
        let x = transport.position.x + transport.body.velocity.x;
        let y = transport.position.y + transport.body.velocity.y;
        transport.rotation = this.game.physics.arcade.angleToXY(transport, x, y);
        transport.rotation += Math.PI / 2;

        // Set acceleration
        transport.body.acceleration.set(transport.body.velocity.x * config.TRANSPORT_ACCELERATION,
            transport.body.velocity.y * config.TRANSPORT_ACCELERATION);
    }

    fireMissile({ position }) {
        const missile = this.createMissile();
        const { x, y } = position;

        this.stats.missilesFired += 1;

        this.sounds.EscapeLaunch.play();

        const xCenter = x - this.actors.barrier.position.x;
        const yCenter = y - this.actors.barrier.position.y;
        let angle = -1 * Math.atan(xCenter/yCenter) + 2*Math.PI;
        if (yCenter > 0) {
            angle += Math.PI;
        }
        missile.rotation = angle;

        const trajectory = this.game.add
            .tween(missile.position)
            .to( { x, y },
                1200,
                Phaser.Easing.Cubic.In,
                true
            );
        trajectory.onComplete.add(() => this.explodeMissile(missile), this);
    }

    explodeMissile(missile) {
        const boom = this.createBoom();
        boom.position.copyFrom(missile.position);

        const boomBodyTween = this.game.add
            .tween(boom.body)
            .to(
                {
                    radius: boom.body.radius * 5,
                },
                120,
                Phaser.Easing.Cubic.InOut,
                true,
                0,
                0,
                true
            );
        const boomTween = this.game.add
            .tween(boom.scale)
            .to(
                {
                    x: 5,
                    y: 5,
                },
                120,
                Phaser.Easing.Cubic.InOut,
                true,
                0,
                0,
                true
            );
        boomTween.onComplete.add(() => boom.destroy(), this);

        this.sounds.MissileExplosion.play();
        missile.destroy();
    }

    boomHit(boom, celestial) {
        this.destroyCelestial(celestial);
        this.stats.celestialsDestroyed += 1;
        return false;
    }

    getRandomOffscreenPoint() {
        let self = this;
        let padding = 200;

        let functions = [
            () => {
                // LEFT
                let x = -padding;
                let y = self.game.rnd.between(0, self.game.world.height);
                return {x, y};
            },
            () => {
                // RIGHT
                let x = self.game.world.width + padding;
                let y = self.game.rnd.between(0, self.game.world.height);
                return {x, y};
            },
            () => {
                // TOP
                let x = self.game.rnd.between(0, self.game.world.width);
                let y = -padding;
                return {x, y};
            },
            () => {
                // BOTTOM
                let x = self.game.rnd.between(0, self.game.world.width);
                let y = self.game.world.height + padding;
                return {x, y};
            },
        ];

        let f = functions[self.game.rnd.between(0, functions.length-1)];

        return f();
    }

    generateTransportSpawnPoints(count=36) {
        this.transportSpawnPoints = [];

        let x, y;
        let angle = 360 / count;

        // console.log()

        // spawn asteroids in a circle
        for (let i = 0.1; i < 360; i += angle) {
            x = this.game.world.centerX + 100 * Math.cos(i);
            y = this.game.world.centerY + 100 * Math.sin(i);

            this.transportSpawnPoints.push({x, y});
        }

        console.log(this.transportSpawnPoints);
    }
}
