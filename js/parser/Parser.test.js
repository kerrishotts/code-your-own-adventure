/* global describe, it */
import "mocha";
import {expect} from "chai";
import Parser from "./Parser.js";

describe("Parser Tests", function() {
    describe("#basics", function () {
        it("should be able to parse nothing", function() {
            let command = Parser.parse();
            expect(command).to.exist;
            expect(command).to.have.property("intent", Parser.INTENTS.NONE);
        });
        it("should be able to parse an empty string", function() {
            let command = Parser.parse("");
            expect(command).to.exist;
            expect(command).to.have.property("intent", Parser.INTENTS.NONE);
        });
        it("should be able to parse a simple command", function() {
            let command = Parser.parse("look");
            expect(command).to.exist;
            expect(command).to.have.property("intent", Parser.INTENTS.EXAMINE_THING);
        });
        it("should be able to accept additional tokens", function() {
            let command = Parser.parse("take flower", {
                "flower": {
                    tokens: ["flower"],
                    kind: Parser.TOKEN_KIND.NOUN,
                    cat: Parser.TOKEN_CAT.THING
                }
            });
            expect(command).to.exist;
            expect(command).to.have.property("intent", Parser.INTENTS.TAKE_THING);
            expect(command).to.have.property("noun")
                        .to.have.property("token", "flower")
        });
        it("should be able to connect using with", function () {
            let command = Parser.parse("open door with key", {
                "door": {
                    tokens: ["door"],
                    kind: Parser.TOKEN_KIND.NOUN,
                    cat: Parser.TOKEN_CAT.THING
                },
                "key": {
                    tokens: ["key"],
                    kind: Parser.TOKEN_KIND.NOUN,
                    cat: Parser.TOKEN_CAT.THING
                }
            });
            expect(command).to.exist;
            expect(command).to.have.property("intent", Parser.INTENTS.OPEN_THING);
            expect(command).to.have.property("noun")
                        .to.have.property("token", "door");
            expect(command).to.have.property("connectedNoun")
                        .to.have.property("token", "key");
        });
        it("should be able to return an implicit navigational intent", function() {
            let command = Parser.parse("north");
            expect(command).to.exist;
            expect(command).to.have.property("intent", Parser.INTENTS.GO);
            expect(command).to.have.property("noun")
                        .to.have.property("token", "north");
        });
        it("should be able to handle multiple spaces", function() {
            let command = Parser.parse("     go      north   ");
            expect(command).to.exist;
            expect(command).to.have.property("intent", Parser.INTENTS.GO);
            expect(command).to.have.property("noun")
                        .to.have.property("token", "north");
        });
        it("shouldn't care about case", function() {
            let command = Parser.parse("Go NoRtH");
            expect(command).to.exist;
            expect(command).to.have.property("intent", Parser.INTENTS.GO);
            expect(command).to.have.property("noun")
                        .to.have.property("token", "north");
        });
        it("should work with multi-word tokens", function() {
            let command = Parser.parse("start over");
            expect(command).to.exist;
            expect(command).to.have.property("intent", Parser.INTENTS.RESTART_GAME);
        });
    });
    describe("#directions", function () {
        let directions = {
            "north": ["north", "n"],
            "west": ["west", "w"],
            "east": ["east", "e"],
            "south": ["south", "s"],
            "up": ["up", "u"],
            "down": ["down", "d"],
            "inside": ["inside", "in"],
            "outside": ["outside", "out"]
        }, verbs = [
            "", "go", "walk", "run", "trot", "proceed", "move"
        ];

        verbs.forEach(verb => {
            Object.entries(directions).forEach(([token, words]) => {
                words.forEach(word => {
                    it(`should understand ${verb} ${word}`, function() {
                        let command = Parser.parse(`${verb} ${word}`);
                        expect(command).to.exist;
                        expect(command).to.have.property("intent", Parser.INTENTS.GO);
                        expect(command).to.have.property("noun")
                                    .to.have.property("token", token);
                    });
                });
            });
        });
    });
});