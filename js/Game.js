import Entity from "./Entity.js";
import Room from "./Room.js";
import Thing from "./Thing.js";

import Journal from "./Journal.js";
import Prompt from "./Prompt.js";

export default class Game {
    constructor(parentEl = undefined) {

        this.gameOver = false;

        this.journal = new Journal(parentEl);
        this.prompt = new Prompt(parentEl);

        this.player = null;
        this.things = {};
        this.rooms = {};
    }

    initializeState() {
        this.player = new Entity({
            name: "Alex",
            extra: {
                kind: "player"
            }
        });

        this.things = {
            "flower": new Thing({
                name: "flower",
                desc: "A beautiful flower, petals extended and glimmering, and leaves stretched out."
            }),
            "key": new Thing({
                name: "rusty key",
                aliases: ["key"],
                desc: "An incredibly rusty key; it almost falls to pieces in your hands."
            }),
        }

        this.rooms = {
            "garden": new Room({
                name: "The Garden",
                exits: () => ({
                    north: this.rooms.aviary,
                    south: this.rooms.promenade,
                    west: this.rooms.river,
                    east: this.rooms.cliff
                }),
                desc: "You are in a beautiful garden.",
                things: [ this.things.flower ]
            }),
        }

        // initial player start
        this.player.location = this.rooms.garden;
    }

    async play() {
        this.initializeState();

        const journal = this.journal,
              prompt = this.prompt,
              player = this.player;

        while (!this.gameOver) {
            let curRoom = player.location,
                command, normalizedCommand;
            journal.write(curRoom.longInfo, "\n");

            try {
                command = await prompt.getInput();
                normalizedCommand = command.toLowerCase().trim();

                journal.write(`> ${normalizedCommand === "" ? "(nothing)" : command}\n`, "\n");
            } catch (err) {
                journal.write(err);
            }
        }
    }

}
/*
    var player, objects, rooms;

    function restart() {
        player = {
            inventory: [],              // keep track of what player is carrying
            score: 0,                   // add to this if the player does something good
            health: 100,                // when this gets to zero, player should die
            location: "garden"          // initial location -- the garden
        };

        // objects within the game
        objects = {
            "flower": {
                name: "flower",
                desc: "a beautiful flower",
                holdable: true,
            },
            "key": {
                name: "key",
                desc: "an iron key; clearly ancient",
                holdable: true,
            },
            "door": {
                name: "door",
                desc: function() {
                    if (this.state.open) {
                        return "an open door";
                    }
                    if (this.state.locked) {
                        return "a locked door";
                    }
                    return "a closed door";
                },
                state: {
                    open: false,
                    locked: true
                },
                unlocksWith: "key"
            },
        };

        rooms = {
            "garden": {
                name: "The Garden",
                exits: {
                    north: "aviary",
                    south: "promenade",
                    west: "river",
                    east: "cliff"
                },
                desc: "You are in a beautiful garden.",
                objects: ["flower"]
            },
            "cliff": {
                name: "The Tall Cliffs",
                exits: {
                    west: "garden",
                    east: "ravine",
                },
                desc: "You are on a tall, ragged cliff. The world recedes rapidly into a dark gray mist in the distance below. You'd better be careful around here.",
                objects: ["key"],
            },
            "ravine": {
                name: "The Bottom of the Ravine",
                exits: {},
                desc: "You are at the bottom of an extremely deep ravine. Your body is broken and mangled, because you fell off the edge!",
                whenEntered: function() {
                    player.health = 0;
                }
            },
            "aviary": {
                name: "The Aviary",
                exits: function() {
                    if (objects.door.state.open) {
                        return {
                            south: "garden",
                            west: "treasure",
                        };
                    } else {
                        return {
                            south: "garden",
                        };
                    }
                },
                desc: "A beautiful wrought-iron structure looms above you. There are chirps and chatterings of all kinds from hidden birds.",
                objects: ["door"]
            },
            "river": {
                name: "Fast-flowing River",
                exits: {
                    east: "garden",
                    west: "rapids",
                },
                desc: "A fast-moving river that looks awfully dangerous if you try to swim it."
            },
            "rapids": {
                name: "The Rapids",
                exits: {},
                desc: "You're caught in the river and drown",
                whenEntered: function() {
                    player.health = 0;
                }
            },
            "promenade": {
                name: "Promenade",
                exits: {
                    north: "garden",
                },
                desc: "A wide, flat grassy plain."
            },
        };

        // print the first room
        examineRoom(player.location);
    }

    function parseCommand(evt) {
        var el = document.getElementById("command"),
            command = el.value.toLowerCase(),
            words = command.split(" "),
            verb = words[0],
            noun = words[1],
            curRoom = player.location,
            aliases = {
                verbs: {
                    "x": "examine",
                    "look": "examine",
                    "walk": "go",
                    "run": "go",
                    "i": "inventory",
                    "inv": "inventory",
                    "get": "take",
                    "put": "drop",
                },
                nouns: {
                    "n": "north",
                    "e": "east",
                    "w": "west",
                    "s": "south",
                    "in": "inside",
                    "out": "outside",
                }
            };

        // check aliases for similar words
        if (aliases.verbs[verb]) {
            verb = aliases.verbs[verb];
        }

        // verb might also be a direction
        if (aliases.nouns[verb]) {
            verb = aliases.nouns[verb];
        }

        // nouns too
        if (aliases.nouns[noun]) {
            noun = aliases.nouns[noun];
        }

        if (player.health <= 0 && verb !== "restart") {
            print();
            print ("You're dead; you can't do anything.");
            print ("hint: try restart");
        } else {

            // repeat the player's command
            print();
            print("> ", command);

            // whatever happens depends on the verb!
            switch(verb) {

            // directions
            case "north":
            case "south":
            case "east":
            case "west":
            case "inside":
            case "outside":
            case "up":
            case "down":
                noun = verb;
                verb = "go";
            case "go":
                var exits = fnOrVal(rooms[curRoom], "exits", {});
                player.location = exits[noun];
                if (!player.location) {
                    print("Can't go that way.");
                    player.location = curRoom;
                }
                break;

            // looking around
            case "examine":
                if (!noun) {
                    examineRoom(curRoom);
                } else {
                    if (canPlayerSeeObject(noun)) {
                        examineObject(noun);
                    } else {
                        print("I can't see that.");
                    }
                }
                break;

            // inventory management
            case "take":
                takeObject(noun);
                break;
            case "drop":
                dropObject(noun);
                break;
            case "inventory":
                if (player.inventory.length === 0) {
                    print ("You aren't carrying anything!");
                } else {
                    print("You are carrying ", player.inventory.join(", "));
                }
                break;

            case "restart":
                restart();
                break;

            case "unlock":
                unlockObject(noun);
                break;

            case "open":
                openObject(noun);
                break;

            case "close":
                // TODO close door
                break;

            // we don't know how to do that, so let the player know
            default:
                print("I'm not sure what you are trying to say.");
            }

            // if the player has moved, show the description
            if (player.location !== curRoom) {
                if (rooms[player.location].whenEntered) {
                    rooms[player.location].whenEntered();
                }
                examineRoom(player.location);
            }

            if (player.health <= 0) {
                print ("You are dead.");
            }
        }

        el.value = "";              // clear out the player's command
        el.scrollIntoView();        // scroll the command into view
        evt.preventDefault();       // DON'T SUBMIT THE FORM!
        return false;               // "     "      "   "
    }

    print("Welcome, traveller, to an Adventure!");
    print("Now, prepare to die!");

    // listen for player responses
    document.getElementById("commandForm").addEventListener("submit", parseCommand, false);

    restart();

})();
*/