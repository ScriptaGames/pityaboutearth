class Barrage {
    constructor() {
        this.init();
    }

    init() {
        this.type = '';
        this.isPerfect = true;
        this.celestials = [];
    }

    isCompletedPerfectly() {
        if (!this.isPerfect) return false;  // Perfect already failed

        let numAlive = 0;

        for (let i = 0, l = this.celestials.length; i < l; i++) {
            let celest = this.celestials[i];

            if (celest.data.isBarrage && !celest.data.beingDestroyed) {
                numAlive++;
            }
        }

        return numAlive === 1;
    }

    /**
     * Put other future barrage related logic here
     */
}
