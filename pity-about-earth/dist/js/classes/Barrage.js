'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Barrage = function () {
    function Barrage() {
        _classCallCheck(this, Barrage);

        this.init();
    }

    _createClass(Barrage, [{
        key: 'init',
        value: function init() {
            this.type = '';
            this.isPerfect = true;
            this.celestials = [];
        }
    }, {
        key: 'isCompletedPerfectly',
        value: function isCompletedPerfectly() {
            if (!this.isPerfect) return false; // Perfect already failed

            var numAlive = 0;

            for (var i = 0, l = this.celestials.length; i < l; i++) {
                var celest = this.celestials[i];

                if (celest.data.isBarrage && !celest.data.beingDestroyed) {
                    numAlive++;
                }
            }

            return numAlive === 1;
        }

        /**
         * Put other future barrage related logic here
         */

    }]);

    return Barrage;
}();