# engine-entrypoint-manager

The entrypoint manager for Engine applications.

## Installation

```sh
$ npm i --save engine-entrypoint-manager
```

## Example

```js
// Dependencies
const EngineApp = require("engine-app")
    , EntrypointManager = require("engine-entrypoint-manager")
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
```

## Documentation

### `EntrypointManager(app)`
Creates a new instance of the `EntrypointManager`.

#### Params
- **EngineApp** `app`: The `EngineApp` instance.

### `exists(name, pack, cb)`
Checks if the entrypoint exists is already added in the `entrypoints` array.

#### Params
- **String** `name`: The entrypoint value.
- **Object** `pack`: The `package.json` content.
- **Function** `cb`: The callback function.

### `list(cb)`
List the entrypoints.

#### Params
- **Function** `cb`: The callback function.

### `update(oldName, newName, cb)`
Updates an entrypoint.

#### Params
- **String** `oldName`: The old entrypoint value.
- **String** `newName`: The new entrypoint.
- **Function** `cb`: The callback function.

### `remove(name, cb)`
Removes an entrypoint.

#### Params
- **String** `name`: The entrypoint value.
- **Function** `cb`: The callback function.

### `create(name, cb)`
Creates a new entrypoint.

#### Params
- **String** `name`: The entrypoint value.
- **Function** `cb`: The callback function.

## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:

## License

[MIT][license] © [jillix][website]

[license]: http://showalicense.com/?fullname=jillix%20%3Ccontact%40jillix.com%3E%20(http%3A%2F%2Fjillix.com)&year=2016#license-mit
[website]: http://jillix.com
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md