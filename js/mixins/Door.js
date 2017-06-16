let Door = (superclass) => class extends superclass {
    constructor(props = {}, ...args) {
        super(Object.create({}, props, {
            fixed: true,
            droppable: false,
            extras: {
                unlocksWith: props.unlocksWith,
                locked: props.locked === undefined ? false : props.locked,
                open: props.open === undefined ? false : props.open
            }
        }), ...args);
        this._kind += ":door";
    }

    get unlocksWith() {
        return this._unlocksWith;
    }

    set unlocksWith(thing) {
        this._unlocksWith = thing;
    }

    get locked() {
        return this._locked;
    }

    get unlocked() {
        return !this._locked;
    }

    lockUsing(thing) {
        if (thing === this._unlocksWith && this.unlocked) {
            this._locked = true;
        } else {
            throw new Error ("Already locked!");
        }
    }

    unlockUsing(thing) {
        if (thing === this._unlocksWith && this.locked) {
            this._locked = false;
        } else {
            throw new Error("Already unlocked!");
        }
    }

    get opened() {
        return this._open;
    }

    get closed() {
        return !this._open;
    }

    open() {
        if (this.unlocked && this.closed) {
            this._open = true;
        } else {
            throw new Error("Already open, don't do that again");
        }
    }



};

export default Door;