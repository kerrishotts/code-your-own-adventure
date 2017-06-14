import Thing from "../classes/Thing.js";

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
        }),/*
        "doorToTreasure": new Door({
            name: "door",

        })*/
    };
}
