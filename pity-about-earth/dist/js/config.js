'use strict';

var config = Object.freeze({

    // skip menu for quick testing
    SKIP_MENU: false,

    // which control scheme to use
    CONTROLS: isMobile.any ? 'TOUCH' : 'MOUSE',

    DIFFICULTY: 0.2, // base difficulty pretty easy
    DIFFICULTY_INCREASE_RATE: 0.015, // How much to increase the difficulty per second

    // canvas resolution
    CANVAS_WIDTH: isMobile.any ? 1180 : 1920,
    CANVAS_HEIGHT: 1920,
    CANVAS_HYPOT: Math.sqrt(1920 * 1920 * 2),

    // are missiles enabled?
    MISSILES_ENABLED: !isMobile.any,

    // enable stray asteroids and comets
    STRAYS_ENABLED: !isMobile.any,

    // Game pacing rates
    RATE_CREATE_ASTEROID: 7000,
    RATE_CREATE_COMET: 10000,
    RATE_RAISE_DIFFICULTY: isMobile.any ? 500 : 1000,
    RATE_LAUNCH_TRANSPORT: 5000,

    // for attacking, how long to press before asteroid turns into comet
    COMET_PRESS_DELAY: 0.4 * Phaser.Timer.SECOND,

    // impact effects
    ASTEROID_CAM_SHAKE_AMOUNT: 0.004,
    ASTEROID_CAM_SHAKE_DURATION_MS: 0.1 * Phaser.Timer.SECOND,
    COMET_CAM_SHAKE_AMOUNT: 0.010,
    COMET_CAM_SHAKE_DURATION_MS: 0.5 * Phaser.Timer.SECOND,
    ASTEROID_BURST_FADE_DURATION: 0.8 * Phaser.Timer.SECOND,
    COMET_BURST_FADE_DURATION: 1.8 * Phaser.Timer.SECOND,

    // after celestial is deflectd, how long does it blink before it disappears
    DEFLECT_BLINK_DURATION: 0.04 * Phaser.Timer.SECOND,

    // how wide is the barrier (in degrees)
    BARRIER_WIDTH: 0.65,

    // base speed of asteroids
    ASTEROID_SPEED: 30,
    // random spread of asteroid speed, +/-
    ASTEROID_SPEED_SPREAD: 4,

    // base speed of comet
    COMET_SPEED: 15,
    // random spread of comet speed, +/-
    COMET_SPEED_SPREAD: 8,

    // initial velocity of barrage
    BARRAGE_SPEED: 1200,
    BARRAGE_MAX_MULTIPLIER: 2000,

    // The ms delay between asteroids on the default hard setting
    BARRAGE_SINGLE_CEL_HARD_DELAY: 100,
    BARRAGE_SINGLE_CEL_MIN_DELAY: 50,

    // The minimum delay between columns in a column barrage
    BARRAGE_MIN_COLUMN_DELAY: 250,

    // The initial time between barrages
    MAX_TIME_BETWEEN_BARRAGE: 8000,
    MIN_TIME_BETWEEN_BARRAGE: 1000,

    // what is the chance of getting a comet barrage
    PERCENT_CHANCE_OF_COMET_BARRAGE: 10,

    // how long to start the barrage Siren sound before the barrage is spawned
    BARRANGE_WARNING_TIME: 2.8 * Phaser.Timer.SECOND,

    // initial transport speed
    TRANSPORT_SPEED: 14,

    // how fast the transports accelerate away from earth
    TRANSPORT_ACCELERATION: 10,

    // how often can you launch missiles
    MISSILE_INTERVAL: 200,

    // HP/damage config values
    EARTH_HP: 280,
    COMET_DAMAGE: 10,
    ASTEROID_DAMAGE: 4

});