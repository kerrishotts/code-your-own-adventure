import dv from "../util/dv.js";
import Thing from "./Thing.js";

export default class Room extends Thing {
    constructor({name = undefined, desc = undefined, exits = {}, things = [], entities = [], extra = {}} = {}) {
        super({name, desc, kind: "room", extra});

        this._exits = exits;
        this._things = things;
        this._entities = entities;
    }

    /* exits */

    get exits() {
        return dv(this, "_exits");
    }

    /**
     * @type Array<string>
     *
     * @readonly
     *
     * @memberof Room
     */
    get exitDirections() {
        return Object.keys(this.exits)
                     .filter(exit => this.exits[exit]);
    }

    /* things */

    /**
     * @type Array<Thing>
     *
     * @readonly
     *
     * @memberof Room
     */
    get things() {
        return this._things;
    }

    contains(thing) {
        return this.things.indexOf(thing) > -1;
    }

    canContain(thing) {
        return !this.contains(thing);
    }

    canRelease(thing) {
        return this.contains(thing);
    }

    addThing(thing) {
        if (this.contains(thing)) {
            throw new Error("Thing already here");
        } else {
            this._things.push(thing);
        }
    }

    removeThing(thing) {
        if (!this.contains(thing)) {
            throw new Error ("Thing not here");
        } else {
            this._things = this._things.filter(aThing => aThing !== thing);
        }
    }

    /* entities */

    /**
     * @type Array<Entity>
     *
     * @readonly
     *
     * @memberof Room
     */
    get entities() {
        return this._entities;
    }

    hosts(entity) {
        return this.entities.indexOf(entity) > -1;
    }

    canHost(entity) {
        return !this.hosts(entity);
    }

    canLeave(entity) {
        return this.contains(entity);
    }

    host(entity) {
        if (this.contains(entity)) {
            throw new Error("Entity already here");
        } else {
            this._entities.push(entity);
        }
    }

    removeEntity(entity) {
        if (!this.hosts(entity)) {
            throw new Error ("Entity not here");
        } else {
            this._entities = this._entities.filter(anEntity => anEntity !== entity);
        }
    }

    get longInfo() {
        let exitDirections = this.exitDirections,
            things = this.things;
        return [
            this.name, "\n",
            this.desc, "\n",
            things.length > 0 ? "You can see " : "",
            things.length === 1 ? "a " : "",
            things.map(thing => thing.shortInfo).join(", "), "\n",
            exitDirections.length > 0 ? "Exits: " : "",
            exitDirections.join(", "), "\n",
        ]
    }
}