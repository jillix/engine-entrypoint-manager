const tester = require("tester")
    , EntrypointManager = require("..")
    ;

tester.describe("working with objects in memeory", test => {
    var eem = new EntrypointManager.EngineEntrypointManager();
    test.it("sets an etntrypoint", () => {
        eem.set("example.com", "private", true);
        test.expect(eem.get()).toEqual({
            private: {
                "example.com": "private"
            }
        });
    });
    test.it("deletes an etntrypoint", () => {
        eem.delete("example.com", "private", true);
        test.expect(eem.get()).toEqual({
            private: {
                "example.com": "private"
            }
        });
    });
});
