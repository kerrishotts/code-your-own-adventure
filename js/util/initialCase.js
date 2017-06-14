/**
 * initial cases s
 *
 * @param {string} s
 * @returns
 */
export default function initialCase(s) {
    return (s.length > 0) ? s[0].toUpperCase() + s.substr(1) : s;
}
