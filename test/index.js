const tester = require("tester")
    , EntrypointManager = require("..")
    ;

tester.describe("working with objects in memeory", test => {
    test.it("sets an etrnypoint", () => {
        var eem = new EntrypointManager.EngineEntrypointManager();
        eem.set("example.com", "private", true);
        test.expect(eem.get()).toEqual({
            private: {
                "example.com": "private"
            }
        });
    });
});
