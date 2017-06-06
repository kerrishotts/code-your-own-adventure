import {INTENTS, TOKEN_CAT, TOKEN_KIND, tokens, addTokens} from "./parsingData.js";

export default {
    addTokens,
    parse(str) {
        let parsing = {
            _curToken: "",
            intent: INTENTS.NONE,
            noun: {
                token: "",
                cat: TOKEN_CAT.NONE
            },
            connectedNoun: {
                token: "",
                cat: TOKEN_CAT.NONE
            }
        };
        if (str === undefined || str === null) {
            return parsing;
        }

        // lower case everything to make tokenization easier;
        // add a space at the end as well, which makes matching tokens
        // easier.
        let temp = str.toLowerCase().trim() + " ";
        let allTokens = Object.keys(tokens).reduce((a, key) => a.concat(tokens[key].tokens), []);

        let chars = temp.split("");
        return chars.reduce((a, c) => {
            if (c === " ") {
                // we're at a word break, see if any tokens match
                if (allTokens.indexOf(a._curToken) > -1) {
                    // we've got a match!

                } else {
                    // add the character to the token and continue processing
                    a._curToken += c;
                }
            }
            return a;
        }, parsing);


    }
}