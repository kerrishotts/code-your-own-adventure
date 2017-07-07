import {_PROPS} from "./sharedPrivateSymbols.js";
import Immutable from "./Immutable.js";
import Entity from "./Entity.js";

export default class GameState extends Immutable{
    constructor(props = {}) {
        let initialProps = {
            rooms: {},
            things: {}
        }
        super(Object.assign({}, initialProps, props));
    }

    merge(props = {}) {
        return Reflect.construct(this.constructor, [{
            rooms: Object.assign({}, this.rooms, props.rooms),
            things: Object.assign({}, this.things, props.things)
        }]);
    }

    get rooms() {
        return this[_PROPS].rooms;
    }

    get entities() {
        return Object.entries(this[_PROPS].things)
            .reduce((acc, [key, thing]) => {
                if (thing instanceof Entity) {
                    acc[key] = thing;
                }
                return acc;
            }, {});
    }

    get things() {
        return this[_PROPS].things;
    }

    getEntityByName(entityName) {
        return this.entities[entityName];
    }

    getRoomByName(roomName) {
        return this.rooms[roomName];
    }

    getThingByName(thingName) {
        return this.things[thingName];
    }

    getItemByTypeAndName(typeName, thingName) {
        return this[typeName][thingName];
    }

    setEntityLocation(entity, room) {
        let roomObj = this.getRoomByName(room),
            entityObj = this.getEntityByName(entity),
            prevRoomObj = this.getRoomByName(entityObj.location),
            prevRoom = prevRoomObj ? entityObj.location : undefined;

        if (prevRoomObj) {
            if (!prevRoomObj.canEntityExit(entity)) {
                throw new Error("Can't leave yet.");
            }
            prevRoomObj = prevRoomObj.removeThing(entity);
        }
        if (roomObj.canEntityEnter(entity)) {
            entityObj = entityObj.setLocation(room);
            roomObj = roomObj.addThing(entity);
            return this.merge({
                things: {
                    [entity]: entityObj
                },
                rooms: prevRoomObj ? {
                    [room]: roomObj,
                    [prevRoom]: prevRoomObj
                } : {
                    [room]: roomObj
                }
            });
        } else {
            throw new Error("Can't go there yet");
        }
    }
}