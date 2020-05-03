module.exports = {
    // ...
    // Configuration options accepted by the `relay-compiler` command-line tool,  `babel-plugin-relay` and `relay-angular-plugin`.
    src: './src',
    schema: '../server/data/schema.graphql',
    language: 'typescript',
    artifactDirectory: './src/__generated__/relay/',
};
