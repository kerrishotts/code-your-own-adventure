/**
 * Returns obj[key]() if a function or obj[key] if not. If no value, returns dflt.
 *
 * @param {any} obj
 * @param {string} key
 * @param {any} dflt
 */

export default function dv(obj, key, dflt = undefined, thisArg = null) {
    let v, thatArg = thisArg || obj;
    if (obj) {
        v = obj[key];
        if (typeof v === "function") {
            v = Reflect.apply(v, thatArg, [obj]);
        }
    }
    if (v === undefined || v === null) {
        return dflt;
    } else {
        return v;
    }
}