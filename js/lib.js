/**
 * Print any number of values to the screen
 *
 * @param {any} [arg] Value to print
 */
function print() {
    var text = [].splice.call(arguments, 0),
        el = document.getElementById("game");
    el.textContent += text.join("") + String.fromCharCode(13) + String.fromCharCode(10);
}

/**
 * Detects if o[key] is a function or a value. If it is a function, it is executed.
 * If not, the value is returne as-is
 *
 * @param {any} o
 * @param {string} key
 * @param {any} dflt
 * @returns {any}
 */
function fnOrVal(o, key, dflt) {
    var v;
    if (dflt === undefined || dflt === null) {
        dflt = "";
    }
    if (o) {
        if (typeof o[key] === "function") {
            v = o[key].call(o);
        } else {
            v = o[key];
        }
        if (v) {
            return v;
        }
    }
    return dflt;
}

function isPlayerHoldingObject(objName) {
    if (player.inventory.indexOf(objName) > -1) {
        return true;
    }
    return false;
}

function canPlayerSeeObject(objName) {
    var room = rooms[player.location],
        objects = fnOrVal(room, "objects", []);
    if (objects.indexOf(objName) > -1) {
        return true;
    }
    if (isPlayerHoldingObject(objName)) {
        return true;
    }
    return false;
}

function examineObject(objName) {
    var obj = objects[objName],
        desc;
    print();
    print(fnOrVal(obj, "desc"));
}

function getRoomExits(location) {
    var room = rooms[location],
        exits;
    return(fnOrVal(room, "exits", {}));
}

function examineRoom(location) {
    var room = rooms[location],
        exits, roomObjects;
    print();
    print("*** ", room.name, "***");
    print(fnOrVal(room, "desc"));
    if (room.exits) {
        exits = getRoomExits(location);
        if (Object.keys(exits).length > 0) {
            print("Exits: ", Object.keys(exits).join(", ") + ".");
        }
    }
    if (room.objects) {
        roomObjects = fnOrVal(room, "objects", []);
        if (roomObjects.length > 0) {
            print("Things here: ", roomObjects.map(function (obj) {
                return objects[obj].name;
            }).join(", ") + ".");
        }
    }
}

function takeObject(objName) {
    var room = rooms[player.location],
        obj = objects[objName];
    if (obj && !obj.holdable) {
        print("Yeah; that's not something you can take.");
        return;
    }
    if (canPlayerSeeObject(objName)) {
        if (isPlayerHoldingObject(objName)) {
            print("Already taken.");
        } else {
            print("Taken.");
            player.inventory.push(objName);
            room.objects = room.objects.filter(function (obj) { return obj !== objName; });
        }
    } else {
        print("I can't see that.");
    }
}

function dropObject(objName) {
    var room = rooms[player.location];
    if (!room.objects) {
        room.objects = [];
    }
    if (isPlayerHoldingObject(objName)) {
        room.objects.push(objName);
        player.inventory = player.inventory.filter(function (obj) { return obj !== objName; });
        print("Dropped.");
    } else {
        print("I can't drop something that you don't have!");
    }
}

function unlockObject(objName) {
    var object = objects[objName] || {
        state: {}
       },
        unlocksWith = object.unlocksWith;
    if (canPlayerSeeObject(objName)) {
        if (unlocksWith) {
            if (isPlayerHoldingObject(unlocksWith)) {
                if (object.state.locked) {
                    object.state.locked = false;
                    print("Unlocked.");
                } else {
                    print("Already unlocked!");
                }
            } else {
                print("You need a ", objects[unlocksWith].name);
            }
        } else {
            print("Doesn't look like it can be unlocked.");
        }
    } else {
        print("You can't see that object.");
    }
}

function openObject(objName) {
    var object = objects[objName] || {
        state: {}
    };
    if (canPlayerSeeObject(objName)) {
        if (!object.state.locked && !object.state.open) {
            object.state.open = true;
        } else {
            if (object.state.locked) {
                print("Can't open that -- it's locked.");
            } else if (object.state.open) {
                print("It's already open!");
            }
        }
    } else {
        print ("How can you open something that you can't see?");
    }
}
