'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScoreState = function (_Phaser$State) {
    _inherits(ScoreState, _Phaser$State);

    function ScoreState() {
        _classCallCheck(this, ScoreState);

        return _possibleConstructorReturn(this, (ScoreState.__proto__ || Object.getPrototypeOf(ScoreState)).apply(this, arguments));
    }

    _createClass(ScoreState, [{
        key: 'init',
        value: function init(_ref) {
            var stats = _ref.stats,
                music = _ref.music;

            this.stats = stats;
            this.previousMusic = music;
        }
    }, {
        key: 'create',
        value: function create() {
            var _this2 = this;

            console.log('[score] showing score menu');

            window.menu = this;

            this.music = this.game.add.audio('VictoryMusic', 0.7, true);

            var bg = this.game.add.sprite(0, 0, 'background');
            bg.tint = 0x3f3f3f;
            bg.alpha = 0.6;

            var logo = this.game.add.sprite(this.game.world.centerX, 120, 'logo');
            logo.anchor.set(0.5, 0);
            logo.scale.set(0.96, 0.96);

            this.fontSet = '! "#$%^\'()* +,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz{|}~';

            var score = this.stats.transportsLaunched * 1000;
            var hiscore = JSON.parse(localStorage.hiscore || '0');

            localStorage.hiscore = Math.max(hiscore, score);

            console.log('[play] score is ' + score);
            if (score > hiscore) {
                console.log('[play] ' + score + ' > ' + hiscore + ', new HISCORE!!!');
            } else {
                console.log('[play] hiscore is still ' + hiscore);
            }

            if (this.stats.transportsLaunched === 0) {
                this.story = ['Really, you saved ZERO', 'people?  You monster.'];
            } else if (this.stats.transportsLaunched < 20) {
                this.story = ['You saved ' + score, 'people... that\'s not nearly', 'enough to repopulate the', 'species.', '', 'Humanity is doomed.', '', '"Job well done!" -- Universe'];
            } else if (this.stats.transportsLaunched >= 45) {
                this.previousMusic.fadeOut(100);
                this.music.fadeIn(100, true);
                this.story = ['WOW, you saved ' + score, 'people!!!  Humanity survives!'];
            } else {
                this.music.play();
                this.previousMusic.fadeOut(100);
                this.music.fadeIn(100, true);
                this.story = ['Well done, you saved ' + score, 'people.  Humanity is probably', 'still doomed, but will have', 'a good time with the', 'repopulation effort.'];
            }

            var btnHum = game.add.button(game.world.centerX, game.world.height - 130, 'btn-play', this.next, this, 1, // over
            0, // out
            2 // down
            );
            btnHum.anchor.set(0.5, 1);
            btnHum.onDownSound = this.game.add.audio('ButtonTap');
            btnHum.onOverSound = this.game.add.audio('Barrier');
            btnHum.input.useHandCursor = false;

            if (config.SKIP_MENU) {
                this.next();
            }

            this.timeBetweenLines = 150;
            this.timePerChar = 40;
            this.lineHeight = 60;

            var acc = 0;
            this.story.forEach(function (line, i) {
                _this2.game.time.events.add(i * _this2.timeBetweenLines + acc, function () {
                    _this2.writeLine(line, i);
                }, _this2);
                acc += line.length * _this2.timePerChar;
            });
        }
    }, {
        key: 'next',
        value: function next() {
            this.game.stateTransition.to('PlayState');
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            this.music.stop();
            this.previousMusic.stop();
        }
    }, {
        key: 'getLine',
        value: function getLine(index) {
            return this.story[i];
        }
    }, {
        key: 'writeLine',
        value: function writeLine(line, index) {
            var font = game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
            var text = this.game.add.image(80, 80, font);
            text.scale.set(0.5, 0.5);
            font.text = '';
            // text.tint = 0x51B5E0;
            text.position.x = this.game.world.centerX - 490;
            text.position.y = index * this.lineHeight + 636;
            var i = 0;

            this.game.time.events.loop(this.timePerChar, function () {
                font.text = line.slice(0, i);
                i += 1;
            }, this);
        }
    }]);

    return ScoreState;
}(Phaser.State);