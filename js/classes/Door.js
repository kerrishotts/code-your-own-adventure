import Thing from "./Thing.js";
import {_PROPS} from "./sharedPrivateSymbols.js";

export default class Door extends Thing {
    constructor(props = {}) {
        super(Object.assign({}, {
            fixed: true,
            unlocksWith: undefined,
            locked: false,
            open: false
        }, props));
        this[_PROPS].kind += ":door";
    }

    get unlocksWith() {
        return this[_PROPS].unlocksWith;
    }

    get locked() {
        return this[_PROPS].locked;
    }

    get unlocked() {
        return !this.locked;
    }

    lockUsing(thing) {
        if (thing === this.unlocksWith && this.unlocked) {
            return this.merge({locked: true});
        } else {
            throw new Error ("Already locked!");
        }
    }

    unlockUsing(thing) {
        if (thing === this.unlocksWith && this.locked) {
            return this.merge({locked: false});
        } else {
            throw new Error("Already unlocked!");
        }
    }

    get opened() {
        return this[_PROPS].open;
    }

    get closed() {
        return !this.open;
    }

    open() {
        if (this.unlocked && this.closed) {
            return this.merge({open: true});
        } else {
            throw new Error("Already open, don't do that again");
        }
    }

    close() {
        if (this.unlocked && this.opened) {
            return this.merge({open: close});
        } else {
            throw new Error("Already closed; can't close again.");
        }
    }



};
