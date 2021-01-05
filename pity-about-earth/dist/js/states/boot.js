'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BootState = function (_Phaser$State) {
    _inherits(BootState, _Phaser$State);

    function BootState() {
        _classCallCheck(this, BootState);

        return _possibleConstructorReturn(this, (BootState.__proto__ || Object.getPrototypeOf(BootState)).apply(this, arguments));
    }

    _createClass(BootState, [{
        key: 'preload',
        value: function preload() {
            this.game.load.image('loading-bar', 'images/big/loading-bar.png');
        }
    }, {
        key: 'create',
        value: function create() {
            console.log('[boot] booting');
            this.state.start('PreloadState');

            // resize the canvas to fit the screen
            this.game.scale.maxWidth = config.CANVAS_WIDTH;
            this.game.scale.maxHeight = config.CANVAS_HEIGHT;
            this.updateCanvasSize();
            window.addEventListener('resize', this.updateCanvasSize.bind(this));

            // Phaser will automatically pause if the browser tab the game is in
            // loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;

            // Initialize the state transition library
            this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);

            this.game.stateTransition.configure({
                duration: 0.618 * Phaser.Timer.SECOND,
                ease: Phaser.Easing.Exponential.Out,
                properties: {
                    alpha: 0
                }
            });
        }
    }, {
        key: 'updateCanvasSize',
        value: function updateCanvasSize() {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.updateLayout();
            console.log('[boot] resized canvas');
        }
    }]);

    return BootState;
}(Phaser.State);