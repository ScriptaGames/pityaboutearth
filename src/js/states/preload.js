class PreloadState extends Phaser.State {
    preload() {
        console.log('[preload] preloading assets');

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


        // Sprite sheets

        this.game.load.spritesheet('earth-sheet', 'images/big/earth.png', 32*10, 32*10);
        this.game.load.spritesheet('earth-small', 'images/earth.png', 32, 32);
        this.game.load.spritesheet('healthbar', 'images/big/healthbar.png', 40*10, 4*10);
        this.game.load.spritesheet('health-filling', 'images/big/health-filling.png', 38*10, 2*10);
        this.game.load.spritesheet('earth-boom-sheet', 'images/big/earth-boom-sheet.png', 10, 10);
        this.game.load.spritesheet('earth-boom2-sheet', 'images/big/missile-boom.png', 10, 10);
        this.game.load.spritesheet('asteroid-sheet', 'images/big/asteroid-sheet.png', 8*10, 8*10);
        this.game.load.spritesheet('asteroid-boom-sheet', 'images/big/asteroid-sheet.png', 10, 10);
        this.game.load.spritesheet('comet-sheet', 'images/big/comet-sheet.png', 16*10, 16*10);
        this.game.load.spritesheet('comet-boom-sheet', 'images/big/comet-sheet.png', 10, 10);
        this.game.load.spritesheet('transport-sheet', 'images/big/transport-sheet.png', 16*10, 16*10);
        this.game.load.spritesheet('missile-sheet', 'images/big/missile.png', 3*10, 14*10);
        this.game.load.spritesheet('btn-play',     'images/big/button-play.png', 64*10, 24*10);
        // this.game.load.spritesheet('sheet', 'images/sheet.png', 44, 44, 30);

        this.game.load.image('gelatin-font', 'images/big/gelatin-font.png');

        // audio

        this.game.load.audio('MenuMusic', 'sounds/Songs/MainMenu_Track.ogg');
        this.game.load.audio('PlayMusic', 'sounds/Songs/Playing_Track.ogg');
        this.game.load.audio('VictoryMusic', 'sounds/Songs/Victory_Track.ogg');
        this.game.load.audio('DefeatMusic', 'sounds/Songs/Defeat_Track.ogg');

        this.game.load.audio('AsteroidHit1'     , 'sounds/Effects/Effect_AsteroidHit1.ogg');
        this.game.load.audio('AsteroidHit2'     , 'sounds/Effects/Effect_AsteroidHit2.ogg');
        this.game.load.audio('ButtonTap'        , 'sounds/Effects/Effect_ButtonTap.ogg');
        this.game.load.audio('DropExplosion'    , 'sounds/Effects/Effect_DropExplosion.ogg');
        this.game.load.audio('MissileExplosion' , 'sounds/Effects/Effect_MissileExplosion.ogg');
        this.game.load.audio('MissileLaunch'    , 'sounds/Effects/Effect_MissileLaunch.ogg');
        this.game.load.audio('EscapeLaunch2'    , 'sounds/Effects/Effect_EscapeLaunch2.ogg');
        this.game.load.audio('EscapeLaunch'     , 'sounds/Effects/Effect_EscapeLaunch.ogg');
        this.game.load.audio('Random'           , 'sounds/Effects/Effect_Random.ogg');
        this.game.load.audio('Random2'          , 'sounds/Effects/Effect_Random2.ogg');
        this.game.load.audio('Random3'          , 'sounds/Effects/Effect_Random3.ogg');
        this.game.load.audio('Random4'          , 'sounds/Effects/Effect_Random4.ogg');
        this.game.load.audio('Random5'          , 'sounds/Effects/Effect_Random5.ogg');
        this.game.load.audio('Random6'          , 'sounds/Effects/Effect_Random6.ogg');
        this.game.load.audio('Siren'            , 'sounds/Effects/Effect_Siren.ogg');
        this.game.load.audio('Barrier'          , 'sounds/Effects/Effect_Barrier.ogg');
        this.game.load.audio('Rocket1'          , 'sounds/Effects/Effect_Rocket1.ogg');
        this.game.load.audio('Rocket2'          , 'sounds/Effects/Effect_Rocket2.ogg');

        // shaders

        // this.game.load.text('portal-frag' , 'shaders/portal.frag');

    }

    create() {
        this.state.start('MenuState');
    }
}

