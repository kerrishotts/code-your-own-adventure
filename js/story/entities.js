import Entity from "../Entity.js";

export default function buildEntities() {
    return {
        "player": new Entity({
            name: "Alex",
            extra: {
                kind: "player"
            }
        }),
        "shark": new Entity({
            name: "Sharp Tooth",
            extra: {
                kind: "enemy"
            }
        }),
    };
}