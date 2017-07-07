import Journal from "./components/Journal.js";
import Prompt from "./components/Prompt.js";
import Parser from "./parser/Parser.js";

import GameState from "./classes/GameState.js";

import buildThings from "./story/things.js";
import buildRooms from "./story/rooms.js";

export default class Game {
    constructor(parentEl = undefined) {
        this.gameOver = false;

        this.journal = new Journal(parentEl);
        this.prompt = new Prompt(parentEl);

        this.state = new GameState();
    }

    initializeState() {
        this.state = this.state.merge({
            things: buildThings(),
            rooms: buildRooms(),
        });

        // initial player start
        this.state = this.state.setEntityLocation("player", "garden");
        //this.state.player.location = this.state.rooms.garden;
    }

    async play() {
        this.initializeState();

        const journal = this.journal,
            prompt = this.prompt;

        while (!this.gameOver) {
            let state = this.state;
            let player = state.entities.player;
            let curRoom = state.getRoomByName(player.location);

            journal.write(curRoom.getDescription(state), "\n");

            try {
                const command = await prompt.getInput();
                const normalizedCommand = command.toLowerCase().trim();
                const parsedCommand = Parser.parse(
                    normalizedCommand,
                    Object.entries(state
                        .getRoomByName(player.location)
                        .getThingsExcludingPlayer(state).map(thing => state.getThingByName(thing))
                    ).reduce((a, [key, thing]) => {
                            a[key] = {
                                obj: thing,
                                tokens: [thing.name].concat(thing.aliases),
                                kind: Parser.TOKEN_KIND.NOUN,
                                cat: Parser.TOKEN_CAT.THING,
                                intent: Parser.INTENTS.NONE,
                            };
                            return a;
                        },
                        []
                    )
                );

                if (parsedCommand.intent === Parser.INTENTS.GO) {
                    let desiredLocation = curRoom.getRoomExits(state)[parsedCommand.noun.token];
                    if (desiredLocation) {
                        this.state = state.setEntityLocation("player", desiredLocation);
                    } else {
                        throw new Error("You can't go that way, no matter how hard you try!");
                    }
                }

                console.log(parsedCommand);

                journal.write(
                    `> ${normalizedCommand === "" ? "(nothing)" : command}\n`,
                    "\n"
                );
            } catch (err) {
                journal.write(err.message, "\n");
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
