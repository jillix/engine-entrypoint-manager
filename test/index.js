"use strict";

const tester = require("tester")
    , EntrypointManager = require("..")
    , EngineApp = require("engine-app")
    ;

tester.describe("working with objects in memeory", test => {
    var eem = new EntrypointManager.EngineEntrypointManager();

    test.it("sets entrypoints", () => {
        eem.set("example.com", "private", true);
        test.expect(eem.get()).toEqual({
            private: {
                "example.com": "private"
            }
          , public: {}
        });
        eem.set("example.com", "public_layout", false);
        test.expect(eem.get()).toEqual({
            private: {
                "example.com": "private"
            }
          , public: {
                "example.com": "public_layout"
            }
        });
    });
    test.it("deletes an etntrypoint", () => {
        eem.delete("example.com", true);
        test.expect(eem.get()).toEqual({
            private: {
                "example.com": undefined
            }
          , public: {
                "example.com": "public_layout"
            }
        });
        eem.delete("example.com", false);
        test.expect(eem.get()).toEqual({
            private: {
                "example.com": undefined
            }
          , public: {
                "example.com": undefined
            }
        });
    });
});

tester.describe("working with package.json files", test => {
    var em = new EntrypointManager(
        new EngineApp(`${__dirname}/app`)
    );
    test.it("sets entrypoints", cb => {
        em.set("example.com", "private", true, err => {
            test.expect(err).toBe(null);
            em.get((err, entrypoints) => {
                test.expect(err).toBe(null);
                test.expect(entrypoints).toEqual({
                    private: {
                        "example.com": "private"
                    }
                  , public: {}
                });
                cb();
            })
        });
    });

    test.it("set public entrypoints", cb => {
        em.set("example.com", "public_layout", false, err => {
            test.expect(err).toBe(null);
            em.get((err, entrypoints) => {
                test.expect(err).toBe(null);
                test.expect(entrypoints).toEqual({
                    private: {
                        "example.com": "private"
                    }
                  , public: {
                        "example.com": "public_layout"
                    }
                });
                cb();
            })
        });
    });

    test.it("deletes a private etntrypoint", (cb) => {
        em.delete("example.com", true, err => {
            em.get((err, entrypoints) => {
                test.expect(err).toBe(null);
                test.expect(entrypoints).toEqual({
                    private: {}
                  , public: {
                        "example.com": "public_layout"
                    }
                });
                cb();
            })
        });
    });

    test.it("deletes a public etntrypoint", (cb) => {
        em.delete("example.com", false, err => {
            em.get((err, entrypoints) => {
                test.expect(entrypoints).toEqual({
                    private: {}
                  , public: {}
                });
                cb();
            });
        });
    });
});
