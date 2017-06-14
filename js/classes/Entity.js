import Thing from "./Thing.js";

export default class Entity extends Thing {
    /**
     * Creates an instance of Entity.
     * @param {any} [{name = undefined, health = 100, stamina = 100,
     *                  strength = 1, level = 1, location = undefined, holding = []}={}]
     *
     * @memberof Entity
     */
    constructor({name = undefined, health = 100, stamina = 100,
                 strength = 1, level = 1, location = undefined, holding = [], extra = {}} = {}) {
        super({name, kind: "entity", extra});

        this._health = health;
        this._stamina = stamina;
        this._strength = strength;
        this._level = level;
        this._location = location;
        this._holding = holding;
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
        return this._health;
    }

    /**
     * Returns true if the entity is dead
     *
     * @readonly
     * @type {boolean}
     * @memberof Entity
     */
    get dead() {
        return this._health <= 0;
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
        return this._health > 0;
    }

    /**
     * Returns true if the entity is hurt
     *
     * @readonly
     * @type {boolean}
     * @memberof Entity
     */
    get hurt() {
        return this._health < 100;
    }

    /**
     * Injure the entity
     *
     * @param {number} howMuch
     *
     * @memberof Entity
     */
    injure(howMuch) {
        this._health -= howMuch;
    }

    /**
     * Heal the entity
     *
     * @param {number} howMuch
     *
     * @memberof Entity
     */
    heal(howMuch) {
        this._health += howMuch;
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
        return this._stamina;
    }

    /**
     * Returns true if winded
     *
     * @readonly
     * @type {boolean}
     * @memberof Entity
     */
    get winded() {
        return this._stamina < 100;
    }

    /**
     * Make the entity rest
     *
     * @param {number} [howMuch=100]
     *
     * @memberof Entity
     */
    rest(howMuch = 100) {
        this._stamina = Math.min(100, this._stamina + howMuch);
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
        return this._strength;
    }

    /**
     * Increase the entity's strength
     *
     * @param {number} howMuch
     *
     * @memberof Entity
     */
    strengthen(howMuch) {
        this._strength += howMuch;
    }

    /**
     * Weaken the entity
     *
     * @param {number} howMuch
     *
     * @memberof Entity
     */
    weaken(howMuch) {
        this._strength -= howMuch;
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
        return this._level;
    }

    /**
     * Level the entity up!
     *
     *
     * @memberof Entity
     */
    levelUp() {
        this._level++;
    }

    /* location */
    /**
     * @type Room
     *
     * @memberof Entity
     */
    get location() {
        return this._location;
    }

    /**
     * @param {Room} l
     * @type Room
     * @memberof Entity
     */
    set location(l) {
        if (l.canHost(this)) {
            if (this._location) {
                if (this._location.canLeave(this)) {
                    this._location.removeEntity(this);
                    l.host(this);
                    this._location = l;
                } else {
                    throw new Error("Entity cannot leave");
                }
            } else {
                l.host(this);
                this._location = l;
            }
        } else {
            throw new Error("Entity cannot enter");
        }
    }

    /* inventory */

    /**
     * Get the entity's inventory
     *
     * @readonly
     * @type {Array<Thing>}
     * @memberof Entity
     */
    get inventory() {
        return this._holding;
    }

    /**
     *
     * @param {Thing} thing
     * @returns {boolean}
     *
     * @memberof Entity
     */

    isHolding(thing) {
        return this._holding.indexOf(thing) > -1;
    }

    /**
     * Picks up thing, if possible
     *
     * @param {Thing} thing
     *
     * @memberof Entity
     */

    pickUp(thing) {
        if (!this.location) {
            throw new Error("Nowhere; can't pick up");
        }
        if (this.isHolding(thing)) {
            throw new Error("Already holding that");
        }
        if (!this.location.canRelease(thing)) {
            throw new Error("Room won't release it");
        }
        if (thing.canBePickedUp) {
            this._holding.push(thing);
            this.location.removeThing(thing);
        }
    }

    /**
     * Drops thing, if possible
     *
     * @param {Thing} thing
     *
     * @memberof Entity
     */
    drop(thing) {
        if (!this.location) {
            throw new Error("Nowhere; can't drop");
        }
        if (!this.isHolding(thing)) {
            throw new Error("Can't drop something not held");
        }
        if (!this.location.canContain(thing)) {
            throw new Error("Room won't accept thing");
        }
        if (thing.canBeDropped) {
            this._holding = this._holding.filter(aThing => aThing !== thing);
            this.location.addThing(thing);
        }
    }

}