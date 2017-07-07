import {_PROPS} from "./sharedPrivateSymbols.js";
import errorMatrix from "../util/errorMatrix.js";

export const {
    ImmutableUnableToHandleUnknownActionError
} = errorMatrix({
    "ImmutableUnableToHandleUnknownActionError": "IM1000"
});

export default class Immutable {
    constructor(props = {}) {
        this[_PROPS] = Object.assign({}, props);
    }

    /**
     *
     * taking a reducer syntax (prev, current), apply passed actions and
     * return the new state
     *
     * @static
     * @param {Immutable} [thing=null]
     *
     * TS doesn't like the param below... why? next param hack to get it to compile
     * param {any} [{action:string? = undefined, data:any? = undefined} = {}]
     * @param {any} [obj = {action: undefined, data: undefined}]
     *
     * @returns {Object<Immutable>}
     * @memberof Immutable
     */
    static reducer(thing = null, {action = undefined, data = undefined} = {}) {
        return (thing ? thing : Reflect.construct(this, [])).handleAction(action, data);
    }

    /**
     * Merge this object with changes passed in props
     *
     * @param {any} [props={}]       properties for this thing
     * @returns {Object<Immutable>}
     *
     * @memberof Immutable
     */
    merge(props = {}) {
        return Reflect.construct(this.constructor, [Object.assign({}, this[_PROPS], props)]);
    }

    /**
     * Given action and data, generate a new state
     *
     * @param {string} action
     * @param {any} data
     * @returns {Object<Immutable>}
     * @memberof Immutable
     */
    handleAction(action, data) {
        const actionFn = this[action];
        if (typeof actionFn === "function") {
            return Reflect.apply(actionFn, this, (data && Array.isArray(data)) ? data : [data]);
        } else {
            throw new ImmutableUnableToHandleUnknownActionError("Can't reduce over unknown action ${action}.");
        }
    }
}