// Dependencies
const deffy = require("deffy")
    , arrayUnique = require("array-unique")
    , Err = require("err")
    ;

class EntrypointManager {
    constructor (app) {
        this.app = app;
    }
    _readPack (cb) {
        return this.app.getPackage((err, pack) => {
            if (err) { return cb(err); }
            pack.entrypoints = arrayUnique(
                deffy(pack.entrypoints, [])
            );
            cb(null, pack);
        });
    }
    _unique (pack) {
        pack.entrypoints = arrayUnique(pack.entrypoints).filter(Boolean);
    }
    _writePack (pack, cb) {
        this._unique(pack);
        return this.app.setPackage(pack, err => {
            if (err) { return cb(err); }
            cb(null, pack.entrypoints, pack);
        });
    }
    exists (name, pack, cb) {
        if (typeof pack === "function") {
            cb = pack;
            pack = null;
        }
        if (pack) {
            return process.nextTick(cb, ~pack.entrypoints.indexOf(name));
        }
        this._readPack((err, pack) => {
            if (err) { return cb(false, err); }
            this.exists(name, pack, cb);
        });
    }
    list (cb) {
        this._readPack((err, pack) => {
            if (err) { return cb(err); }
            cb(null, pack.entrypoints, pack);
        });
    }
    add (name, cb) {
        this._readPack((err, pack) => {
            if (err) { return cb(err); }
            pack.entrypoints.push(name);
            this._unique(pack);
            this._writePack(pack, cb);
        });
    }
    update (oldName, newName, cb) {
        this._readPack((err, pack) => {
            if (err) { return cb(err); }
            var index = pack.entrypoints.indexOf(oldName);
            if (index === -1) {
                return cb(new Err("There is no such entrypoint: " + oldName, "ENTRYPOINT_DOES_NOT_EXIST"));
            }
            pack.entrypoints[index] = newName;
            this._writePack(pack, cb);
        });
    }
    remove (name, cb) {
        this.update(name, null, cb);
    }
    create (name, cb) {
        this._readPack((err, pack) => {
            if (err) { return cb(err); }
            if (!Array.isArray(name)) {
                name = [name];
            }
            pack.entrypoints = pack.entrypoints.concat(name);
            this._writePack(pack, cb);
        });
    }
}

module.exports = EntrypointManager;
