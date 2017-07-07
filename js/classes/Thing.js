import dv from "../util/dv.js";
import {_PROPS} from "./sharedPrivateSymbols.js";
import guard from "../util/guard.js";
import errorMatrix from "../util/errorMatrix.js";
import Immutable from "./Immutable.js";
import GameState from "./GameState.js";

export const {
    ThingCannotAddThingError,
    ThingRefusedAddingThingError,
    ThingCannotRemoveThingError,
    ThingRefusedRemovingThingError,
    ThingUnableToHandleUnknownActionError
} = errorMatrix({
    "ThingCannotAddThingError": "FT1000",
    "ThingRefusedAddingThingError": "FT1001",
    "ThingCannotRemoveThingError": "FT1100",
    "ThingRefusedRemovingThingError": "FT1101",
    "ThingUnableToHandleUnknownActionError": "FT1999"
});

export const RENDER_KEYS = {
    SHORT: "short",
    LONG: "long",
    THINGS_WITHOUT_PLAYER: "things:no-player"
};

/**
 * @typedef {Object} ThingProps
 *
 * @property {string}   [name = undefined]      the name of the thing (also becomes a token)
 * @property {string[]} [aliases = []]          array of aliases (becomes tokens)
 * @property {string}   [desc = undefined]      description of the thing
 * @property {string}   [kind = "thing"]        what kind of thing is this? "thing", "entity", etc.
 * @property {string[]} [things = []]           array of things that this thing contains, carries, owns, etc. (by ID)
 * @property {boolean}  [fixed = false]         if fixed, thing can't be taken or moved
 * @property {boolean}  [droppable = true]      if false, can't be dropped
 * @property {boolean}  [visible = true]        determines visibility to the player and other entities
 */

export default class Thing extends Immutable{
    /**
     * Creates an instance of Thing.
     *
     * @param {ThingProps} [props = {}]      properties for this thing
     *
     * @memberof Thing
     */
    constructor(props = {}) {
        let defaultProps = {
            name: undefined,
            aliases: [],
            things: [],
            desc: undefined,
            fixed: false,
            kind: "thing",
            visible: true,
            droppable: true,
        }
        super(Object.assign({}, defaultProps, props));
    }

    /**
     * Returns the kind
     *
     * @readonly
     * @type {string}
     * @memberof Thing
     */
    get kind() {
        return this[_PROPS].kind;
    }

    /* name */
    /**
     * Returns the name
     * @type {string}
     * @memberof Thing
     */
    get name() {
        return dv(this[_PROPS], "name", undefined, this);
    }

    /**
     * Sets the name
     *
     * @param {string} n
     * @memberof Thing
     * @return {Thing}
     */
    setName(n) {
        return this.merge({name: n});
    }

    /**
     * @type Array<string>
     *
     * @readonly
     *
     * @memberof Thing
     */
    get aliases() {
        return this[_PROPS].aliases;
    }

    /* description */

    /**
     * @type string
     *
     * @readonly
     *
     * @memberof Thing
     */
    get desc() {
        return dv(this[_PROPS], "desc", undefined, this);
    }

    /* fixed */
    /**
     * Returns if immovable
     *
     * @type boolean
     *
     * @memberof Thing
     */
    get fixed() {
        return dv(this[_PROPS], "fixed", undefined, this);
    }

    setFixed(f) {
        return this.merge({fixed: f});
    }

    /**
     * If true, item can be picked up
     *
     * @type boolean
     *
     * @readonly
     *
     * @memberof Thing
     */
    get canBePickedUp() {
        return !this.fixed;
    }

    /**
     * If true, item can be dropped
     *
     * @type boolean
     *
     * @readonly
     *
     * @memberof Thing
     * @return Thing
     */

    get canBeDropped() {
        return dv(this[_PROPS], "droppable", undefined, this);
    }

    /* visibility */
    /**
     * @type boolean
     *
     * @readonly
     *
     * @memberof Thing
     */
    get visible() {
        return dv(this[_PROPS], "visible", undefined, this);
    }

    /**
     * Hides the item
     *
     * @memberof Thing
     * @return Thing
     */
    hide() {
        return this.merge({visible: false});
    }

    /**
     * Shows the item
     *
     * @memberof Thing
     * @return Thing
     */
    show() {
        return this.merge({visible: true});
    }

    /**
     * Returns a short string describing the object (usually the name)
     * @type {string}
     * @readonly
     * @memberof Thing
     */
    get shortInfo() {
        return this.name;
    }

    /**
     * Returns a longer description of the object (usually name and description)
     * usually suitable for printing
     * @type {string[]}
     * @readonly
     * @memberof Thing
     */
    get longInfo() {
        return [this.name, "\n", this.desc, "\n"];
    }

    /**
     *
     * @param {string} [key="short"]
     * @param {GameState} [state={}]
     * @returns {any}
     * @memberof Thing
     */
    render(key = "short", state = null) {
        switch(key) {
            default:
            case "short":
                return this.shortInfo;
            case "long":
                return this.longInfo;
            case "things:no-player":
                return this.things.filter(thing => state.getThingByName(thing).kind !== "player");
        }
    }

    /* things management */

    get things() {
        return this[_PROPS].things;
    }

    /**
     * Returns true if this thing contains aThing.
     *
     * @param {string} aThing
     * @returns {boolean}
     *
     * @memberof Thing
     */
    hasThing(aThing) {
        return this[_PROPS].things.indexOf(aThing) > -1;
    }

    canAddThing(aThing) {
        return !this.hasThing(aThing);
    }

    canRemoveThing(aThing) {
        return this.hasThing(aThing);
    }

    /**
     * Add something to the thing's things
     *
     * @param {string} aThing
     *
     * @memberof Thing
     * @return {Thing}
     */
    addThing(aThing, {force = false} = {}) {
        guard(this.hasThing(aThing), "Can't add something that's already present", ThingCannotAddThingError);
        guard(!this.canAddThing(aThing) && !force, "Can't add that just now.", ThingRefusedAddingThingError);

        let newThings = this.things.map(i => i).concat(aThing);
        return this.merge({things: newThings});
    }

    /**
     * Remove something from the thing's things
     *
     * @param {string} aThing
     * @returns {Thing}
     *
     * @memberof Thing
     */
    removeThing(aThing, {force = false} = {}) {
        guard(!this.hasThing(aThing), "Can't take something that's not present", ThingCannotRemoveThingError);
        guard(!this.canRemoveThing(aThing) && !force, "Can't take that just now.", ThingRefusedRemovingThingError);

        let newThings = this.things.filter(i => i !== aThing);
        return this.merge({things: newThings});
    }
}
