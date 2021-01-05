'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuState = function (_Phaser$State) {
    _inherits(MenuState, _Phaser$State);

    function MenuState() {
        _classCallCheck(this, MenuState);

        return _possibleConstructorReturn(this, (MenuState.__proto__ || Object.getPrototypeOf(MenuState)).apply(this, arguments));
    }

    _createClass(MenuState, [{
        key: 'create',
        value: function create() {
            var _this2 = this;

            console.log('[menu] showing main menu');

            window.menu = this;

            this.music = this.game.add.audio('MenuMusic', 0.7, true);
            this.music.play();

            var bg = this.game.add.sprite(0, 0, 'background');
            bg.tint = 0x3f3f3f;

            var logo = this.game.add.sprite(this.game.world.centerX, 120, 'logo');
            logo.anchor.set(0.5, 0);
            logo.scale.set(0.96, 0.96);

            this.fontSet = '! "#$%^\'()* +,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz{|}~';

            this.story = ['Humanity, listen up. This is', 'the Universe. I am sick of', 'your incessant nosing about.', 'The incoming asteroid should', 'resolve matters.', '       -- Yours, the Universe', '', '(Protect Earth while shuttles', 'ferry "repopulation experts"', 'to other, safer worlds)'];

            var btnHum = this.game.add.button(this.game.world.centerX, this.game.world.height - 130, 'btn-play', this.next, this, 1, // over
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

            this.drawMissileHelp();
            this.drawBarrierHelp();
        }
    }, {
        key: 'update',
        value: function update() {}
    }, {
        key: 'next',
        value: function next() {
            this.game.stateTransition.to('PlayState');
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            this.music.stop();
        }
    }, {
        key: 'getLine',
        value: function getLine(index) {
            return this.story[i];
        }
    }, {
        key: 'drawBarrierHelp',
        value: function drawBarrierHelp() {
            var x = -370;
            var y = 68;
            var barrier = this.game.add.sprite(this.game.world.centerX + x - 100, this.game.world.height - 670 + y, 'barrier');
            var font = this.game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
            var text = this.game.add.image(80, 80, font);
            text.scale.set(0.5, 0.5);
            font.text = 'Barrier';
            text.tint = 0x777777;
            text.position.x = this.game.world.centerX + x;
            text.position.y = this.game.world.height - 608 + y;
        }
    }, {
        key: 'drawMissileHelp',
        value: function drawMissileHelp() {
            var x = 140;
            var y = 40;
            var mouse = this.game.add.sprite(this.game.world.centerX - 44 + x, this.game.world.height - 600 + y, 'mouse');
            mouse.anchor.set(0.5, 0.5);

            var font = this.game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
            var text = this.game.add.image(80, 80, font);
            text.scale.set(0.5, 0.5);
            font.text = 'Missile';
            text.tint = 0x777777;
            text.position.x = this.game.world.centerX + x;
            text.position.y = this.game.world.height - 608 + y;
        }
    }, {
        key: 'writeLine',
        value: function writeLine(line, index) {
            var font = this.game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
            var text = this.game.add.image(80, 80, font);
            text.scale.set(0.5, 0.5);
            font.text = '';
            // text.tint = 0x51B5E0;
            text.position.x = this.game.world.centerX - 490;;
            text.position.y = index * this.lineHeight + 600;
            var i = 0;

            this.game.time.events.loop(this.timePerChar, function () {
                font.text = line.slice(0, i);
                i += 1;
            }, this);
        }
    }]);

    return MenuState;
}(Phaser.State);