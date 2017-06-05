/**
 * Returns obj[key]() if a function or obj[key] if not. If no value, returns dflt.
 *
 * @param {any} obj
 * @param {string} key
 * @param {any} dflt
 */
export function dv(obj, key, dflt = undefined) {
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

/**
 * proper cases s
 *
 * @param {string} s
 * @returns
 */
export function properCase(s) {
    return (s.length > 0) ? s[0].toUpperCase() + s.substr(1) : s;
}

/**
 * Print any number of values to the screen
 *
 * @param {HTMLElement} el element
 * @param {any} [arg] Value to print
 */
export function printToEl(el, ...text) {
    el.textContent += text.join("") + String.fromCharCode(13) + String.fromCharCode(10);
}