# Relay Hooks TodoMVC

## Installation

```
yarn
```

## Running

Set up generated files:

```
yarn run update-schema
```

Start a local server:

```
yarn run start
```

If at any time you make changes to `data/schema.ts`, stop the server,
regenerate `data/schema.graphql`, and restart the server:

```
yarn run update-schema
yarn run start
```
