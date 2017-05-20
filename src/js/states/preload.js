class PreloadState extends Phaser.State {
    preload() {
        console.log('[preload] preloading assets');

        // loading bar

        this.loadingBar = this.game.add.sprite(config.CANVAS_WIDTH/2 - 300, this.game.world.centerY, 'loading-bar');
        this.load.setPreloadSprite(this.loadingBar);
        this.loadingBar.anchor.set(0, 0.5);

        // images

        this.game.load.image('logo', 'images/big/logo.png');
        this.game.load.image('asteroid', 'images/big/asteroid.png');
        this.game.load.image('background', 'images/big/background.png');
        this.game.load.image('comet', 'images/big/comet.png');
        this.game.load.image('barrier', 'images/big/barrier.png');
        this.game.load.image('missile-boom', 'images/big/missile-boom.png');
        this.game.load.image('mouse', 'images/big/mouse.png');
        this.game.load.image('big-one', 'images/big/big-one.png');
        this.game.load.image('dots', 'images/big/dotdotdot.png');
        this.game.load.image('uh-oh', 'images/big/uh-oh.png');
        this.game.load.image('person', 'images/big/person.png');
        this.game.load.image('compass', 'images/big/touch-center.png');
        this.game.load.image('touch_segment', 'images/big/touch-lead.png');
        this.game.load.image('touch', 'images/big/touch-lead.png');
        this.game.load.image('earth-small', 'images/big/earth-small.png');
        this.game.load.image('healthbar', 'images/big/healthbar.png');


        // Sprite sheets

        this.game.load.spritesheet('earth-sheet', 'images/big/earth.png', 32*10, 32*10);
        this.game.load.spritesheet('health-filling', 'images/big/health-filling.png', 38*10, 2*10);
        this.game.load.spritesheet('earth-boom-sheet', 'images/big/earth-boom-sheet.png', 10, 10);
        this.game.load.spritesheet('earth-boom2-sheet', 'images/big/missile-boom.png', 10, 10);
        this.game.load.spritesheet('asteroid-sheet', 'images/big/asteroid-sheet.png', 8*10, 8*10);
        this.game.load.spritesheet('asteroid-boom-sheet', 'images/big/asteroid-sheet.png', 10, 10);
        this.game.load.spritesheet('comet-sheet', 'images/big/comet-sheet.png', 16*10, 16*10);
        this.game.load.spritesheet('comet-boom-sheet', 'images/big/comet-sheet.png', 10, 10);
        this.game.load.spritesheet('transport-sheet', 'images/big/transport-sheet.png', 16*10, 16*10);
        this.game.load.spritesheet('missile-sheet', 'images/big/missile.png', 3*10, 14*10);
        this.game.load.spritesheet('btn-play', 'images/big/button-play.png', 64*10, 24*10);
        this.game.load.spritesheet('target-sheet', 'images/big/target-sheet.png', 15*10, 15*10);
        this.game.load.spritesheet('perfect-sheet', 'images/big/perfect-sheet.png', 29*10, 7*10);

        this.game.load.image('gelatin-font', 'images/big/gelatin-font.png');

        // audio

        this.game.load.audio('MenuMusic', 'sounds/Songs/MainMenu_Track.mp3');
        this.game.load.audio('PlayMusic', 'sounds/Songs/Playing_Track.mp3');
        this.game.load.audio('VictoryMusic', 'sounds/Songs/Victory_Track.mp3');
        this.game.load.audio('DefeatMusic', 'sounds/Songs/Defeat_Track.mp3');

        this.game.load.audio('AsteroidHit1'     , 'sounds/Effects/Effect_AsteroidHit1.mp3');
        this.game.load.audio('AsteroidHit2'     , 'sounds/Effects/Effect_AsteroidHit2.mp3');
        this.game.load.audio('ButtonTap'        , 'sounds/Effects/Effect_ButtonTap.mp3');
        this.game.load.audio('DropExplosion'    , 'sounds/Effects/Effect_DropExplosion.mp3');
        this.game.load.audio('MissileExplosion' , 'sounds/Effects/Effect_MissileExplosion.mp3');
        this.game.load.audio('MissileLaunch'    , 'sounds/Effects/Effect_MissileLaunch.mp3');
        this.game.load.audio('EscapeLaunch2'    , 'sounds/Effects/Effect_EscapeLaunch2.mp3');
        this.game.load.audio('EscapeLaunch'     , 'sounds/Effects/Effect_EscapeLaunch.mp3');
        this.game.load.audio('Random'           , 'sounds/Effects/Effect_Random.mp3');
        this.game.load.audio('Random2'          , 'sounds/Effects/Effect_Random2.mp3');
        this.game.load.audio('Random3'          , 'sounds/Effects/Effect_Random3.mp3');
        this.game.load.audio('Random4'          , 'sounds/Effects/Effect_Random4.mp3');
        this.game.load.audio('Random5'          , 'sounds/Effects/Effect_Random5.mp3');
        this.game.load.audio('Random6'          , 'sounds/Effects/Effect_Random6.mp3');
        this.game.load.audio('Siren'            , 'sounds/Effects/Effect_Siren.mp3');
        this.game.load.audio('Barrier'          , 'sounds/Effects/Effect_Barrier.mp3');
        this.game.load.audio('Rocket1'          , 'sounds/Effects/Effect_Rocket1.mp3');
        this.game.load.audio('Rocket2'          , 'sounds/Effects/Effect_Rocket2.mp3');

    }

    create() {
        this.state.start('MenuState');
    }
}

