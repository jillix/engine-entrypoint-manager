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
    /**
     * EngineEntrypointManager
     * This class takes care to modify the entrypoint data in-memory.
     *
     * @name EntrypointManager
     * @function
     * @param {Object} obj The `entrypoints` object.
     */
    constructor (obj) {
        this.data = ul.deepMerge(obj, {
            private: {}
          , public: {}
        });
        this.data = {
            private: this.data.private
          , public: this.data.public
        };
    }

    /**
     * set
     * Sets the entrypoint.
     *
     * @name set
     * @function
     * @param {String} address The entrypoint address.
     * @param {String} instance The entrypoint instance.
     * @param {Boolean} isPrivate A flag representing if the entrypoint is private or not.
     */
    set (address, instance, isPrivate) {
        var o = this.get(!!isPrivate);
        address = address.replace(/\./g, "\\.");
        setValue(o, address, instance);
    }

    /**
     * delete
     * Deletes the entrypoint.
     *
     * @name delete
     * @function
     * @param {String} address The entrypoint address.
     * @param {Boolean} isPrivate A flag representing if the entrypoint is private or not.
     */
    delete (address, isPrivate) {
        this.set(address, undefined, isPrivate);
    }

    /**
     * get
     * Gets the entrypoint data.
     *
     * **Usage**:
     *
     * Getting the whole `entrypoints` object:
     *
     * ```js
     * em.get();
     * ```
     *
     * Getting the private entrypoints:
     *
     * ```js
     * em.get(true);
     * ```
     *
     * Getting a specific private entrypoint:
     *
     * ```js
     * em.get("example.com", true);
     * ```
     *
     * @name get
     * @function
     * @param {String} address The entrypoint address.
     * @param {Boolean} isPrivate A flag representing if the entrypoint is private or not.
     */
    get (address, isPrivate) {
        if (typeof address === "boolean") {
            return getValue(this.data, address ? "private": "public");
        }
        if (!address) { return this.data; }
        isPrivate = !!isPrivate;
        return getValue(this.get(isPrivate), address);
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
     * @param {String} address The entrypoint address.
     * @param {String} instanceName The entrypoint instance.
     * @param {Boolean} isPrivate A flag representing if the entrypoint is private or not.
     * @param {Function} cb The callback function.
     */
    set (address, instanceName, isPrivate, cb) {
        this._readPack((err, pack) => {
            if (err) { return cb(err); }
            var eem = new EngineEntrypointManager(pack.entrypoints);
            eem.set(address, instanceName, isPrivate);
            pack.entrypoints = eem.get();
            this._writePack(pack, cb);
        });
    }

    /**
     * get
     * Gets the entrypoint data.
     *
     * **Usage**:
     *
     * Getting the whole `entrypoints` object:
     *
     * ```js
     * em.get();
     * ```
     *
     * Getting the private entrypoints:
     *
     * ```js
     * em.get(true);
     * ```
     *
     * Getting a specific private entrypoint:
     *
     * ```js
     * em.get("example.com", true);
     * ```
     *
     * @name get
     * @function
     * @param {String} address The entrypoint address.
     * @param {String} instanceName The entrypoint instance.
     * @param {Boolean} isPrivate A flag representing if the entrypoint is private or not.
     * @param {Function} cb The callback function.
     */
    get (address, instanceName, isPrivate, cb) {
        if (typeof address === "function") {
            cb = address;
            instanceName = address = isPrivate = undefined;
        }
        if (typeof isPrivate === "function") {
            cb = isPrivate;
            isPrivate = false;
        }
        this._readPack((err, pack) => {
            if (err) { return cb(err); }
            var eem = new EngineEntrypointManager(pack.entrypoints);
            pack.entrypoints = eem.get();
            cb(null, eem.get(address, instanceName, isPrivate));
        });
    }

    /**
     * delete
     * Deletes an entrypoint.
     *
     * @name delete
     * @function
     * @param {String} address The entrypoint address.
     * @param {String} instanceName The entrypoint instance.
     * @param {Function} cb The callback function.
     */
    delete (address, isPrivate, cb) {
        this._readPack((err, pack) => {
            if (err) { return cb(err); }
            var eem = new EngineEntrypointManager(pack.entrypoints);
            eem.delete(address, isPrivate);
            pack.entrypoints = eem.get();
            this._writePack(pack, cb);
        });
    }
}

EntrypointManager.EngineEntrypointManager = EngineEntrypointManager;

module.exports = EntrypointManager;
