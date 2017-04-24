const config = Object.freeze({

    // skip menu for quick testing
    SKIP_MENU: false,

    // canvas resolution
    CANVAS_WIDTH: 1180,
    CANVAS_HEIGHT: 1920,

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
    BARRIER_WIDTH: 0.6,

    // initial velocity of barrage
    BARRAGE_SPEED: 200,

    // How much variance in initial velocity for each ast in barrage
    BARRAGE_VARIANCE: 25,

    // how long to start the barrage Siren sound before the barrage is spawned
    BARRANGE_WARNING_TIME: 2.8 * Phaser.Timer.SECOND,

    // initial transport speed
    TRANSPORT_SPEED: 100,

    // how fast the transports accelerate away from earth
    TRANSPORT_ACCELERATION: 10,

    // how often can you launch missiles
    MISSILE_INTERVAL: 300,

});
