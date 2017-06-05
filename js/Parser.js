import INTENTS from "./intents.js";

const TOKENS = [
    ["go", "walk", "run", "move"],
    "open",
    "close",
    "lock",
    "unlock",
    ["attack", "hit", "whack", "kill", "maim", "kick"],
    ["inventory", "inv", "i"],
    ["take", "get", "pick up", "pick"],
    ["drop", "put back", "put", "put down"],
    "throw",
    ["examine", "ex", "x", "look", "look"],
    "restart",
    ["save", "store"],
    ["load", "restore"],
    ["with", "using"]
];

const TOKEN_INTENT_MAP = {
    "go": INTENTS.GO,
    "open": INTENTS.OPEN_THING,
    "close": INTENTS.CLOSE_THING,
    "lock": INTENTS.LOCK_THING,
    "unlock": INTENTS.UNLOCK_THING,
    "attack": INTENTS.ATTACK_THING,
    "take": INTENTS.TAKE_THING,
    "drop": INTENTS.DROP_THING,
    "examine": INTENTS.EXAMINE_THING,
    "restart": INTENTS.RESTART_GAME,
    "save": INTENTS.SAVE_GAME,
    "load": INTENTS.RESTORE_GAME,
    "with": INTENTS.CONNECTOR
}

export default class Parser {
    constructor() {
        this._tokens = {
            ignore: ["a", "the", "at"],
            connections: {
                "with":
            },

            articles: ["a", "the"],
            prepositions: ["with"],
            intents: []

        }
        this._verbs = {};
    }

    addVerb()

    /**
     * Parse a string, returning an intent
     *
     * @param {any} str
     *
     * @memberof Parser
     */
    parse(str) {
        return {
            intent: INTENTS.ATTACK_THING,
            thing: "monster",
            connector: "club"
        }

    }
}