# [@relay-angular](https://github.com/morrys/relay-angular)

Relay for Angular 

## Contributing

* **Give a star** to the repository and **share it**, you will **help** the **project** and the **people** who will find it useful

* **Create issues**, your **questions** are a **valuable help**

* **PRs are welcome**, but it is always **better to open the issue first** so as to **help** me and other people **evaluating it**

* **Please sponsor me**

## Installation

Install relay-angular using yarn or npm:

```
yarn add relay-angular relay-runtime
```

Install relay-angular-plugin & relay-compiler using yarn or npm:

```
yarn add relay-angular-plugin ngx-build-plus relay-compiler relay-config
```

## Configuration

### relay

configuration file:

```js
// relay.config.js
module.exports = {
    // ...
    // Configuration options accepted by the `relay-compiler` command-line tool,  `babel-plugin-relay` and `relay-angular-plugin`.
    src: './src',
    schema: '../server/data/schema.graphql',
    language: 'typescript',
    artifactDirectory: './src/__generated__/relay/',
};
```

### ngx-build-plus

[see ngx-build-plus getting started](https://github.com/manfredsteyer/ngx-build-plus#getting-started)

* angular.json

Change the builder to serve and build

```
"build": {
  "builder": "ngx-build-plus:browser",
  ...
}
"serve": {
  "builder": "ngx-build-plus:dev-server",
   ...
}
```

### package.json

```
"scripts": {
    ...
    "build": "ng build --plugin relay-angular-plugin",
    "start": "ng serve --plugin relay-angular-plugin",
    "compile": "relay-compiler"
    ...
}    
```

