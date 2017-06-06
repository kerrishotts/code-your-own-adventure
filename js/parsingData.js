export const TOKEN_KIND = {
    UNKNOWN: 0,
    NOUN: 1,
    VERB: 2,
    CONNECTOR: 3
}

export const TOKEN_CAT  = {
    NONE: 0,
    NAVIGATION: 1,
    THING: 2,
    ENTITY: 3,
    ROOM: 4,
    ACTION: 5
}

export const INTENTS = {
    NONE: undefined,
    CONNECTOR: "with",
    GO: "go",
    INVENTORY: "inventory",
    ATTACK_THING: "attack-thing",
    EXAMINE_THING: "examine-thing",
    TAKE_THING: "take-thing",
    DROP_THING: "drop-thing",
    THROW_THING: "throw-thing",
    OPEN_THING: "open-thing",
    CLOSE_THING: "close-thing",
    UNLOCK_THING: "unlock-thing",
    LOCK_THING: "lock-thing",
    RESTART_GAME: "restart-game",
    SAVE_GAME: "save-game",
    RESTORE_GAME: "restore-game",
}

export let tokens = {

    // directions
    "north": {
        tokens: ["north", "n"],
        kind: TOKEN_KIND.NOUN,
        cat: TOKEN_CAT.NAVIGATION,
        implicitIntent: INTENTS.GO
    },
    "south": {
        tokens: ["south", "s"],
        kind: TOKEN_KIND.NOUN,
        cat: TOKEN_CAT.NAVIGATION,
        implicitIntent: INTENTS.GO
    },
    "east": {
        tokens: ["east", "e"],
        kind: TOKEN_KIND.NOUN,
        cat: TOKEN_CAT.NAVIGATION,
        implicitIntent: INTENTS.GO
    },
    "west": {
        tokens: ["west", "w"],
        kind: TOKEN_KIND.NOUN,
        cat: TOKEN_CAT.NAVIGATION,
        implicitIntent: INTENTS.GO
    },
    "up": {
        tokens: ["up", "u"],
        kind: TOKEN_KIND.NOUN,
        cat: TOKEN_CAT.NAVIGATION,
        implicitIntent: INTENTS.GO

    },
    "down": {
        tokens: ["down", "d"],
        kind: TOKEN_KIND.NOUN,
        cat: TOKEN_CAT.NAVIGATION,
        implicitIntent: INTENTS.GO
    },
    "inside": {
        tokens: ["inside", "in"],
        kind: TOKEN_KIND.NOUN,
        cat: TOKEN_CAT.NAVIGATION,
        implicitIntent: INTENTS.GO
    },
    "outside": {
        tokens: ["outside", "out"],
        kind: TOKEN_KIND.NOUN,
        cat: TOKEN_CAT.NAVIGATION,
        implicitIntent: INTENTS.GO
    },

    // actions
    "go": {
        tokens: ["go", "walk", "run", "trot", "proceed", "move"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.GO
    },
    "open": {
        tokens: ["open"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.OPEN_THING
    },
    "close": {
        tokens: ["close"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.CLOSE_THING
    },
    "lock": {
        tokens: ["lock"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.LOCK_THING
    },
    "unlock": {
        tokens: ["unlock"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.UNLOCK_THING
    },
    "attack": {
        tokens: ["attack", "hit", "whack", "kill", "maim", "kick", "pummel", "punch"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.ATTACK_THING
    },
    "take": {
        tokens: ["take", "get", "pick up", "pick", "acquire"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.TAKE_THING
    },
    "drop": {
        tokens: ["drop", "put back", "put", "put down"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.DROP_THING
    },
    "throw": {
        tokens: ["throw"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.THROW_THING
    },
    "examine": {
        tokens: ["examine", "ex", "x", "look", "inspect"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.EXAMINE_THING
    },

    // connector tokens
    "with": {
        tokens: ["with", "using"],
        kind: TOKEN_KIND.CONNECTOR
    },

    // game-related actions
    "inventory": {
        tokens: ["inventory", "inv", "i"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.INVENTORY
    },
    "restart": {
        tokens: ["restart", "start over", "reset game"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.RESTART_GAME
    },
    "save": {
        tokens: ["save", "store", "save game", "store game"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.SAVE_GAME
    },
    "load": {
        tokens: ["load", "restore", "load game", "restore game"],
        kind: TOKEN_KIND.ACTION,
        intent: INTENTS.RESTORE_GAME
    }
};

export function addTokens(obj) {
    Object.keys(obj).forEach(key => tokens[key] = obj[key]);
}
