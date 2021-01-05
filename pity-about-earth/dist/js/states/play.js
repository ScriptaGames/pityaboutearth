'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayState = function (_Phaser$State) {
    _inherits(PlayState, _Phaser$State);

    function PlayState() {
        _classCallCheck(this, PlayState);

        return _possibleConstructorReturn(this, (PlayState.__proto__ || Object.getPrototypeOf(PlayState)).apply(this, arguments));
    }

    _createClass(PlayState, [{
        key: 'create',
        value: function create() {
            var _this2 = this;

            console.log('[play] starting play state');

            // for easy access to this state for debugging in browser console
            window.play = this;
            this.between = this.game.rnd.between.bind(this.game.rnd);

            this.createBackground();
            this.createSounds();
            this.playMusic();
            this.createStats();
            this.createControls();

            this.createActors();
            this.updateBarrierRotation(0, 0, -1);

            if (config.MISSILES_ENABLED) {
                this.createMissileLauncher();
            }

            // Generate points that the transports will launch from
            this.transportSpawnPoints = this.generateCirclePoints(20, 100);

            // Generate the points that column barrages will come from
            this.columnBarrageSpawnPoints = this.generateCirclePoints(36, config.CANVAS_HYPOT / 2);

            // Keep track of current barrage
            this.barrage = new Barrage();

            this.timeToNextBarrage = config.MAX_TIME_BETWEEN_BARRAGE;

            this.barrageFunctions = [this.createSpiralBarrage, this.createZigZagBarrage, this.createColumnBarrage];

            // here's the big one text!
            this.game.time.events.add(800, function () {
                var bigOne = _this2.game.add.sprite(_this2.game.world.centerX, _this2.game.world.height - 400, 'big-one');
                bigOne.alpha = 0;
                bigOne.anchor.set(0.5, 1);
                _this2.game.add.tween(bigOne).to({ alpha: 1.0 }, 1200, Phaser.Easing.Quadratic.In, true, 0, 0, true);
            });
            // Create single asteroid to start the game ("The Big One")
            this.game.time.events.add(1400, function () {
                var ast = _this2.createAsteroid();
                ast.position.set(_this2.game.world.centerX, -200);
                ast.body.velocity.set(0, 200);
            });
            this.game.time.events.add(8000, function () {
                var dots = _this2.game.add.sprite(_this2.game.world.centerX, _this2.game.world.height - 400, 'dots');
                dots.anchor.set(0.5, 1);
                dots.alpha = 0;
                _this2.game.add.tween(dots).to({ alpha: 1.0 }, 1200, Phaser.Easing.Quadratic.In, true, 0, 0, true);
            });
            this.game.time.events.add(11000, function () {
                var uhoh = _this2.game.add.sprite(_this2.game.world.centerX, _this2.game.world.height - 400, 'uh-oh');
                uhoh.alpha = 0;
                uhoh.anchor.set(0.5, 1);
                _this2.game.add.tween(uhoh).to({ alpha: 1.0 }, 1200, Phaser.Easing.Quadratic.In, true, 0, 0, true);
            });

            this.game.time.events.add(10300, function () {
                if (config.STRAYS_ENABLED) {
                    _this2.game.time.events.add(config.RATE_CREATE_ASTEROID, _this2.singleAsteroidLoop, _this2);
                    _this2.game.time.events.add(config.RATE_CREATE_COMET, _this2.singleCometLoop, _this2);
                }
                _this2.game.time.events.loop(config.RATE_RAISE_DIFFICULTY, function () {
                    return _this2.stats.difficulty += config.DIFFICULTY_INCREASE_RATE;
                }, _this2); // Increase the difficulty
                _this2.game.time.events.add(2000, _this2.fireBarrage.bind(_this2), _this2);
            }, this);
            this.game.time.events.add(13300, function () {
                _this2.game.time.events.loop(config.RATE_LAUNCH_TRANSPORT, _this2.launchTransport, _this2);
            }, this);
        }
    }, {
        key: 'update',
        value: function update() {
            this.updateControls();
            this.updateCelestials();
            this.updateCollisions();
            this.updateScoreBar();
        }
    }, {
        key: 'render',
        value: function render() {
            // this.game.debug.body(this.actors.earth);
            // this.game.debug.body(this.actors.barrier);
            // this.actors.asteroids.forEach(this.game.debug.body.bind(this.game.debug));
            // this.actors.comets.forEach(this.game.debug.body.bind(this.game.debug));
            // this.actors.booms.forEach(this.game.debug.body.bind(this.game.debug));
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {}
        // _.forEach(this.sounds, sound => sound.stop());


        /* create functions */

    }, {
        key: 'createActors',
        value: function createActors() {
            this.actors = {
                earth: this.createEarth(),
                healthbar: this.createEarthHealthBar(),
                scorebar: this.createScoreBar(),
                barrier: this.createBarrier(),
                asteroids: this.game.add.group(),
                comets: this.game.add.group(),
                missiles: this.game.add.group(),
                booms: this.game.add.group(),
                transports: this.game.add.group()
            };
        }
    }, {
        key: 'createStats',
        value: function createStats() {
            this.stats = {
                asteroidStrikes: 0,
                cometStrikes: 0,
                missilesFired: 0,
                deflections: 0,
                transportsLaunched: 0,
                transportsEscaped: 0,
                transportsDestroyed: 0,
                celestialsDestroyed: 0,
                earthHP: config.EARTH_HP,
                difficulty: config.DIFFICULTY
            };
        }
    }, {
        key: 'createControls',
        value: function createControls() {
            // set updateControls function to point to the update function for
            // whichever control scheme is active
            switch (config.CONTROLS) {
                case 'TOUCH':
                    console.log('[play] creating touch controls');
                    this.createTouchControls();
                    this.updateControls = this.updateTouchControls.bind(this);
                    break;
                case 'MOUSE':
                    console.log('[play] creating mouse controls');
                    this.updateControls = this.updateMouseControls.bind(this);
                    break;
            }
        }
    }, {
        key: 'createTouchControls',
        value: function createTouchControls() {
            if (isMobile.any) {
                this.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
                this.touchControl.maxDistanceInPixels = 100;
                this.touchControl.inputEnable();
                this.touchControl.direction = new Phaser.Point();
            }
        }
    }, {
        key: 'createMissileLauncher',
        value: function createMissileLauncher() {
            this.game.input.onDown.add(_.throttle(this.fireMissile, config.MISSILE_INTERVAL), this);
        }
    }, {
        key: 'createSounds',
        value: function createSounds() {
            this.sounds = {
                Barrier: this.game.add.audio('AsteroidHit1'),
                AsteroidHit: this.game.add.audio('AsteroidHit2', 0.5),
                CometHit: this.game.add.audio('AsteroidHit2', 1.0),
                ButtonTap: this.game.add.audio('ButtonTap'),
                DropExplosion: this.game.add.audio('DropExplosion'),
                MissileExplosion: this.game.add.audio('MissileExplosion'),
                MissileLaunch: this.game.add.audio('MissileLaunch'),
                EscapeLaunch2: this.game.add.audio('EscapeLaunch2'),
                EscapeLaunch: this.game.add.audio('EscapeLaunch'),
                Random: this.game.add.audio('Random'),
                Random2: this.game.add.audio('Random2'),
                Random3: this.game.add.audio('Random3'),
                Random4: this.game.add.audio('Random4'),
                Random5: this.game.add.audio('Random5'),
                Random6: this.game.add.audio('Random6'),
                Siren: this.game.add.audio('Siren'),
                Rocket1: this.game.add.audio('Rocket1'),
                Rocket2: this.game.add.audio('Rocket2'),

                PlayMusic: this.game.add.audio('PlayMusic'),
                VictoryMusic: this.game.add.audio('VictoryMusic'),
                DefeatMusic: this.game.add.audio('DefeatMusic')
            };

            this.sounds.MissileLaunch.allowMultiple = true;
        }
    }, {
        key: 'createBackground',
        value: function createBackground() {
            return this.game.add.sprite(0, 0, 'background');
        }
    }, {
        key: 'createEarth',
        value: function createEarth() {
            console.log('[play] creating earth');
            var earth = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'earth-sheet', 0);

            earth.animations.add('burn');
            earth.animations.getAnimation('burn').frame = 0;

            this.game.physics.arcade.enableBody(earth);
            earth.body.setCircle(earth.width / 2 - 30, 30, 30);
            earth.body.immovable = true;

            earth.anchor.set(0.5, 0.5);

            return earth;
        }
    }, {
        key: 'createEarthHealthBar',
        value: function createEarthHealthBar() {
            console.log('[play] creating earth healthbar');
            var earth = this.game.add.sprite(20, 20, 'earth-small');
            earth.scale.setTo(0.5, 0.5);
            var healthbar = this.game.add.sprite(70, 20, 'healthbar');
            this.healthFilling = this.game.add.sprite(80, 30, 'health-filling');
        }
    }, {
        key: 'createScoreBar',
        value: function createScoreBar() {
            console.log('[play] score bar');
            var person = this.game.add.sprite(this.game.world.width - 20, 23, 'person');
            person.anchor.set(1, 0);
            person.scale.set(0.5, 0.5);

            var fontSet = '! "#$%^\'()* +,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz{|}~';
            var font = this.game.add.retroFont('gelatin-font', 70, 110, fontSet, 18, 0, 0);
            var text = this.game.add.image(80, 80, font);
            text.scale.set(0.5, 0.5);
            text.tint = 0x777777;
            text.position.x = this.game.world.width - 60;
            text.position.y = 14;
            text.anchor.set(1, 0);
            text.bringToTop();

            return font;
        }
    }, {
        key: 'createAsteroid',
        value: function createAsteroid() {
            return this.createCelestial('asteroid');
        }
    }, {
        key: 'createComet',
        value: function createComet() {
            return this.createCelestial('comet');
        }
    }, {
        key: 'createCelestial',
        value: function createCelestial(type) {
            var frameRange = void 0;
            var group = void 0;
            var speed = void 0;
            switch (type.toLowerCase()) {
                case 'asteroid':
                    frameRange = 5;
                    group = this.actors.asteroids;
                    speed = config.ASTEROID_SPEED + this.between(-config.ASTEROID_SPEED_SPREAD, config.ASTEROID_SPEED_SPREAD);
                    break;
                case 'comet':
                    frameRange = 3;
                    group = this.actors.comets;
                    speed = config.COMET_SPEED + this.between(-config.COMET_SPEED_SPREAD, config.COMET_SPEED_SPREAD);
                    break;
                default:
                    frameRange = 4;
                    group = this.actors.asteroids;
            }

            // increase speed with difficulty, but only on a log scale
            speed *= Math.log(this.stats.difficulty + 1) + 0.75;

            var point = this.getRandomOffscreenPoint();
            var celestial = this.game.add.sprite(point.x, point.y, type + '-sheet', Math.floor(Math.random() * frameRange));
            celestial.anchor.set(0.5, 0.5);
            celestial.bringToTop();

            this.game.physics.arcade.enableBody(celestial);
            celestial.body.setCircle(celestial.width / 2);

            // send the asteroid toward earth
            Phaser.Point.subtract(this.actors.earth.position, celestial.position, celestial.body.velocity);
            celestial.body.velocity.normalize().setMagnitude(speed);

            // make it spin, so gently
            celestial.body.angularVelocity = 2 * (12 * Math.random() - 6);

            group.add(celestial);

            return celestial;
        }
    }, {
        key: 'createZigZagBarrage',
        value: function createZigZagBarrage() {
            var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
            var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : config.CANVAS_HYPOT / 2;
            var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 90;
            var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var reverse = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
            var createCelestialCallback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : this.createAsteroid.bind(this);
            var zagCount = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 3;

            if (zagCount == 0) return;
            var delayOffset = 0;

            for (var i = 0; i < zagCount; i++) {
                delayOffset = this.createSpiralBarrage(count, radius, width, offset, reverse, createCelestialCallback, delayOffset);
                reverse = !reverse;
            }

            return delayOffset;
        }
    }, {
        key: 'createSpiralBarrage',
        value: function createSpiralBarrage() {
            var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
            var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : config.CANVAS_HYPOT / 2;
            var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 360;
            var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var reverse = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
            var createCelestialCallback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : this.createAsteroid.bind(this);
            var delayOffset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

            if (count === 0) return;
            if (width > 360) width = 360;
            if (width <= 0) return;

            var angle = width / count;
            var delay = delayOffset;

            var last = false;

            // spawn asteroids in a spiral pattern
            if (!reverse) {
                for (var i = offset; i < width + offset; i += angle) {
                    delay += Math.max(config.BARRAGE_SINGLE_CEL_HARD_DELAY / this.stats.difficulty, config.BARRAGE_SINGLE_CEL_MIN_DELAY);

                    this.createSpiralBarrageCelestial(i, radius, delay, createCelestialCallback);
                }
            } else {
                for (var _i = width + offset; _i > offset; _i -= angle) {
                    delay += Math.max(config.BARRAGE_SINGLE_CEL_HARD_DELAY / this.stats.difficulty, config.BARRAGE_SINGLE_CEL_MIN_DELAY);

                    this.createSpiralBarrageCelestial(_i, radius, delay, createCelestialCallback);
                }
            }

            return delay;
        }
    }, {
        key: 'createColumnBarrage',
        value: function createColumnBarrage() {
            var numColumns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

            var _this3 = this;

            var celestPerColumn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
            var createCelestialCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.createAsteroid.bind(this);

            // Get random off screen points for num of columns
            var points = [];
            var delay = 0;

            var difficulty = this.stats.difficulty;

            for (var i = 0; i < numColumns; i++) {
                var spawnPoint = this.columnBarrageSpawnPoints[this.between(0, this.columnBarrageSpawnPoints.length - 1)];
                points.push(spawnPoint);
            }

            var _loop = function _loop(_i2) {
                var point = points[_i2];

                for (var j = 0; j < celestPerColumn; j++) {
                    _this3.game.time.events.add(delay, function () {
                        _this3.createBarrageCelestial(point.x, point.y, createCelestialCallback);
                    }, _this3);
                    delay += Math.max(config.BARRAGE_SINGLE_CEL_HARD_DELAY / difficulty, config.BARRAGE_SINGLE_CEL_MIN_DELAY);
                }
                delay += Math.max(config.BARRAGE_MIN_COLUMN_DELAY / difficulty, config.BARRAGE_MIN_COLUMN_DELAY);
            };

            for (var _i2 = 0; _i2 < points.length; _i2++) {
                _loop(_i2);
            }

            return delay;
        }
    }, {
        key: 'createSpiralBarrageCelestial',
        value: function createSpiralBarrageCelestial(degree, radius, delay, createCelestialCallback) {
            var _this4 = this;

            var x = this.game.world.centerX + radius * Math.cos(this.game.math.degToRad(degree));
            var y = this.game.world.centerY + radius * Math.sin(this.game.math.degToRad(degree));

            this.game.time.events.add(delay, function () {
                _this4.createBarrageCelestial(x, y, createCelestialCallback);
            }, this);
        }
    }, {
        key: 'createBarrageCelestial',
        value: function createBarrageCelestial(x, y, createCelestialCallback) {
            var celest = createCelestialCallback();
            celest.position.x = x;
            celest.position.y = y;
            celest.data.isBarrage = true;

            this.barrage.celestials.push(celest); // track perfect barrage block

            // set initial velocity
            var v = Phaser.Point.subtract(this.actors.earth.position, celest.position);

            v.normalize();
            var multiplier = Math.min(config.BARRAGE_SPEED * this.stats.difficulty, config.BARRAGE_MAX_MULTIPLIER);
            v.multiply(multiplier, multiplier);

            celest.body.velocity.set(v.x, v.y);

            return celest;
        }
    }, {
        key: 'createTarget',
        value: function createTarget(x, y) {
            var target = this.game.add.sprite(x, y, 'target-sheet');
            target.anchor.set(0.5, 0.5);

            var triAnim = target.animations.add('triangulate', [0, 1, 2, 3, 4, 5, 6], 26, false);
            var lockAnim = target.animations.add('lock', [7, 8], 18, true);

            triAnim.onComplete.add(function () {
                return lockAnim.play();
            }, this);

            triAnim.play();

            return target;
        }
    }, {
        key: 'createMissile',
        value: function createMissile() {
            var x = this.game.world.centerX + Math.random() * this.actors.earth.width / 2 - this.actors.earth.width / 4;
            var y = this.game.world.centerY + Math.random() * this.actors.earth.height / 2 - this.actors.earth.height / 4;
            var missile = this.game.add.sprite(x, y, 'missile-sheet');

            missile.animations.add('afterburner');
            missile.animations.play('afterburner', 20, true);

            missile.anchor.set(0.5, 0.5);
            missile.bringToTop();

            this.game.physics.arcade.enableBody(missile);

            missile.body.setCircle(missile.width / 2);

            this.actors.missiles.add(missile);

            return missile;
        }
    }, {
        key: 'createBoom',
        value: function createBoom() {
            var boom = this.game.add.sprite(0, 0, 'missile-boom');

            boom.alpha = 0;
            boom.anchor.set(0.5, 0.5);
            boom.bringToTop();

            this.game.physics.arcade.enableBody(boom);

            boom.body.setCircle(boom.width / 2);
            boom.body.immovable = true;

            this.actors.booms.add(boom);

            return boom;
        }
    }, {
        key: 'createBarrier',
        value: function createBarrier() {
            var barrier = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'barrier');
            // barrier.scale.set(10, 10);
            barrier.anchor.set(0.5, 0.5);

            this.game.physics.arcade.enableBody(barrier);
            barrier.body.setCircle(barrier.width / 2);
            barrier.body.immovable = true;
            barrier.data.direction = new Phaser.Point();

            return barrier;
        }
    }, {
        key: 'createPerfectNote',
        value: function createPerfectNote() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.game.world.centerX;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.game.world.centerY;

            var perf = this.game.add.sprite(x, y, 'perfect-sheet', 0);
            perf.anchor.set(0.5, 0.5);
            perf.scale.set(0, 0);

            var appearTween = this.game.add.tween(perf.scale).to({ x: 0.8, y: 0.8 }, 250, Phaser.Easing.Linear.None, true);

            appearTween.onComplete.add(function () {
                return shimmer.play(24, true);
            }, this);
            this.game.time.events.add(1000, function () {
                shimmer.stop(true, true);
            }, this);

            var disappearTween = this.game.add.tween(perf).to({ alpha: 0.0 }, 100, Phaser.Easing.Linear.None, false);
            var disappearTween2 = this.game.add.tween(perf.scale).to({ x: 1.1, y: 1.1 }, 100, Phaser.Easing.Linear.None, false);
            disappearTween.onComplete.add(function () {
                return perf.destroy();
            }, this);

            var shimmer = perf.animations.add('shimmer', [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            shimmer.onComplete.add(function () {
                return disappearTween.start();
            }, this);
            shimmer.onComplete.add(function () {
                return disappearTween2.start();
            }, this);
        }

        /* update functions */

    }, {
        key: 'updateCollisions',
        value: function updateCollisions() {
            this.game.physics.arcade.collide(this.actors.barrier, this.actors.comets, this.deflectCelestial, this.barrierOverlap, this);
            this.game.physics.arcade.collide(this.actors.barrier, this.actors.asteroids, this.deflectCelestial, this.barrierOverlap, this);
            this.game.physics.arcade.collide(this.actors.booms, this.actors.asteroids, null, this.boomHit, this);
            this.game.physics.arcade.collide(this.actors.booms, this.actors.comets, null, this.boomHit, this);
            this.game.physics.arcade.collide(this.actors.earth, this.actors.asteroids, this.asteroidStrike, null, this);
            this.game.physics.arcade.collide(this.actors.earth, this.actors.comets, this.cometStrike, null, this);
        }
    }, {
        key: 'updateScoreBar',
        value: function updateScoreBar() {
            this.actors.scorebar.text = '' + this.stats.transportsLaunched * 1000;
        }
    }, {
        key: 'updateControls',
        value: function updateControls() {}

        /**
         * @param {number} angle The angle in radians the barrier is facing.
         * @param {number} x The x coordinate, relative to the barrier circle, of the barrier bar's center.
         * @param {number} y The y coordinate, relative to the barrier circle, of the barrier bar's center.
         */

    }, {
        key: 'updateBarrierRotation',
        value: function updateBarrierRotation(angle, x, y) {
            this.actors.barrier.rotation = angle;
            this.actors.barrier.data.direction.set(x, y).normalize();
        }
    }, {
        key: 'updateTouchControls',
        value: function updateTouchControls() {
            var _touchControl$speed = this.touchControl.speed,
                x = _touchControl$speed.x,
                y = _touchControl$speed.y;

            var angle = -Math.PI / 2 + this.game.physics.arcade.angleToXY(this.game.world, x, y);
            // only update the barrier position if the virtual joystick is being
            // held.  if x and y are both 0, it means the player released the
            // joystick, and in that case we should leave the barrier wherever it
            // is instead of snapping to 0,0.
            if (x !== 0 && y !== 0) {
                this.updateBarrierRotation(angle, -x, -y);
            }
        }
    }, {
        key: 'updateMouseControls',
        value: function updateMouseControls() {
            var x = this.game.input.mousePointer.x;
            var y = this.game.input.mousePointer.y;
            var angle = Math.PI / 2 + this.game.physics.arcade.angleToXY(this.actors.earth, x, y);
            this.updateBarrierRotation(angle, x - this.actors.barrier.position.x, y - this.actors.barrier.position.y);
        }
    }, {
        key: 'updateCelestials',
        value: function updateCelestials() {
            var _this5 = this;

            this.actors.asteroids.forEach(function (cel) {
                return _this5.updateCelestial(cel);
            });
            this.actors.comets.forEach(function (cel) {
                return _this5.updateCelestial(cel);
            });
        }
    }, {
        key: 'updateCelestial',
        value: function updateCelestial(cel) {
            if (!cel.data.isBarrage) {
                // accelerate single asteroids toward earth
                // this.game.physics.arcade.accelerateToObject(cel, this.actors.earth);
            }
        }

        /* misc functions */

    }, {
        key: 'asteroidStrike',
        value: function asteroidStrike(earth, asteroid) {
            console.log('[play] asteroid strike');
            this.stats.asteroidStrikes += 1;
            var sound = this.sounds.AsteroidHit.play();

            // If this was from a barrage then log not perfect
            if (asteroid.data.isBarrage) {
                this.barrage.isPerfect = false;
            }

            asteroid.destroy();

            this.damageEarth(config.ASTEROID_DAMAGE);

            var burstEmitter = game.add.emitter(0, 0, 64);
            burstEmitter.makeParticles('asteroid-boom-sheet', new Array(64).fill(0).map(function (v, i) {
                return i;
            }), 64, false, false);
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

            var destroyTween = this.game.add.tween(burstEmitter).to({
                alpha: 0.0
            }, config.ASTEROID_BURST_FADE_DURATION, Phaser.Easing.Linear.None, true);
            destroyTween.onComplete.add(function () {
                return burstEmitter.destroy();
            }, this);

            this.game.camera.shake(config.ASTEROID_CAM_SHAKE_AMOUNT, config.ASTEROID_CAM_SHAKE_DURATION_MS);
        }
    }, {
        key: 'cometStrike',
        value: function cometStrike(earth, comet) {
            console.log('[play] comet strike');
            this.stats.cometStrikes += 1;
            this.sounds.CometHit.play();

            // If this was from a barrage then log not perfect
            if (comet.data.isBarrage) {
                this.barrage.isPerfect = false;
            }

            comet.destroy();

            this.damageEarth(config.COMET_DAMAGE);

            var burstEmitter = game.add.emitter(0, 0, 256);
            burstEmitter.makeParticles('comet-boom-sheet', new Array(256).fill(0).map(function (v, i) {
                return i;
            }), 256, false, false);
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

            var destroyTween = this.game.add.tween(burstEmitter).to({
                alpha: 0.0
            }, config.COMET_BURST_FADE_DURATION, Phaser.Easing.Linear.None, true);
            destroyTween.onComplete.add(function () {
                return burstEmitter.destroy();
            }, this);

            this.game.camera.shake(config.COMET_CAM_SHAKE_AMOUNT, config.COMET_CAM_SHAKE_DURATION_MS);
        }
    }, {
        key: 'deflectCelestial',
        value: function deflectCelestial(barrier, cel) {
            if (!cel.data.deflected) {
                console.log('[play] celestial deflect');
                cel.data.deflected = true;
                this.sounds.Barrier.play();
                this.stats.deflections += 1;
                this.destroyCelestial(cel);
            }
            var bounceDir = Phaser.Point.subtract(cel.position, this.actors.earth.position);
            bounceDir.multiply(0.5, 0.5);
            cel.body.velocity.copyFrom(bounceDir);
        }
    }, {
        key: 'destroyCelestial',
        value: function destroyCelestial(cel) {
            var fromBoom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var destroyTween = void 0;
            if (fromBoom) {
                destroyTween = this.game.add.tween(cel).to({
                    alpha: 0.0,
                    tint: 0xff0000
                }, 315, Phaser.Easing.Linear.None, true);
                this.game.add.tween(cel.scale).to({ x: 1.5, y: 1.5 }, 315, Phaser.Easing.Linear.None, true);
            } else {
                destroyTween = this.game.add.tween(cel).to({
                    alpha: 0.6
                }, config.DEFLECT_BLINK_DURATION, Phaser.Easing.Linear.None, true, 0, 10, true);
            }
            destroyTween.onComplete.add(function () {
                return cel.destroy();
            }, this);

            // check for perfect barrage block
            if (!cel.data.beingDestroyed && cel.data.isBarrage && this.barrage.isCompletedPerfectly()) {
                console.log("[play] PERFECT Barrage block! type: ", this.barrage.type);
                this.createPerfectNote(cel.position.x, cel.position.y);
                this.launchTransport();
            }

            cel.data.beingDestroyed = true;
        }
    }, {
        key: 'barrierOverlap',
        value: function barrierOverlap(barrier, celestial) {
            // find the angle between the barrier's center and the point where the
            // asteroid is touching

            var celPoint = celestial.position.clone().subtract(this.game.world.centerX, this.game.world.centerY).normalize();
            var barPoint = barrier.data.direction;

            var distance = barPoint.distance(celPoint);

            return distance < config.BARRIER_WIDTH;
        }
    }, {
        key: 'playMusic',
        value: function playMusic() {
            var _this6 = this;

            this.game.time.events.add(200, function () {
                return _this6.sounds.PlayMusic.fadeIn(500, true);
            });
        }
    }, {
        key: 'launchTransport',
        value: function launchTransport() {
            if (this.isAlive()) {
                var index = this.game.rnd.between(0, this.transportSpawnPoints.length - 1);
                var _point = this.transportSpawnPoints[index];
                var transport = this.game.add.sprite(_point.x, _point.y, 'transport-sheet');
                transport.scale.set(0, 0);

                this.sounds.Rocket2.play();

                this.game.add.tween(transport.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Linear.None, true);
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
                var direction = Phaser.Point.subtract(this.actors.earth.position, transport.position);
                direction.normalize();
                direction.multiply(config.TRANSPORT_SPEED, config.TRANSPORT_SPEED);
                transport.body.velocity.set(-direction.x, -direction.y);

                // rotate the ship so it's pointing in the right direction
                var x = transport.position.x + transport.body.velocity.x;
                var y = transport.position.y + transport.body.velocity.y;
                transport.rotation = this.game.physics.arcade.angleToXY(transport, x, y);
                transport.rotation += Math.PI / 2;

                // Set acceleration
                transport.body.acceleration.set(transport.body.velocity.x * config.TRANSPORT_ACCELERATION, transport.body.velocity.y * config.TRANSPORT_ACCELERATION);
            }
        }
    }, {
        key: 'singleAsteroidLoop',
        value: function singleAsteroidLoop() {
            var nextTime = this.getNextSpawnTime(config.RATE_CREATE_ASTEROID);
            console.log('[play] Spawning next single asteroid. Next in: ', nextTime);
            this.createAsteroid();
            this.game.time.events.add(nextTime, this.singleAsteroidLoop, this);
        }
    }, {
        key: 'singleCometLoop',
        value: function singleCometLoop() {
            var nextTime = this.getNextSpawnTime(config.RATE_CREATE_COMET);
            console.log('[play] Spawning next single comet. Next in: ', nextTime);
            this.createComet();
            this.game.time.events.add(nextTime, this.singleCometLoop, this);
        }
    }, {
        key: 'getNextSpawnTime',
        value: function getNextSpawnTime(base) {
            return Math.pow(this.stats.difficulty, 2) / 2 * 1000 + base;
        }
    }, {
        key: 'fireBarrage',
        value: function fireBarrage() {
            // get random barrage function
            var barrageFunc = this.barrageFunctions[this.between(0, this.barrageFunctions.length - 1)];
            var barrageDuration = void 0;

            // reset current barrage for perfect tracking
            this.barrage.init();
            this.barrage.type = barrageFunc.name;
            console.log("[play] Creating new barrage type: ", this.barrage.type);

            var isComet = 100 * Math.random() <= config.PERCENT_CHANCE_OF_COMET_BARRAGE;
            var createCallback = this.createAsteroid.bind(this);
            if (isComet) {
                createCallback = this.createComet.bind(this);
            }

            if (barrageFunc.name === 'createColumnBarrage') {
                var columnCount = this.between(2, 6);
                var celestPerColumn = this.between(3, 10);
                barrageDuration = barrageFunc.bind(this)(columnCount, celestPerColumn, createCallback);
            } else {
                var count = this.between(10, 30);
                var width = this.between(120, 359);
                var offset = this.between(0, 360);
                var reverse = this.between(0, 1);

                if (barrageFunc.name === 'createZigZagBarrage') {
                    count = this.between(8, 16);
                    width = this.between(60, 180);
                }

                barrageDuration = barrageFunc.bind(this)(count, config.CANVAS_HYPOT / 2, width, offset, reverse, createCallback);
            }

            // First schedule next barrage
            this.timeToNextBarrage = Math.min(this.timeToNextBarrage / this.stats.difficulty, config.MAX_TIME_BETWEEN_BARRAGE);
            this.timeToNextBarrage = Math.max(this.timeToNextBarrage, config.MIN_TIME_BETWEEN_BARRAGE);
            this.timeToNextBarrage += barrageDuration;
            console.log("[play] time to next barrage: ", this.timeToNextBarrage, this.stats.difficulty, barrageDuration);
            this.game.time.events.add(this.timeToNextBarrage, this.fireBarrage.bind(this));
        }
    }, {
        key: 'fireMissile',
        value: function fireMissile(_ref) {
            var _this7 = this;

            var position = _ref.position;

            if (this.isAlive()) {
                var x = position.x,
                    y = position.y;


                var target = this.createTarget(x, y);
                var missile = this.createMissile();
                missile.scale.set(0, 0);
                missile.data.target = target;

                this.stats.missilesFired += 1;

                this.sounds.MissileLaunch.play();

                var xCenter = x - missile.position.x;
                var yCenter = y - missile.position.y;
                var angle = -1 * Math.atan(xCenter / yCenter) + 2 * Math.PI;
                if (yCenter > 0) {
                    angle += Math.PI;
                }
                missile.rotation = angle;

                var enlarge = this.game.add.tween(missile.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Linear.None, true);
                var trajectory = this.game.add.tween(missile.position).to({ x: x, y: y }, 1000, Phaser.Easing.Cubic.In, true);
                trajectory.onComplete.add(function () {
                    return _this7.explodeMissile(missile);
                }, this);
            }
        }
    }, {
        key: 'explodeMissile',
        value: function explodeMissile(missile) {
            missile.data.target.destroy();

            var boom = this.createBoom();
            boom.position.copyFrom(missile.position);
            boom.scale.set(0, 0);

            var tweenDur = 120;

            var boomAlphaTween = this.game.add.tween(boom).to({
                alpha: 0.5,
                tint: 0xFF1010
            }, tweenDur, Phaser.Easing.Cubic.InOut, true, 0, 0, true);
            var boomBodyTween = this.game.add.tween(boom.body).to({
                radius: boom.body.radius * 2.1
            }, tweenDur, Phaser.Easing.Cubic.InOut, true, 0, 0, true);
            var boomTween = this.game.add.tween(boom.scale).to({
                x: 2.5,
                y: 2.5
            }, tweenDur, Phaser.Easing.Cubic.InOut, true, 0, 0, true);
            boomTween.onComplete.add(function () {
                return boom.destroy();
            }, this);

            this.sounds.MissileExplosion.play();
            missile.destroy();
        }
    }, {
        key: 'boomHit',
        value: function boomHit(boom, celestial) {
            this.destroyCelestial(celestial, true);
            this.stats.celestialsDestroyed += 1;
            return false;
        }
    }, {
        key: 'damageEarth',
        value: function damageEarth(dmg) {
            var _this8 = this;

            this.stats.earthHP = Math.max(this.stats.earthHP - dmg, 0);
            var healthPct = this.stats.earthHP / config.EARTH_HP;

            console.log('[play] earth damage: ', dmg, this.stats.earthHP, healthPct, this.healthFilling.width);

            this.healthFilling.width = 380 * healthPct; // Reduce the health bar


            var spriteIndex = Math.floor((config.EARTH_HP - this.stats.earthHP) / (config.EARTH_HP / (this.actors.earth.animations.getAnimation('burn').frameTotal - 1)));
            console.log('[play] earth sprite ' + spriteIndex);

            if (!this.actors.earth.data.beingHit) {
                var hitTween = this.game.add.tween(this.actors.earth).to({
                    tint: 0xFF7007
                }, 100, Phaser.Easing.Linear.None, true, 0, 0, true);
                this.actors.earth.data.beingHit = true;
                hitTween.onComplete.add(function () {
                    return _this8.actors.earth.data.beingHit = false;
                }, this);
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
                this.game.time.events.add(300, this.blowUpEarth, this);
            }
        }
    }, {
        key: 'setEarthDamageSprite',
        value: function setEarthDamageSprite(index) {
            var animation = this.actors.earth.animations.getAnimation('burn');
            animation.frame = index;
        }
    }, {
        key: 'blowUpEarth',
        value: function blowUpEarth() {
            var _this9 = this;

            this.sounds.PlayMusic.fadeOut(300);
            this.sounds.DefeatMusic.fadeIn(300, true);
            this.sounds.CometHit.play();
            this.sounds.Siren.fadeOut(200);

            var hitTween = this.game.add.tween(this.actors.earth).to({
                tint: 0xFF7007,
                alpha: 0
            }, 60, Phaser.Easing.Linear.None, true, 0, 80, true);
            var fadeTween = this.game.add.tween(this.actors.earth).to({
                alpha: 0
            }, 3600, Phaser.Easing.Linear.None, true);

            fadeTween.onComplete.add(this.next, this);
            var scaleTween = this.game.add.tween(this.actors.earth.scale).to({ x: 2, y: 2 }, 3600, Phaser.Easing.Linear.None, true);
            scaleTween.onComplete.add(function () {
                return _this9.actors.earth.destroy();
            }, this);

            var quant = 64 * 32;

            var burstEmitter = game.add.emitter(0, 0, quant);
            burstEmitter.makeParticles('earth-boom-sheet', new Array(quant).fill(0).map(function (v, i) {
                return i;
            }), quant, false, false);
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

            var destroyTween = this.game.add.tween(burstEmitter).to({
                alpha: 0.0
            }, 3600, Phaser.Easing.Linear.None, true);
            destroyTween.onComplete.add(function () {
                return burstEmitter.destroy();
            }, this);

            this.actors.earth.body.setCircle(0);
            this.actors.barrier.body.setCircle(0);
            this.actors.barrier.visible = false;

            var quant2 = 16 * 16;
            // second boom
            var secondBurstEmitter = game.add.emitter(0, 0, quant2);
            secondBurstEmitter.makeParticles('earth-boom2-sheet', new Array(quant2).fill(0).map(function (v, i) {
                return i;
            }), quant2, false, false);
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

            var burst2Tween = this.game.add.tween(secondBurstEmitter).to({
                alpha: 0.0
            }, 2600, Phaser.Easing.Linear.None, true, 1200);
            burst2Tween.onComplete.add(function () {
                return secondBurstEmitter.destroy();
            }, this);

            console.log('[play] KABOOOOOOM!');
        }
    }, {
        key: 'isAlive',
        value: function isAlive() {
            return this.stats.earthHP > 0;
        }
    }, {
        key: 'next',
        value: function next() {
            this.game.stateTransition.to('ScoreState', false, false, { stats: this.stats, music: this.sounds.DefeatMusic });
        }
    }, {
        key: 'getRandomOffscreenPoint',
        value: function getRandomOffscreenPoint() {
            var self = this;
            var padding = 100;

            var functions = [function () {
                // LEFT
                var x = -padding;
                var y = self.game.rnd.between(0, self.game.world.height);
                return { x: x, y: y };
            }, function () {
                // RIGHT
                var x = self.game.world.width + padding;
                var y = self.game.rnd.between(0, self.game.world.height);
                return { x: x, y: y };
            }, function () {
                // TOP
                var x = self.game.rnd.between(0, self.game.world.width);
                var y = -padding;
                return { x: x, y: y };
            }, function () {
                // BOTTOM
                var x = self.game.rnd.between(0, self.game.world.width);
                var y = self.game.world.height + padding;
                return { x: x, y: y };
            }];

            var f = functions[self.game.rnd.between(0, functions.length - 1)];

            return f();
        }
    }, {
        key: 'generateCirclePoints',
        value: function generateCirclePoints() {
            var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 36;
            var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

            var x = void 0,
                y = void 0;
            var angle = 360 / count;
            var circlePoints = [];

            // generate a list of x y points around a circle
            for (var i = 0.1; i < 360; i += angle) {
                x = this.game.world.centerX + width * Math.cos(this.game.math.degToRad(i));
                y = this.game.world.centerY + width * Math.sin(this.game.math.degToRad(i));

                circlePoints.push({ x: x, y: y });
            }

            return circlePoints;
        }
    }]);

    return PlayState;
}(Phaser.State);