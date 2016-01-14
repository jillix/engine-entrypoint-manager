"use strict";

// Dependencies
const deffy = require("deffy")
    , arrayUnique = require("array-unique")
    , setValue = require("set-value")
    , getValue = require("find-value")
    , Err = require("err")
    ;

class EngineEntrypointManager {
    consturctor (obj) {
        this.data = obj;
    }
    set (address, instance, isPrivate) {
        var o = this.get(!!isPrivate);
        setValue(o, address, instance);
    }
    delete (address, isPrivate) {
        this.set(address, undefined, isPrivate);
    }
    get (address, isPrivate) {
        if (typeof address === "boolean") {
            return deffy(this.data[address ? "isPrivate": "public"], {});
        }
        if (!address) { return this.data; }
        isPrivate = !!isPrivate;
        return findValue(this.get(isPrivate), address);
    }
}

class EntrypointManager {

    /**
     * EntrypointManager
     * Creates a new instance of the `EntrypointManager`.
     *
     * @name EntrypointManager
     * @function
     * @param {EngineApp} app The `EngineApp` instance.
     */
    constructor (app) {
        this.app = app;
    }

    /*!
     * _readPack
     * Reads the package.json file and makes sure the `entrypoints` is an array.
     *
     * @name _readPack
     * @function
     * @param {Function} cb The callback function.
     */
    _readPack (cb) {
        return this.app.getPackage((err, pack) => {
            if (err) { return cb(err); }
            pack.entrypoints = arrayUnique(
                deffy(pack.entrypoints, [])
            );
            cb(null, pack);
        });
    }

    /*!
     * _unique
     * Keeps the unique and non-empty elements in the entrypoints array.
     *
     * @name _unique
     * @function
     * @param {Object} pack The `package.json` object.
     * @returns {Object} The modified `package.json` object.
     */
    _unique (pack) {
        pack.entrypoints = arrayUnique(pack.entrypoints).filter(Boolean);
        return pack;
    }

    /*!
     * _writePack
     *
     * @name _writePack
     * @function
     * @param {Object} pack The `package.json` object.
     * @param {Function} cb The callback function.
     */
    _writePack (pack, cb) {
        this._unique(pack);
        return this.app.setPackage(pack, err => {
            if (err) { return cb(err); }
            cb(null, pack.entrypoints, pack);
        });
    }

    /**
     * exists
     * Checks if the entrypoint exists is already added in the `entrypoints` array.
     *
     * @name exists
     * @function
     * @param {String} name The entrypoint value.
     * @param {Object} pack The `package.json` content.
     * @param {Function} cb The callback function.
     */
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

    /**
     * list
     * List the entrypoints.
     *
     * @name list
     * @function
     * @param {Function} cb The callback function.
     */
    list (cb) {
        this._readPack((err, pack) => {
            if (err) { return cb(err); }
            cb(null, pack.entrypoints, pack);
        });
    }

    /**
     * update
     * Updates an entrypoint.
     *
     * @name update
     * @function
     * @param {String} oldName The old entrypoint value.
     * @param {String} newName The new entrypoint.
     * @param {Function} cb The callback function.
     */
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

    /**
     * remove
     * Removes an entrypoint.
     *
     * @name remove
     * @function
     * @param {String} name The entrypoint value.
     * @param {Function} cb The callback function.
     */
    remove (name, cb) {
        this.update(name, null, cb);
    }

    /**
     * create
     * Creates a new entrypoint.
     *
     * @name create
     * @function
     * @param {String} name The entrypoint value.
     * @param {Function} cb The callback function.
     */
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
