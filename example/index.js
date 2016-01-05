// Dependencies
const EngineApp = require("engine-app")
    , EntrypointManager = require("../lib")
    ;

// Create the EngineApp instance and then pass
// it to the entrypoint manager constructor
var app = new EngineApp("path/to/some/app")
  , entrypoints = new EntrypointManager(app)
  ;

// Add two domains
entrypoints.add(["example.com", "foo.bar"], (err, entrypoints) => {

    // List the domains
    entrypoints.list((err, entrypoints) => {

        console.log(entrypoints);
        // => ["example.com", "foo.bar"]

        // Update foo.bar -> domain.com
        entrypoints.update("foo.bar", "domain.com", (err, entrypoints) => {

            console.log(entrypoints);
            // => ["example.com", "domain.com"]

            // Remove example.com
            entrypoints.remove("example.com", (err, entrypoints) => {
                console.log(entrypoints);
                // => ["domain.com"]
            });
        });
    });
});
