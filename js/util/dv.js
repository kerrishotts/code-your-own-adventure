/**
 * Returns obj[key]() if a function or obj[key] if not. If no value, returns dflt.
 *
 * @param {any} obj
 * @param {string} key
 * @param {any} dflt
 */
export default function dv(obj, key, dflt = undefined) {
    let v;
    if (obj) {
        if (typeof obj[key] === "function") {
            v = obj[key].call(obj, obj);
        } else {
            v = obj[key];
        }
    }
    if (v === undefined || v === null) {
        return dflt;
    } else {
        return v;
    }
}