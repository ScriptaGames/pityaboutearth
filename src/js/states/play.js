class PlayState extends Phaser.State {
    create() {
        console.log('[play] starting play state');

        // for easy access to this state for debugging in browser console
        window.play = this;
        this.between = this.game.rnd.between.bind(this.game.rnd);

        this.createBackground();
        this.createSounds();
        this.createStats();

        this.createActors();
        this.generateTransportSpawnPoints();
        this.createMissileLauncher();

        this.playMusic();

        this.difficulty = config.DIFFICULTY;
        this.timeToNextBarrage = 15000;

        this.barrageFunctions = [
            this.createSpiralBarrage,
            this.createZigZagBarrage,
            this.createColumnBarrage,
        ];

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
        // Create single asteroid to start the game
        this.game.time.events.add(1400, () => {
            this.createAsteroid();
        });
        this.game.time.events.add(8600, () => {
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
        this.game.time.events.add(11600, () => {
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
            this.game.time.events.loop(3000, this.createAsteroid, this);
            this.game.time.events.loop(6000, this.createComet, this);
            this.game.time.events.loop(1000, () => this.difficulty += 0.02, this); // Increase the difficulty
            this.game.time.events.add(this.timeToNextBarrage, this.fireBarrage.bind(this), this);
        }, this);
        this.game.time.events.add(13300, () => {
            this.game.time.events.loop(5000, this.launchTransport, this);
        }, this);

    }

    update() {
        this.updateCelestials();
        this.updateCollisions();
        this.updateBarrierRotation();
        this.updateScoreBar();
    }

    render() {
        // this.game.debug.body(this.actors.earth);
        // this.game.debug.body(this.actors.barrier);
        // this.actors.asteroids.forEach(this.game.debug.body.bind(this.game.debug));
        // this.actors.comets.forEach(this.game.debug.body.bind(this.game.debug));
        // this.actors.booms.forEach(this.game.debug.body.bind(this.game.debug));
    }

    shutdown() {
        _.forEach(this.sounds, sound => sound.stop());
    }

    /* create functions */

    createActors() {
        this.actors = {
            earth: this.createEarth(),
            healthbar: this.createEarthHealthBar(),
            scorebar: this.createScoreBar(),
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
            earthHP             : config.EARTH_HP,
        };
    }

    createMissileLauncher() {
        this.game.input.onDown.add(_.throttle(this.fireMissile, config.MISSILE_INTERVAL), this);
    }

    createSounds() {
        this.sounds = {
            Barrier          : this.game.add.audio('AsteroidHit1'),
            AsteroidHit      : this.game.add.audio('AsteroidHit2', 0.5),
            CometHit         : this.game.add.audio('AsteroidHit2', 1.0),
            ButtonTap        : this.game.add.audio('ButtonTap'),
            DropExplosion    : this.game.add.audio('DropExplosion'),
            MissileExplosion : this.game.add.audio('MissileExplosion'),
            MissileLaunch    : this.game.add.audio('MissileLaunch'),
            EscapeLaunch2    : this.game.add.audio('EscapeLaunch2'),
            EscapeLaunch     : this.game.add.audio('EscapeLaunch'),
            Random           : this.game.add.audio('Random'),
            Random2          : this.game.add.audio('Random2'),
            Random3          : this.game.add.audio('Random3'),
            Random4          : this.game.add.audio('Random4'),
            Random5          : this.game.add.audio('Random5'),
            Random6          : this.game.add.audio('Random6'),
            Siren            : this.game.add.audio('Siren'),
            Rocket1          : this.game.add.audio('Rocket1'),
            Rocket2          : this.game.add.audio('Rocket2'),

            PlayMusic    : this.game.add.audio('PlayMusic'),
            VictoryMusic : this.game.add.audio('VictoryMusic'),
            DefeatMusic  : this.game.add.audio('DefeatMusic'),
        };

        this.sounds.MissileLaunch.allowMultiple = true;
    }

    createBackground() {
        return this.game.add.sprite(0, 0, 'background');
    }

    createEarth() {
        console.log('[play] creating earth');
        const earth = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'earth-sheet', 0);

        earth.animations.add('burn');
        earth.animations.getAnimation('burn').frame = 0;

        this.game.physics.arcade.enableBody(earth);
        earth.body.setCircle(earth.width / 2 - 30, 30, 30);
        earth.body.immovable = true;

        earth.anchor.set(0.5, 0.5);

        return earth;
    }

    createEarthHealthBar() {
        console.log('[play] creating earth healthbar');
        let earth = this.game.add.sprite(20, 20, 'earth-small', 0);
        earth.scale.setTo(1.15, 1.15);
        let healthbar = this.game.add.sprite(70, 20, 'healthbar', 0);
        this.healthFilling = this.game.add.sprite(80, 30, 'health-filling', 0);
    }

    createScoreBar() {
        console.log('[play] score bar');
        const person = this.game.add.sprite(this.game.world.width - 20, 23, 'person');
        person.anchor.set(1, 0);
        person.scale.set(0.5, 0.5);

        const fontSet = `! "#$%^'()* +,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_abcdefghijklmnopqrstuvwxyz{|}~`;
        const font = this.game.add.retroFont('gelatin-font', 70, 110, fontSet, 18, 0, 0);
        const text = this.game.add.image(80, 80, font);
        text.scale.set(0.5,0.5);
        text.tint = 0x777777;
        text.position.x = this.game.world.width - 60;
        text.position.y = 14;
        text.anchor.set(1, 0);
        text.bringToTop();

        return font;
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

    createZigZagBarrage(count=6, radius=1000, width=90, offset=0, reverse=false, difficulty=0.5, createCelestialCallback=this.createAsteroid.bind(this), zagCount=3) {
        if (zagCount == 0) return;
        let delayOffset = 0;

        for (let i = 0; i < zagCount; i++) {
            delayOffset = this.createSpiralBarrage(count, radius, width, offset, reverse, difficulty, createCelestialCallback, delayOffset);
            reverse = !reverse;
        }
    }

    createSpiralBarrage(count=30, radius=1000, width=360, offset=0, reverse=false, difficulty=0.5, createCelestialCallback=this.createAsteroid.bind(this), delayOffset=0) {
        if (difficulty == 0) difficulty = 0.01;  // avoid divide by 0
        if (count == 0) return;
        if (width > 360) width = 360;
        if (width <= 0) return;

        let angle = width / count;
        let delay = delayOffset;

        // spawn asteroids in a spiral pattern
        if (!reverse) {
            for (let i = 0 + offset; i < width + offset; i += angle) {
                delay += config.BARRAGE_HARD_DELAY / difficulty;
                this.createBarrageCelestial(i, radius, delay, difficulty, createCelestialCallback);
            }
        }
        else {
            for (let i = width + offset; i > 0 + offset; i -= angle) {
                delay += config.BARRAGE_HARD_DELAY / difficulty;
                this.createBarrageCelestial(i, radius, delay, difficulty, createCelestialCallback);
            }
        }

        return delay;
    }

    createColumnBarrage(numColumns=4, celestPerColumn=4, difficulty=0.2, createCelestialCallback=this.createAsteroid.bind(this)) {
        // Get random off screen points for num of columns
        let points = [];
        let delay = 0;

        for (let i = 0; i < numColumns; i++) {
            points.push(this.getRandomOffscreenPoint());
        }

        points.forEach((point) => {
            for (let i = 0; i < celestPerColumn; i++) {
                this.game.time.events.add(delay, () => {
                    let celest = createCelestialCallback();
                    celest.position.x = point.x;
                    celest.position.y = point.y;

                    // set initial velocity
                    let v = Phaser.Point.subtract(this.actors.earth.position, celest.position);

                    v.normalize();
                    v.multiply(config.BARRAGE_SPEED * difficulty, config.BARRAGE_SPEED * difficulty);

                    celest.body.velocity.set(v.x, v.y);
                }, this);
                delay += config.BARRAGE_HARD_DELAY / difficulty;
            }
            delay += (config.BARRAGE_HARD_DELAY / difficulty) + 100;
        })
    }

    createBarrageCelestial(degree, radius, delay, difficulty, createCelestialCallback) {
        let x = this.game.world.centerX + radius * Math.cos(this.game.math.degToRad(degree));
        let y = this.game.world.centerY + radius * Math.sin(this.game.math.degToRad(degree));

        this.game.time.events.add(delay, () => {
            let celest = createCelestialCallback();
            celest.position.x = x;
            celest.position.y = y;

            // set initial velocity
            let v = Phaser.Point.subtract(this.actors.earth.position, celest.position);

            v.normalize();
            v.multiply(config.BARRAGE_SPEED * difficulty, config.BARRAGE_SPEED * difficulty);

            celest.body.velocity.set(v.x, v.y);
        }, this);
    }

    createMissile() {
        const x = this.game.world.centerX + Math.random() * this.actors.earth.width/2 - this.actors.earth.width / 4;
        const y = this.game.world.centerY + Math.random() * this.actors.earth.height/2 - this.actors.earth.height / 4;
        const missile = this.game.add.sprite(x, y, 'missile-sheet');

        missile.animations.add('afterburner');
        missile.animations.play('afterburner', 20, true);

        missile.anchor.set(0.5, 0.5);
        missile.bringToTop();

        this.game.physics.arcade.enableBody(missile);

        missile.body.setCircle(missile.width / 2);

        this.actors.missiles.add(missile);

        return missile;
    }

    createBoom() {
        const boom = this.game.add.sprite(0, 0, 'missile-boom');

        boom.alpha = 0;
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

    updateScoreBar() {
        this.actors.scorebar.text = ''+(this.stats.transportsLaunched * 1000);
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
        const sound = this.sounds.AsteroidHit.play();
        asteroid.destroy();

        this.damageEarth(config.ASTEROID_DAMAGE);

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
        this.sounds.CometHit.play();
        comet.destroy();

        this.damageEarth(config.COMET_DAMAGE);

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
            this.sounds.Barrier.play();
            this.stats.deflections += 1;
            this.destroyCelestial(cel);
        }
        const bounceDir = Phaser.Point.subtract(cel.position, this.actors.earth.position);
        bounceDir.multiply(0.5, 0.5);
        cel.body.velocity.copyFrom(bounceDir);
    }

    destroyCelestial(cel, fromBoom=false) {
        let destroyTween;
        if (fromBoom) {
            destroyTween = this.game.add
                .tween(cel)
                .to(
                    {
                        alpha: 0.0,
                        tint: 0xff0000,
                    },
                    315,
                    Phaser.Easing.Linear.None,
                    true
                );
            this.game.add
                .tween(cel.scale)
                .to(
                    { x: 1.5, y: 1.5 },
                    315,
                    Phaser.Easing.Linear.None,
                    true
                );
        }
        else {
            destroyTween = this.game.add
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
        }
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
        this.sounds.PlayMusic.fadeIn(300, true);
    }

    launchTransport() {
        if (this.isAlive()) {
            let index = this.game.rnd.between(0, this.transportSpawnPoints.length - 1);
            let point = this.transportSpawnPoints[index];
            let transport = this.game.add.sprite(point.x, point.y, 'transport-sheet');
            transport.scale.set(0, 0);

            this.sounds.Rocket2.play();

            const enlarge = this.game.add
                .tween(transport.scale)
                .to({x: 1, y: 1},
                    1000,
                    Phaser.Easing.Linear.None,
                    true
                );
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
    }

    fireBarrage() {
        // First schedule next barrage
        this.timeToNextBarrage = Math.min(this.timeToNextBarrage / this.difficulty, config.MAX_TIME_BETWEEN_BARRAGE);
        this.timeToNextBarrage = Math.max(this.timeToNextBarrage, config.MIN_TIME_BETWEEN_BARRAGE);
        this.game.time.events.add(this.timeToNextBarrage, this.fireBarrage.bind(this));

        // get random barrage function
        let barrageFunc = this.barrageFunctions[this.between(0, this.barrageFunctions.length - 1)];

        let isComet = (100 * Math.random()) <= config.PERCENT_CHANCE_OF_COMET_BARRAGE;
        let createCallback = this.createAsteroid.bind(this);
        if (isComet) {
            createCallback = this.createComet.bind(this);
        }

        if (barrageFunc.name == 'createColumnBarrage') {
            let columnCount = this.between(2, 6);
            let celestPerColumn = this.between(3, 10);
            barrageFunc.bind(this)(columnCount, celestPerColumn, this.difficulty, createCallback);
        }
        else {
            let count = this.between(10, 30);
            let width = this.between(120, 359);
            let offset = this.between(0, 360);
            let reverse = this.between(0, 1);

            if (barrageFunc.name == 'createZigZagBarrage') {
                count = this.between(8, 16);
                width = this.between(60, 180);
            }

            barrageFunc.bind(this)(count, 1000, width, offset, reverse, this.difficulty, createCallback);
        }
    }

    fireMissile({ position }) {
        if (this.isAlive()) {
            const missile = this.createMissile();
            missile.scale.set(0, 0);
            const { x, y } = position;

            this.stats.missilesFired += 1;

            this.sounds.MissileLaunch.play();

            const xCenter = x - missile.position.x;
            const yCenter = y - missile.position.y;
            let angle = -1 * Math.atan(xCenter/yCenter) + 2*Math.PI;
            if (yCenter > 0) {
                angle += Math.PI;
            }
            missile.rotation = angle;

            const enlarge = this.game.add
                .tween(missile.scale)
                .to( { x: 1, y: 1 },
                    1000,
                    Phaser.Easing.Linear.None,
                    true
                );
            const trajectory = this.game.add
                .tween(missile.position)
                .to( { x, y },
                    1000,
                    Phaser.Easing.Cubic.In,
                    true
                );
            trajectory.onComplete.add(() => this.explodeMissile(missile), this);
        }
    }

    explodeMissile(missile) {
        const boom = this.createBoom();
        boom.position.copyFrom(missile.position);
        boom.scale.set(0, 0);

        const tweenDur = 120;

        const boomAlphaTween = this.game.add
            .tween(boom)
            .to(
                {
                    alpha: 0.5,
                    tint: 0xFF1010,
                },
                tweenDur,
                Phaser.Easing.Cubic.InOut,
                true,
                0,
                0,
                true
            );
        const boomBodyTween = this.game.add
            .tween(boom.body)
            .to(
                {
                    radius: boom.body.radius * 2.1,
                },
                tweenDur,
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
                    x: 2.5,
                    y: 2.5,
                },
                tweenDur,
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
        this.destroyCelestial(celestial, true);
        this.stats.celestialsDestroyed += 1;
        return false;
    }

    damageEarth(dmg) {
        this.stats.earthHP = Math.max(this.stats.earthHP - dmg, 0);
        let healthPct = this.stats.earthHP / config.EARTH_HP;

        console.log('[play] earth damage: ', dmg, this.stats.earthHP, healthPct, this.healthFilling.width);

        this.healthFilling.width = 380 * healthPct; // Reduce the health bar


        const spriteIndex = Math.floor((config.EARTH_HP - this.stats.earthHP) / (config.EARTH_HP / (this.actors.earth.animations.getAnimation('burn').frameTotal - 1)));
        console.log(`[play] earth sprite ${spriteIndex}`);

        if (!this.actors.earth.data.beingHit) {
            const hitTween = this.game.add
                .tween(this.actors.earth)
                .to(
                    {
                        tint: 0xFF7007,
                    },
                    100,
                    Phaser.Easing.Linear.None,
                    true,
                    0,
                    0,
                    true
                );
            this.actors.earth.data.beingHit = true;
            hitTween.onComplete.add(() => this.actors.earth.data.beingHit = false, this);
        }

        if (spriteIndex <= 9) {
            this.setEarthDamageSprite(spriteIndex);
        }

        if (healthPct <= 0.25 && !this.actors.earth.data.sirenPlaying) {
            this.actors.earth.data.sirenPlaying = true;
            this.sounds.Siren.play();
        }

        if (this.stats.earthHP === 0 && !this.actors.earth.data.exploding) {
            this.actors.earth.data.exploding = true;
            this.game.time.events.add(1000, this.blowUpEarth, this);
        }
    }

    setEarthDamageSprite(index) {
        const animation = this.actors.earth.animations.getAnimation('burn');
        animation.frame = index;
    }

    blowUpEarth() {
        this.actors.barrier.destroy();
        this.sounds.PlayMusic.fadeOut(300);
        this.sounds.DefeatMusic.fadeIn(300);
        this.sounds.CometHit.play();
        this.sounds.Siren.fadeOut(200);

        const hitTween = this.game.add
            .tween(this.actors.earth)
            .to(
                {
                    tint: 0xFF7007,
                    alpha: 0,
                },
                60,
                Phaser.Easing.Linear.None,
                true,
                0,
                80,
                true
            );
        const fadeTween = this.game.add
            .tween(this.actors.earth)
            .to(
                {
                    alpha: 0,
                },
                3600,
                Phaser.Easing.Linear.None,
                true
            );
        const scaleTween = this.game.add
            .tween(this.actors.earth.scale)
            .to(
                { x: 2, y: 2 },
                3600,
                Phaser.Easing.Linear.None,
                true,
            );
        scaleTween.onComplete.add(() => this.actors.earth.destroy(), this);

        const quant = 64*32;

        const burstEmitter = game.add.emitter(0, 0, quant);
        burstEmitter.makeParticles('earth-boom-sheet',
            new Array(quant).fill(0).map((v,i) => i),
            quant, false, false);
        burstEmitter.gravity = 0;
        burstEmitter.minParticleSpeed.setTo(-140, -140);
        burstEmitter.maxParticleSpeed.setTo(140, 140);
        burstEmitter.maxParticleScale = 1.3;
        burstEmitter.minParticleScale = 1.3;
        burstEmitter.particleDrag.set(10, 10);
        burstEmitter.area.width = this.actors.earth.width;
        burstEmitter.area.height = this.actors.earth.height;

        burstEmitter.x = this.actors.earth.position.x;
        burstEmitter.y = this.actors.earth.position.y;

        burstEmitter.alpha = 0.8;
        burstEmitter.start(true, 3600, null, quant);

        const destroyTween = this.game.add
            .tween(burstEmitter)
            .to(
                {
                    alpha: 0.0,
                },
                3600,
                Phaser.Easing.Linear.None,
                true
            );
        destroyTween.onComplete.add(() => burstEmitter.destroy(), this);

        this.actors.earth.body.setCircle(0);

        const quant2 = 16*16;
        // second boom
        const secondBurstEmitter = game.add.emitter(0, 0, quant2);
        secondBurstEmitter.makeParticles('earth-boom2-sheet',
            new Array(quant2).fill(0).map((v,i) => i),
            quant2, false, false);
        secondBurstEmitter.gravity = 0;
        secondBurstEmitter.minParticleSpeed.setTo(-340, -340);
        secondBurstEmitter.maxParticleSpeed.setTo(340, 340);
        secondBurstEmitter.maxParticleScale = 2;
        secondBurstEmitter.minParticleScale = 2;
        secondBurstEmitter.particleDrag.set(10, 10);
        secondBurstEmitter.area.width = this.actors.earth.width / 2;
        secondBurstEmitter.area.height = this.actors.earth.height / 2;

        secondBurstEmitter.x = this.actors.earth.position.x;
        secondBurstEmitter.y = this.actors.earth.position.y;

        secondBurstEmitter.alpha = 0.8;
        secondBurstEmitter.start(true, 3600, null, quant2);

        const burst2Tween = this.game.add
            .tween(secondBurstEmitter)
            .to(
                {
                    alpha: 0.0,
                },
                2600,
                Phaser.Easing.Linear.None,
                true,
                1200
            );
        burst2Tween.onComplete.add(() => secondBurstEmitter.destroy(), this);

        this.game.time.events.add(5000, this.next, this);

        console.log('[play] KABOOOOOOM!');
    }

    isAlive() {
        return this.stats.earthHP > 0;
    }

    next() {
        this.game.stateTransition.to('ScoreState', false, false, { stats: this.stats });
    }

    getRandomOffscreenPoint() {
        let self = this;
        let padding = 100;

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
        if (this.isAlive()) {
            this.transportSpawnPoints = [];

            let x, y;
            let angle = 360 / count;

            // spawn asteroids in a circle
            for (let i = 0.1; i < 360; i += angle) {
                x = this.game.world.centerX + 100 * Math.cos(i);
                y = this.game.world.centerY + 100 * Math.sin(i);

                this.transportSpawnPoints.push({x, y});
            }
        }
    }
}
