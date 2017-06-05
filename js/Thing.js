import {dv} from "./util.js";

export default class Thing {

    /**
     * Creates an instance of Thing.
     * @param {any} [{ name = undefined, fixed = false, kind = "thing", visible = true }={}]
     *
     * @memberof Thing
     */
    constructor({ name = undefined, aliases = [], desc = undefined, fixed = false,
                  kind = "thing", visible = true, droppable = true, extra = {} } = {}) {
        this._name = name;
        this._aliases = aliases;
        this._desc = desc;
        this._fixed = fixed;
        this._kind = kind;
        this._visible = visible;
        this._droppable = droppable;

        if (extra) {
            Object.keys(extra).forEach(k => {
                this[`_${k}`] = extra[k];
            });
        }
    }

    /**
     * Returns the kind
     *
     * @readonly
     * @type {string}
     * @memberof Thing
     */
    get kind() {
        return this._kind;
    }

    /* name */
    /**
     * Returns the name
     * @type {string}
     * @memberof Thing
     */
    get name() {
        return dv(this, "_name");
    }

    /**
     * Sets the name
     *
     * @param {string} n
     * @memberof Thing
     */
    set name(n) {
        this._name = n;
    }

    /**
     * @type Array<string>
     *
     * @readonly
     *
     * @memberof Thing
     */
    get aliases() {
        return this._aliases;
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
        return dv(this, "_desc");
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
        return dv(this, "_fixed");
    }

    set fixed(f) {
        this._fixed = f;
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
        return this.fixed;
    }

    /**
     * If true, item can be dropped
     *
     * @type boolean
     *
     * @readonly
     *
     * @memberof Thing
     */

    get canBeDropped() {
        return dv(this, "_droppable");
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
        return dv(this, "_visible");
    }

    /**
     * Hides the item
     *
     * @memberof Thing
     */
    hide() {
        this._visible = false;
    }

    /**
     * Shows the item
     *
     * @memberof Thing
     */
    show() {
        this._visible = true;
    }

    get shortInfo() {
        return this.name;
    }

    get longInfo() {
        return [
            this.name, "\n",
            this.desc, "\n"
        ];
    }

}