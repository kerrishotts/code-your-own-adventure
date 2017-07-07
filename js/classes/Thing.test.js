/* global describe, it */
import "mocha";
import GameState from "./GameState.js";
import Thing from "./Thing.js";
import buildThings from "../story/things.js";

import {ThingCannotAddThingError, ThingRefusedAddingThingError,
        ThingCannotRemoveThingError, ThingRefusedRemovingThingError} from "./Thing.js";
import {ImmutableUnableToHandleUnknownActionError} from "./Immutable.js";

import {RENDER_KEYS} from "./Thing.js";

import {expect} from "chai";

describe("Thing Tests", function() {
    describe("#create", function() {
        it("should be able to be created with no props", function() {
            const thing = new Thing();
            expect(thing).to.exist;
            expect(thing).to.have.property("fixed", false);
            expect(thing).to.have.property("visible", true);
            expect(thing).to.have.property("canBeDropped", true);
            expect(thing).to.have.property("canBePickedUp", true);
            expect(thing).to.have.property("kind", "thing");
            expect(thing).to.have.property("aliases").with.lengthOf(0);
            expect(thing).to.have.property("things").with.lengthOf(0);
        });
        it("should be able to create a flower", function() {
            const name = "flower",
                  desc = "A beautiful flower, petals extended and glimmering, and leaves stretched out.",
                  flower = new Thing({ name, desc });
            expect(flower).to.exist;
            expect(flower).to.have.property("name", name);
            expect(flower).to.have.property("desc", desc);
            expect(flower).to.have.property("shortInfo", name);
            expect(flower).to.have.property("longInfo").and.deep.equal([name, "\n", desc, "\n"]);
        });
        it("should be able to create a treasure key with an alias token", function() {
            const name = "rusty key",
                  aliases = ["key"],
                  desc = "An incredibly rusty key; it almost falls to pieces in your hands.",
                  treasureKey = new Thing({name, aliases, desc});
            expect(treasureKey).to.exist;
            expect(treasureKey).to.have.property("name", name);
            expect(treasureKey).to.have.property("desc", desc);
            expect(treasureKey).to.have.property("aliases").with.lengthOf(1);
            expect(treasureKey).to.have.property("aliases").and.deep.equal(aliases);
        });
    });
    describe("#clone", function() {
        it("should be able clone itself exactly", function() {
            const thing = new Thing({name: "thing"}),
                  merge = thing.merge();
            expect(merge).to.exist;
            expect(merge).to.deep.equal(thing);
        });
        it("should be able to merge itself, updating name", function() {
            const thing = new Thing({name: "thing"}),
                  merge = thing.merge({name: "merge"});
            expect(merge).to.exist;
            expect(thing).to.exist;
            expect(thing).to.have.property("name", "thing");
            expect(thing).to.have.property("fixed", false);
            expect(merge).to.have.property("name", "merge");
            expect(merge).to.have.property("fixed", false);
        });
        it("should be able to merge itself, updating name and fixed", function() {
            const thing = new Thing({name: "thing"}),
                  merge = thing.merge({name: "merge", fixed: true});
            expect(merge).to.exist;
            expect(thing).to.exist;
            expect(thing).to.have.property("name", "thing");
            expect(thing).to.have.property("fixed", false);
            expect(merge).to.have.property("name", "merge");
            expect(merge).to.have.property("fixed", true);
        });
    });
    describe("#functions returning merges", function() {
        it("should be able to set the name", function() {
            const thing = new Thing({name: "thing"}),
                  newThing = thing.setName("newThing");
            expect(thing).to.have.property("name", "thing");
            expect(newThing).to.have.property("name", "newThing");
        });
        it("should be able to set fixed", function() {
            const thing = new Thing({name: "thing"}),
                  newThing = thing.setFixed(true);
            expect(thing).to.have.property("fixed", false);
            expect(newThing).to.have.property("fixed", true);
        });
        it("should be able to disappear and reappear", function() {
            const thing = new Thing({name: "thing"}),
                  newThing = thing.hide(),
                  anotherThing = thing.show();
            expect(thing).to.have.property("visible", true);
            expect(newThing).to.have.property("visible", false);
            expect(anotherThing).to.have.property("visible", true);
        });
    });
    describe("#thing management (inventory)", function() {
        it("should be able to add something that isn't present", function() {
            const thing = new Thing({name: "thing"}),
                  newThing = thing.addThing("flower");
            expect(thing).to.have.property("things").and.deep.equal([]);
            expect(newThing).to.have.property("things").and.deep.equal(["flower"]);
        });
        it("should be unable to add something that is present", function() {
            try {
                const thing = new Thing({name: "thing", things: ["flower"]}),
                    newThing = thing.addThing("flower");
            } catch (err) {
                expect(err).to.be.instanceof(ThingCannotAddThingError);
            }
        });
        it("should be unable to remove something that isn't present", function() {
            try {
            const thing = new Thing({name: "thing"}),
                  newThing = thing.removeThing("flower");
            } catch (err) {
                expect(err).to.be.instanceof(ThingCannotRemoveThingError);
            }
        });
        it("should be able to remove something that is present", function() {
            const thing = new Thing({name: "thing", things: ["flower"]}),
                  newThing = thing.removeThing("flower");
            expect(thing).to.have.property("things").and.deep.equal(["flower"]);
            expect(newThing).to.have.property("things").and.deep.equal([]);
        });
    });
    describe("#reducer", function () {
        it("should be able to reduce changing name", function () {
            const thing = [{action: "setName", data: "flower"}].reduce(Thing.reducer, new Thing({name: "thing"}));
            expect(thing).to.have.property("name", "flower");
        });
        it("should be able to reduce multiple times", function () {
            const thing = [
                {action: "setName", data: "flower"},
                {action: "hide"},
                {action: "show"},
                {action: "setFixed", data: true}
            ].reduce(Thing.reducer, new Thing({name: "thing"}));
            expect(thing).to.have.property("name", "flower");
            expect(thing).to.have.property("visible", true);
            expect(thing).to.have.property("fixed", true);
        });
        it("should be unable to reduce an unknown action", function () {
            try {
            const thing = [{action: "setBlorg", data: "flower"}].reduce(Thing.reducer, new Thing({name: "thing"}));
            } catch (err) {
                expect(err).to.be.instanceof(ImmutableUnableToHandleUnknownActionError);
            }
        });
    });
    describe("#rendering", function() {
        let gameState = new GameState({
            things: buildThings(),
            rooms: []
        });
        it("should be able to render things, excluding player", function () {
            const thing = new Thing({name: "room", things: ["player", "flower"]}),
                  filteredThings = thing.render(RENDER_KEYS.THINGS_WITHOUT_PLAYER, gameState);
            expect(filteredThings).to.deep.equal(["flower"]);
        });
        it("should be able to render the short info", function () {
            const thing = new Thing({name: "room", things: ["player", "flower"]}),
                  shortInfo = thing.render(RENDER_KEYS.SHORT, gameState);
            expect(shortInfo).to.equal(thing.name);
        });
        it("should be able to render the long info", function () {
            const thing = new Thing({name: "room", desc: "bare", things: ["player", "flower"]}),
                  longInfo = thing.render(RENDER_KEYS.LONG, gameState);
            expect(longInfo).to.deep.equal([thing.name, "\n", thing.desc, "\n"]);
        });

    })
});