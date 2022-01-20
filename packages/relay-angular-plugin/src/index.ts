import { AngularCompilerPlugin } from '@ngtools/webpack';
import relayTransform from 'ts-relay-plugin';
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
