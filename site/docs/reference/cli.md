# The "w4" tool (CLI)

After installing WASM-4, you can use it's Command Line Interface (CLI) to perform various tasks.

## The `w4` command

**Summary:**

The `w4` command is the base for all further subcommands.

**Usage:**

```
w4 [OPTIONS]
w4 <COMMAND> [OPTIONS] [TARGET]
```

**Examples:**

```shell
w4                        # Shows the help
w4 --version              # Shows the version
w4 new --odin snake       # Create a new project
w4 init --go              # Create a new project in current folder
w4 run build/cart.wasm    # Run build/cart.wasm in the browser
```

**Options:**

| Option    | Default value | Description                       |
| --------- | ------------- | --------------------------------- |
| -V        |               | Shows the version of the `w4` CLI |
| --version |               | Same as `-V`                      |

**Description:**

Like a lot of modern CLI tools, the `w4` CLI provides several subcommands like `new`, `build` or `run`.
Executing it alone will show the default help to get a feel for how to interact with it.

By providing the `-V` or `--version` the output will be replaced with the currently installed version.

## `new`, `create` and `init`

**Summary:**

The `new`, `create` and `init` commands create a new WASM-4 project with the selected language.

**Usage:**

```shell
w4 new [OPTIONS] <NAME>
w4 create [OPTIONS] <NAME>
w4 init [OPTIONS]
```

**Examples:**

```shell
w4 new snake
w4 new --odin tictactoe
w4 init
w4 init --lang nim
```

**Options:**

| Option           | Default value | Description                             |
| ---------------- | ------------- | --------------------------------------- |
| --as             |               | Uses AssemblyScript for the new project |
| --assemblyscript |               | Same as `--as`                          |
| --c              |               | Uses C/C++  for the new project         |
| --d              |               | Uses D for the new project              |
| --go             |               | Uses Go for the new project             |
| --nim            |               | Uses Nim for the new project            |
| --odin           |               | Uses Odin for the new project           |
| --rs             |               | Uses Rust for the new project           |
| --rust           |               | Same as `--rs`                          |
| --zig            |               | Uses Zig for the new project            |
| --lang LANGUAGE  | as / W4_LANG  | Uses the provided language              |

**Description:**

By default, `new` and `init` create an AssemblyScript project. This can be changed by providing one of the language options like `--as`, `--c`, `--d`, `--lang go` etc.

It's also possible to set the default language for the current user or the whole system by setting up the environment variable `W4_LANG`.

Example (Linux):

```bash
# ~/.profile
export W4_LANG=odin # Set default language for new WASM-4 projects to Odin
```

### Difference between `new`, `create` and `init`

All commands provide the same options and they all create a new project. The difference is, `new` creates a new directory while `init` uses the current directory. The `create` command is simply an alias for `new`.

## `watch`

**Summary:**

The `watch` command starts the build process and starts a server. This can be accessed in a browser. Changes made to the code, will cause a rebuild and a refresh of the browser.

**Usage:**

```
w4 watch [OPTIONS]
```

**Examples:**

```
w4 watch
w4 watch -n
w4 watch --no-open
```

**Options:**

| Option    | Default value | Description                       |
| --------- | ------------- | --------------------------------- |
| -n        |               | Prevents the browser from opening |
| --no-open |               | Same as `-n`                      |

**Description:**

By default, the command starts the build process (`npm run build`, `make` etc.), starts a server and opens the browser.
The option `-n`/`--no-open` prevents the browser from opening.

Also note, that the server will listen on `localhost:4444`.

It's also possible to set this option by default by setting an environment variable for the current user or the whole system.

Example (Linux):

```bash
# ~/.profile
export W4_NO_OPEN
```

## `run`

**Summary:**

The `run` command opens a cartridge in the web runtime.

**Usage:**

```
w4 run [OPTIONS] <CART>
```

**Examples:**

```
w4 run carts/wormhole.wasm
w4 run -n carts/minesweeper.wasm
w4 run --no-open carts/watris.wasm
```

**Options:**

| Option    | Default value | Description                       |
| --------- | ------------- | --------------------------------- |
| -n        |               | Prevents the browser from opening |
| --no-open |               | Same as `-n`                      |

**Description:**

The command starts the web runtime in a local server and opens the browser.
But the option `-n`/`--no-open` can be used to prevent the browser from opening.

Also note, that the server will listen on `localhost:4444`.

It's also possible to set this option by default by setting an environment variable for the current user or the whole system.

Example (Linux):

```bash
# ~/.profile
export W4_NO_OPEN
```

## `run-native`

**Summary:**

The `run-native` command opens the cart in the native runtime.

**Usage:**

```
w4 run-native <CART>
```

**Examples:**

```
w4 run-native carts/wormhole.wasm
w4 run-native carts/minesweeper.wasm
w4 run-native carts/watris.wasm
```

**Options:**

There are additional options.

**Description:**

The command opens the cartridge in a native window. The performance may be higher than using the web-runtime.

## `png2src`

**Summary:**

The `png2src` command converts PNG images to source code.

**Usage:**

```
w4 png2src [OPTIONS] <IMAGES...>
```

**Examples:**

```
w4 png2src fruit.png
w4 png2src --odin wall.png
w4 png2src --lang rust top.png down.png left.png right.png
```

**Options:**

| Option           | Default value | Description                             |
| ---------------- | ------------- | --------------------------------------- |
| --as             |               | Uses AssemblyScript for the new project |
| --assemblyscript |               | Same as `--as`                          |
| --c              |               | Uses C/C++  for the new project         |
| --d              |               | Uses D for the new project              |
| --go             |               | Uses Go for the new project             |
| --nim            |               | Uses Nim for the new project            |
| --odin           |               | Uses Odin for the new project           |
| --rs             |               | Uses Rust for the new project           |
| --rust           |               | Same as `--rs`                          |
| --zig            |               | Uses Zig for the new project            |
| --lang LANGUAGE  | as / W4_LANG  | Uses the provided language              |
| -t FILE          |               | Uses a custom template file             |
| --template FILE  |               | Same as `-t`                            |

**Description:**

The command takes one or more PNG image(s) and converts them to source code. The images have to meet certain criteria. Those are:

- Color Mode must be "Indexed"
- Max 4 colors
- At least 8 in width and 8 pixels in height (Recommended)

Using an image that is not index or has more than 4 colors will cause an error. Images with the size of 4x4 or less might lead to bugs.

By default it uses AssemblyScript. But this can be changed by setting the environment variable `W4_LANG`. Check the description of [`new`, `create` and `init`](#new-create-and-init) for more details.

## `bundle`

**Summary:**

The `bundle` command bundles a cartridge for final distribution.

**Usage:**

```
w4 bundle <OPTIONS> <CART>
```

**Examples:**

```
w4 bundle --html watris.html --title Watris --description "The classic puzzle game" --icon-file "watris.png" carts/watris.wasm
w4 bundle --linux minesweeper carts/minesweeper.wasm
w4 bundle --windows wormhole.exe --title "Wormhole Deluxe" wormhole.wasm
```

**Options:**

| Option                    | Default value | Description                                                                           |
| ------------------------- | ------------- | ------------------------------------------------------------------------------------- |
| --html OUTPUT             |               | Bundle standalone HTML file                                                           |
| --windows OUTPUT          |               | Bundle a native Windows executable                                                    |
| --mac OUTPUT              |               | Bundle a native macOS executable                                                      |
| --linux OUTPUT            |               | Bundle a native Linux executable                                                      |
| --title TITLE             | "WASM-4 Game" | Title of the game                                                                     |
| --description DESCRIPTION |               | The description of the game                                                           |
| --icon-file FILE          |               | Icon of the game. Supported are png, ico and svg.<br/>This will override `--icon-url` |
| --icon-url URL            |               | URL to the the Favicon of the game                                                    |
| --timestamp               | false         | Adds build timestamp to output                                                        |

**Description:**

With the `bundle` command, it's possible to distribute a cartridge to the web, windows, linux and macOS.
Each are self contained and therefore easy share.

The `--title` option changes the visible title of the game. Like in the title bar of the window.

:::note
At least one of the targets (`--html`, `--windows`, `--linux`, `--mac`) must be provided. If no target is provided, the command will fail.
:::

## `help`

**Summary:**

The `help` commands provides more details about the `w4` CLI and it's tools.

**Usage:**

```
w4 help [COMMAND]
w4 help [OPTION]
```

**Examples:**

```
w4 help
w4 help png2src
w4 help run-native
```

**Options:**

| Option    | Default value | Description                       |
| --------- | ------------- | --------------------------------- |
| -V        |               | Shows the version of the `w4` CLI |
| --version |               | Same as `-V`                      |

**Description:**

This command shows all options, the usage and more about the `w4` CLI or it's subcommands. 
Providing the `-V` or `--version` option however has precedence over a subcommand.

Therefore a `w4 help --version png2src` will not lead to show the help for the `png2src` command, but will only output the current version.