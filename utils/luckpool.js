// Create a Luckpool with any amount of items with a differing poolsize to make
class Luckpool {
    constructor() {
        this.items = [];
        this.totalpoolsize = 0;
    }
    add(poolsize, attributes) {
        this.totalpoolsize += poolsize;
        this.items.push({poolsize, attributes})
    }
    get() {
        let picked_item = null;
        let rdm = Math.random() * this.totalpoolsize;
        this.items.forEach((item) => {
            if (picked_item != null) {
                return;
            }
            if (rdm < item.poolsize) {
                picked_item = item.attributes;
            } else {
                rdm -= item.poolsize;
            }
        })
        return picked_item;
    }
}
exports.Luckpool = Luckpool;