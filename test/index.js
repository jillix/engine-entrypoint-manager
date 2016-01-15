"use strict";

const tester = require("tester")
    , EntrypointManager = require("..")
    , engineApp = require("engine-app")
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
tester.describe("working with objects in memeory", test => {
    var app = new EngineApp(`${__dirname}/app`)
      , em = new EntrypointManager(app)
      ;

    test.it("sets entrypoints", () => {
        em.set("example.com", "private", true);
        test.expect(em.get()).toEqual({
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
