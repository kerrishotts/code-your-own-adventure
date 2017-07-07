/**
 * Guards against a specific condition by throwing an error. The expression is
 * already evaluated, so the expression itself should not throw any errors, or
 * this will fail to catch those
 *
 * @export
 * @param {any} expr                    expression to guard against
 * @param {string} message              message to use for error if guard fails
 * @param {any} [Species=Error]       error type to use
 */
export default function guard(expr, message, Species = Error) {
    if (expr) {
        throw Reflect.construct(Species, [message]);
    }
}