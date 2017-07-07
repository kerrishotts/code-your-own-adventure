import dv from "../util/dv.js";
import Thing from "./Thing.js";
import {_PROPS} from "./sharedPrivateSymbols.js";

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
        return this[_PROPS].exits;
    }

    getRoomExits(state = null) {
        return (typeof this.exits === "function") ? this.exits(this, state) : this.exits;
    }

    getRoomExitDirections(state = null) {
        const exits = this.getRoomExits(state);
        return Object.keys(exits).filter(dir => exits[dir]);
    }

    canEntityEnter(entity) {
        return this.canAddThing(entity);
    }

    canEntityExit(entity) {
        return this.canRemoveThing(entity);
    }

    getDescription(state = null) {
        const superDesc = super.getDescription(state);
        const exitDirections = this.getRoomExitDirections(state),
              things = this.getThingsExcludingPlayer(state);
        return [
            this.name,
            "\n",
            superDesc,
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
