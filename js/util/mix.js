/*
 * from http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * and https://github.com/justinfagnani/mixwith.js/blob/master/mixwith.js
 */

class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass || class {};
    }

    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}

let mix = (superclass) => new MixinBuilder(superclass);
export default mix;