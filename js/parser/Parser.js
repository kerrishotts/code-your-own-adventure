import {INTENTS, TOKEN_CAT, TOKEN_KIND, tokens, addTokens} from "./parsingData.js";

/**
 * A noun clouse (used in commands)
 *
 * @class Noun
 */
export class Noun {
    /**
     * Creates an instance of Noun.
     * @param {any} options
     * param {any} [{token = "", cat = TOKEN_CAT.THING}={}]
     * @memberof Noun
     */
    constructor({token = "", cat = TOKEN_CAT.THING} = {}) {
        this.token = token
        this.cat = cat;
    }
}

export class Command {
    /**
     * Creates an instance of Command.
     * @memberof Command
     */
    constructor() {
        this.intent = INTENTS.NONE;

        /** @type {Noun} */
        this.noun = null;

        /** @type {Noun} */
        this.connectedNoun = null;

        this._whichNoun = "noun";
    }
}


class Parsing {
    /**
     * Creates an instance of Parsing.
     * @param {any} options
     * param {any} [{match:string = undefined, token:Token = null, at:number = undefined, to:number = undefined}={}]
     * @memberof Parsing
     */
    constructor({match = undefined, token = null, at = undefined, to = undefined} = {}) {
        this.at = at;
        this.to = to;
        this.match = match;
        this.token = token;
    }
}

/**
 * Checks if any token match collides with `this` (a single matched
 * token)
 *
 * @param {Parsing} tokenMatch
 * @returns {Boolean}
 */
function tokenInParsings(tokenMatch) {
    return tokenMatch.at <= this.at && this.to <= tokenMatch.to;
}

/**
 * Intended for reducing an array of characters, getParsings will generate an array
 * of all the matched parsings in the array of characters.
 *
 * @param {string[]} tokenList          Array of all tokens to look for
 * @param {any[]} tokens                Token details, including intents and the like
 * @param {Parsing[]} parsings          Accumulator for parsings
 * @param {string} c                    current character
 * @param {number} idx                  current character index
 * @param {string[]} arr                entire array of characters
 * @returns {Parsing[]}                 array of parsings and positions
 */
function getParsings(tokenList, tokens, parsings, c, idx, arr) {
    let str = arr.join("").substr(idx), // recombine the array, but only at current pos

        // find the LONGEST token that matches from the start of the string
        matchedToken = tokenList.filter(token => str.startsWith(" " + token + " "))
            .reduce((longest, cur) => (cur.length > longest.length) ? cur : longest, "");

    if (matchedToken !== "") {
        // we found a token! Find the matching token information, and store information
        // about where it was found
        let matchedTokenInfo = new Parsing({
            match: matchedToken,
            token: Object.values(tokens)
                       .find(val => val.tokens.find(token => token === matchedToken)),
            at: idx,
            to: idx + matchedToken.length - 1
        });

        // this token /might/ be part of a token we've already found. Make sure it isn't.
        if (!parsings.find(tokenInParsings.bind(matchedTokenInfo))) {
            // it isn't; add it to the list of parsings!
            parsings.push(matchedTokenInfo);
        }

    }
    return parsings;
}

/**
 * Intended to be reducing an array of parsings, this will return a command
 * object with the parsings converted into a simple intent and nouns.
 *
 * @param {Command} command             accumulator for the command
 * @param {Parsing} parsing             an individual parsing
 * @returns {Command} command
 */
function parsingsToCommand(command, parsing) {
    switch (parsing.token.kind) {
        case TOKEN_KIND.ACTION:
            command.intent = parsing.token.intent;
            break;
        case TOKEN_KIND.NOUN:
            command[command._whichNoun] = parsing.token.obj ? parsing.token.obj : new Noun({token: parsing.token.tokens[0]})
            break;
        case TOKEN_KIND.CONNECTOR:
            command._whichNoun = "connectedNoun";
            break;
        default:
            // do nothing
    }
    // some tokens have an implicit intent (usually navigational).
    // if we've got one, apply the intent.
    if (parsing.token.implicitIntent) {
        command.intent = parsing.token.implicitIntent;
    }
    return command;
}

export default {
    INTENTS,
    TOKEN_CAT,
    TOKEN_KIND,
    addTokens,
    Noun,
    Command,
    /**
     * Parse a string, returning a simple command (intent + nouns)
     *
     * @param {String} [str = undefined]
     * @param {any} extraTokens     extra tokens applicable to the current context
     * @returns {Command}
     */
    parse(str = undefined, extraTokens = {}) {
        let command = new Command(),
            combinedTokens = Object.assign({}, tokens, extraTokens);

        if (str === undefined || str === null) {
            return command;
        }

        // lower case everything to make tokenization easier;
        // add a space at both sides as well, which makes matching tokens
        // easier.
        let temp = " " + str.toLowerCase().trim() + " ";

        // get all the tokens _and_ their aliases in one long array
        // this includes things like "take", but also "get", "pick up", etc.
        let allTokens = Object.values(combinedTokens).reduce((a, val) => a.concat(val.tokens), []);

        // we want to parse character by character
        let chars = temp.split("");

        // reduce to an array of parsings
        let parsings  = chars.reduce(getParsings.bind(this, allTokens, combinedTokens), []);

        // and condense the parsings into a command and return it
        return parsings.reduce(parsingsToCommand, command);
    }
}