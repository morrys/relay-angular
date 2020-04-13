import { dirname, join as joinPath, relative as relativePath, resolve as resolvePath } from 'path';
import { AngularCompilerPlugin } from '@ngtools/webpack';
import * as GraphQL from 'graphql';
import * as ts from 'typescript';
const GENERATED = './__generated__/';
let RelayConfig;
try {
    RelayConfig = eval('require')('relay-config');
} catch (_) {}

const config = RelayConfig && RelayConfig.loadConfig();

const relayTransform = <T extends ts.Node>(context: ts.TransformationContext): ((rootNode: ts.SourceFile) => ts.SourceFile) => {
    return (rootNode: ts.SourceFile): ts.SourceFile => {
        const imports: any = [];
        const fileName = rootNode.fileName;
        function visit(node: ts.Node): ts.Node {
            if (ts.isTaggedTemplateExpression(node)) {
                if (node.tag.getText() === 'graphql') {
                    const template = node.template.getFullText();
                    const text = template.substring(1, template.length - 1);
                    const ast = GraphQL.parse(text);

                    if (ast.definitions.length === 0) {
                        throw new Error('AngularPluginRelay: Unexpected empty graphql tag.');
                    }
                    const imp = compileGraphQLTag(fileName, ast);
                    imports.push(imp);
                    return ts.visitEachChild(imp.node, visit, context);
                }
            }
            return ts.visitEachChild(node, visit, context);
        }
        const node = ts.visitNode(rootNode, visit);
        /* eslint-disable indent */
        const update = !imports.length
            ? node
            : ts.updateSourceFileNode(node, [
                  ...imports.map((imp) =>
                      ts.createImportDeclaration(
                          undefined,
                          undefined,
                          ts.createImportClause(imp.node, undefined),
                          ts.createLiteral(imp.path),
                      ),
                  ),
                  ...node.statements,
              ]);
        return update;
        /* eslint-enable indent */
    };
};

function compileGraphQLTag(
    fileName,
    ast,
): {
    node: ts.Identifier;
    path: string;
} {
    if (ast.definitions.length !== 1) {
        throw new Error('AngularPluginRelay: Expected exactly one definition per graphql tag.');
    }

    const graphqlDefinition = ast.definitions[0];

    if (graphqlDefinition.kind !== 'FragmentDefinition' && graphqlDefinition.kind !== 'OperationDefinition') {
        throw new Error(
            'AngularPluginRelay: Expected a fragment, mutation, query, or ' + 'subscription, got `' + graphqlDefinition.kind + '`.',
        );
    }

    const definitionName = graphqlDefinition.name && graphqlDefinition.name.value;

    if (!definitionName) {
        throw new Error('GraphQL operations and fragments must contain names');
    }

    const requiredFile = definitionName + '.graphql';
    const requiredPath =
        config && config.artifactDirectory
            ? getRelativeImportPath(fileName, config.artifactDirectory, requiredFile)
            : GENERATED + requiredFile;

    return {
        node: ts.createIdentifier(definitionName),
        path: requiredPath,
    };
}

function findAngularCompilerPlugin(webpackCfg): AngularCompilerPlugin | null {
    return webpackCfg.plugins.find((plugin) => plugin instanceof AngularCompilerPlugin);
}

// The AngularCompilerPlugin has nog public API to add transformations, user private API _transformers instead.
function addTransformerToAngularCompilerPlugin(acp, transformer): void {
    acp._transformers = [transformer, ...acp._transformers];
}

export default {
    pre(): void {
        // This hook is not used in our example
    },

    // This hook is used to manipulate the webpack configuration
    config(cfg): any {
        // Find the AngularCompilerPlugin in the webpack configuration
        const angularCompilerPlugin = findAngularCompilerPlugin(cfg);

        if (!angularCompilerPlugin) {
            console.error('Could not inject the typescript transformer: Webpack AngularCompilerPlugin not found');
            return;
        }

        addTransformerToAngularCompilerPlugin(angularCompilerPlugin, relayTransform);
        return cfg;
    },

    post(): void {
        // This hook is not used in our example
    },
};

function getRelativeImportPath(filename: string, artifactDirectory: string, fileToRequire: string): string {
    const relative = relativePath(dirname(filename), resolvePath(artifactDirectory));

    const relativeReference = relative.length === 0 || !relative.startsWith('.') ? './' : '';

    return relativeReference + joinPath(relative, fileToRequire);
}
