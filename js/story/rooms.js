import Room from "../classes/Room.js";

function buildRooms() {
    let rooms = {
        "garden": new Room({
            name: "The Garden",
            exits: {
                north: "aviary",
                south: "promenade",
                west: "river",
                east: "cliff"
            },
            desc: "You are in a beautiful garden. Hidden birds chirrup at you furiously for encroaching on their territory. Beautiful flowers are visible everywhere, and their sweet aromas are intoxicating. An old, rusty aviary lies to the north, while to the south is a large promenade. You hear a river off to your west, and it looks like there might be a cliff off to your east.",
            things: [ "flower" ]
        }),
        "cliff": new Room({
            name: "The Tall Cliffs",
            exits: {
                west: "garden",
                east: "ravine"
            },
            desc: "You stand perched on a tall, ragged cliff. The world recedes rapidly into a dark gray mist in the distance below. You'd better be careful around here. A beautiful garden is to your west. Thick forest obstructs your path in all other directions.",
            things: [ "treasureKey" ]
        }),
        "ravine": new Room({
            name: "The Bottom of the Ravine",
            exits: {},
            desc: "You are at the bottom of an extremely deep ravine. Your body lies broken and mangled, and it's all due to your own clumsiness, stupidity, or both."
            /* TODO: kill player */
        }),
        "aviary": new Room({
            name: "The Old, Rusty Aviary",
            exits: (room, state) => ({
                west: state.getThingByName("treasureDoor").opened ? "treasureRoom" : undefined,
                south: "garden"
            }),
            things: ["treasureDoor"],
            desc: "A beautiful wrought-iron structure looms above you. You can tell it is quite old, as there is significant rust on the bars. There are chirps and chatterings of all kinds, letting you know that hidden birds are none-to-pleased that you've arrived. There is a beautiful garden to the south."
        }),
        "river": new Room({
            name: "Fast flowing River",
            exits: {
                east: "garden",
                west: "rapids"
            },
            desc: "You find yourself in a fast flowing river with rapids further out. It looks awfully dangerous if you attempt to cross. A beautiful garden is to your east. The banks to the north and south are too steep to climb."
        }),
        "rapids": new Room({
            name: "The Rapids",
            exits: {},
            desc: "You attempt to overcome the power of the rapids, but the current is just too strong. You are swept mercilessly downstream. A branch suddenly appears out of nowhere, offering you the small hope of salvation, but you fail to grab on. In your efforts, you don't notice the steep waterfall ahead of you. As you plunge thousands of feet, you wonder why you thought you could overpower Mother Nature."
        }),
        "promenade": new Room({
            name: "Promenade",
            exits: {
                north: "garden"
            },
            desc: "A wide, flat grassy plain. A beautiful garden lies to the north, while there is dense forest in all other directions."
        }),
    };

    return rooms;
}

export default buildRooms;