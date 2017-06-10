import Room from "../Room.js";

function buildRooms(things, entities) {
    let rooms = {
        "garden": new Room({
            name: "The Garden",
            exits: () => ({
                north: rooms.aviary,
                south: rooms.promenade,
                west: rooms.river,
                east: rooms.cliff
            }),
            desc: "You are in a beautiful garden.",
            things: [ things.flower ]
        }),
    };

    return rooms;
}

export default buildRooms;