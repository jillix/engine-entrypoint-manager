"use strict";

// Dependencies
const deffy = require("deffy")
    , arrayUnique = require("array-unique")
    , setValue = require("set-value")
    , getValue = require("find-value")
    , Err = require("err")
    , ul = require("ul")
    ;

class EngineEntrypointManager {
    constructor (obj) {
        this.data = ul.deepMerge(this.data, {
            private: {}
          , public: {}
        });
        this.data = {
            private: this.data.private
          , public: this.data.public
        };
        debugger
    }
    set (address, instance, isPrivate) {
        var o = this.get(!!isPrivate);
        address = address.replace(/\./g, "\\.");
        setValue(o, address, instance);
    }
    delete (address, isPrivate) {
        this.set(address, undefined, isPrivate);
    }
    get (address, isPrivate) {
        if (typeof address === "boolean") {
            return getValue(this.data, address ? "private": "public");
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
            pack.entrypoints = deffy(pack.entrypoints, {});
            cb(null, pack);
        });
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
        return this.app.setPackage(pack, err => {
            if (err) { return cb(err); }
            cb(null, pack.entrypoints, pack);
        });
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
    create (address, instanceName, cb) {
        this._readPack((err, pack) => {
            if (err) { return cb(err); }
            var eem = new EngineEntrypointManager(pack.entrypoints);
            this._writePack(pack, cb);
        });
    }
}

EntrypointManager.EngineEntrypointManager = EngineEntrypointManager;

module.exports = EntrypointManager;
