const config = Object.freeze({

    // skip menu for quick testing
    SKIP_MENU: false,

    // canvas resolution
    CANVAS_WIDTH: 1180,
    CANVAS_HEIGHT: 1920,

    // for attacking, how long to press before asteroid turns into comet
    COMET_PRESS_DELAY: 0.4 * Phaser.Timer.SECOND,

    // impact effects
    ASTEROID_CAM_SHAKE_AMOUNT: 0.002,
    ASTEROID_CAM_SHAKE_DURATION_MS: 0.1 * Phaser.Timer.SECOND,
    COMET_CAM_SHAKE_AMOUNT: 0.008,
    COMET_CAM_SHAKE_DURATION_MS: 0.5 * Phaser.Timer.SECOND,

    // after celestial is deflectd, how long does it blink before it disappears
    DEFLECT_BLINK_DURATION: 0.04 * Phaser.Timer.SECOND,

    // how wide is the barrier (in degrees)
    BARRIER_WIDTH: 0.6,

    // initial velocity of barrage
    BARRAGE_SPEED: 200,

    // How much variance in initial velocity for each ast in barrage
    BARRAGE_VARIANCE: 25,

});
