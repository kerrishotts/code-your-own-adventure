import Thing from "./Thing.js";
import {_PROPS} from "./sharedPrivateSymbols.js";
import guard from "../util/guard.js";

/**
 * @typedef {Object} EntityProps
 * @extends {ThingProps}
 *
 * @property {number} [health = 100]     the health of the entity on a scale of 0 - 100
 * @property {number} [stamina = 100]    the stamina on a scale 0 - 100
 * @property {number} [strength = 1]     the entity's strength
 * @property {number} [level = 1]        the entity's level
 * @property {string} [location = undefined]   the location of the entity
 * @property {string} [kind = "entity"]  the thing's kind
 */

export default class Entity extends Thing {
    /**
     * Creates an instance of Entity.
     *
     * @param {EntityProps} [props = {}]      properties for this entity
     *
     * @memberof Entity
     */
    constructor(props = {}) {
        let defaultProps = {
            name: undefined,
            droppable: false,
            fixed: true,
            health: 100,
            stamina: 100,
            strength: 1,
            level: 1,
            location: undefined,
            things: [],
            kind: "entity",
        };
        super(Object.assign({}, defaultProps, props));
    }

    /* health management */

    /**
     * Returns the entity's health
     *
     * @readonly
     * @type {number}
     *
     * @memberof Entity
     */
    get health() {
        return this[_PROPS].health;
    }

    /**
     * Returns true if the entity is dead
     *
     * @readonly
     * @type {boolean}
     * @memberof Entity
     */
    get dead() {
        return this.health <= 0;
    }

    /**
     * Returns true if the entity is alive
     *
     * @readonly
     * @type {boolean}
     *
     * @memberof Entity
     */
    get alive() {
        return this.health > 0;
    }

    /**
     * Returns true if the entity is hurt
     *
     * @readonly
     * @type {boolean}
     * @memberof Entity
     */
    get hurt() {
        return this.health < 100;
    }

    /**
     * Injure the entity
     *
     * @param {number} howMuch
     *
     * @memberof Entity
     * @return Entity
     */
    injure(howMuch) {
        return this.merge({health: this.health - howMuch});
    }

    /**
     * Heal the entity
     *
     * @param {number} howMuch
     *
     * @memberof Entity
     * @return Entity
     */
    heal(howMuch) {
        return this.merge({health: this.health + howMuch});
    }

    /* stamina management */

    /**
     * Get the stamina
     *
     * @readonly
     *
     * @type {number}
     * @memberof Entity
     */
    get stamina() {
        return this[_PROPS].stamina;
    }

    /**
     * Returns true if winded
     *
     * @readonly
     * @type {boolean}
     * @memberof Entity
     */
    get winded() {
        return this.stamina < 100;
    }

    /**
     * Make the entity rest
     *
     * @param {number} [howMuch=100]
     *
     * @memberof Entity
     */
    rest(howMuch = 100) {
        return this.merge({stamina: this.stamina + Math.min(100, this.stamina + howMuch)});
    }

    /* strength */

    /**
     * Get the entity's strength
     *
     * @readonly
     * @type {number}
     * @memberof Entity
     */
    get strength() {
        return this[_PROPS]._strength;
    }

    /**
     * Increase the entity's strength
     *
     * @param {number} howMuch
     *
     * @memberof Entity
     * @return Entity
     */
    strengthen(howMuch) {
        return this.merge({strength: this.strength + howMuch});
    }

    /**
     * Weaken the entity
     *
     * @param {number} howMuch
     *
     * @memberof Entity
     * @return Entity
     */
    weaken(howMuch) {
        return this.merge({strength: this.strength - howMuch});
    }

    /* level */

    /**
     * Get the entity's current level
     *
     * @readonly
     * @type {number}
     * @memberof Entity
     */
    get level() {
        return this[_PROPS]._level;
    }

    /**
     * Level the entity up!
     *
     *
     * @memberof Entity
     * @return Entity
     */
    levelUp() {
        return this.merge({strength: this.level + 1});
    }

    /* location */
    /**
     * @type Room
     *
     * @memberof Entity
     */
    get location() {
        return this[_PROPS].location;
    }

    setLocation(aRoom, {force = false} = {}) {
        return this.merge({location: aRoom});
    }

}
