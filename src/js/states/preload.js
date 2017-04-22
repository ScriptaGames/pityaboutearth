class PreloadState extends Phaser.State {
    preload() {
        console.log('[preload] preloading assets');

        // images

        // this.game.load.image('example', 'images/example.png');

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

