import dv from "../util/dv.js";
import Thing from "./Thing.js";
import {_PROPS} from "./sharedPrivateSymbols.js";

import {RENDER_KEYS} from "./Thing.js";

export default class Room extends Thing {
    constructor(props = {}) {
        let defaultProps = {
            name: undefined,
            desc: undefined,
            kind: "room",
            exits: {},
            entities: [],
        };
        super(Object.assign({}, defaultProps, props));
    }

    /* exits */

    get exits() {
        return dv(this[_PROPS], "exits", undefined, this);
    }

    /**
     * @type Array<string>
     *
     * @readonly
     *
     * @memberof Room
     */
    get exitDirections() {
        return Object.keys(this.exits).filter(exit => this.exits[exit]);
    }

    canEntityEnter(entity) {
        return this.canAddThing(entity);
    }

    canEntityExit(entity) {
        return this.canRemoveThing(entity);
    }

    render(key = "short", state = null) {
        let r = super.render(key, state);
        switch(key) {
            case RENDER_KEYS.LONG: {
                let exitDirections = this.exitDirections,
                    things = this.render(RENDER_KEYS.THINGS_WITHOUT_PLAYER, state);
                return [
                    this.name,
                    "\n",
                    this.desc,
                    "\n",
                    things.length > 0 ? "You can see " : "",
                    things.length === 1 ? "a " : "",
                    things.map(thing => state.getThingByName(thing).shortInfo).join(", "),
                    "\n",
                    exitDirections.length > 0 ? "Exits: " : "",
                    exitDirections.join(", "),
                    "\n",
                ];
            }
        }
        return r;
    }
}
