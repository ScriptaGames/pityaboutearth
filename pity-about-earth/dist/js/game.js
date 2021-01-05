'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Game = function (_Phaser$Game) {
    _inherits(Game, _Phaser$Game);

    function Game() {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Phaser.AUTO, 'phaser-engage', null, false, false));

        _this.state.add('BootState', BootState, false);
        _this.state.add('PreloadState', PreloadState, false);
        _this.state.add('MenuState', MenuState, false);
        _this.state.add('PlayState', PlayState, false);
        _this.state.add('ScoreState', ScoreState, false);

        _this.forceSingleUpdate = false; // decouple physics from framerate

        _this.state.start('BootState');
        return _this;
    }

    return Game;
}(Phaser.Game);