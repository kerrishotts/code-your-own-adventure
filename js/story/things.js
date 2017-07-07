import Thing from "../classes/Thing.js";
import Entity from "../classes/Entity.js";
import Door from "../classes/Door.js";

export default function buildThings() {
    return {
        "flower": new Thing({
            name: "flower",
            desc: "A beautiful flower, petals extended and glimmering, and leaves stretched out."
        }),
        "treasureKey": new Thing({
            name: "rusty key",
            aliases: ["key"],
            desc: "An incredibly rusty key; it almost falls to pieces in your hands."
        }),
        "treasureDoor": new Door({
            name: "treasure door",
            aliases: ["door", "big door"],
            unlocksWith: "treasureKey",
            desc: "A very large, heavy, wooden door. I don't think it will budge."
        }),
        /* entities */
        "player": new Entity({
            name: "Alex",
            kind: "player"
        }),
        "shark": new Entity({
            name: "Sharp Tooth",
            kind: "enemy"
        }),
    };
}
