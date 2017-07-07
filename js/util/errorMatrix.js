/**
 * Returns a matrix of extended Errors given codes and class names
 *
 * @export
 * @param {any} [errors={}]
 * @returns {Object}
 */
export default function errorMatrix(errors = {}) {
    return Object.entries(errors).reduce((acc, [className, code]) => {
        acc[className] = class extends Error {
            constructor(message) {
                super(message);
                this.code = code;
            }
            [Symbol.toStringTag]() {
                return className;
            }
        };
        return acc;
    }, {});
}