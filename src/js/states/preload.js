class PreloadState extends Phaser.State {
    preload() {
        console.log('[preload] preloading assets');

        // images

        this.game.load.image('asteroid', 'images/big/asteroid.png');
        this.game.load.image('background', 'images/big/background.png');
        this.game.load.image('comet', 'images/big/comet.png');
        this.game.load.image('earth', 'images/big/earth.png');
        this.game.load.image('barrier', 'images/big/barrier.png');
        this.game.load.image('barrier-full', 'images/big/barrier-full.png');

        this.game.load.image('btn-play',     'images/big/button-play.png');

        // Sprite sheets

        // this.game.load.spritesheet('sheet', 'images/sheet.png', 44, 44, 30);

        // audio

        this.game.load.audio('AsteroidHit1', 'sounds/Effects/Effect_AsteroidHit1.ogg');
        this.game.load.audio('AsteroidHit2', 'sounds/Effects/Effect_AsteroidHit2.ogg');
        this.game.load.audio('ButtonTap', 'sounds/Effects/Effect_ButtonTap.ogg');
        this.game.load.audio('Random', 'sounds/Effects/Effect_Random.ogg');
        this.game.load.audio('Siren', 'sounds/Effects/Effect_Siren.ogg');
        this.game.load.audio('MenuMusic', 'sounds/Songs/MainMenu_Track.ogg');
        this.game.load.audio('PlayMusic', 'sounds/Songs/Playing_Track.ogg');

        // shaders

        // this.game.load.text('portal-frag' , 'shaders/portal.frag');

    }

    create() {
        this.state.start('MenuState');
    }
}

