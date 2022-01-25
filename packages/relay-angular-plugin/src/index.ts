/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AngularWebpackPlugin } from '@ngtools/webpack';
import { ivy } from '@ngtools/webpack';
import relayTransform from 'ts-relay-plugin';
function findAngularWebpackPlugin(webpackCfg): any | null {
    return webpackCfg.plugins.find((plugin) =>
        AngularWebpackPlugin ? plugin instanceof AngularWebpackPlugin : plugin instanceof ivy.AngularWebpackPlugin,
    );
    // plugin instanceof AngularWebpackPlugin angular > 12
    // plugin instanceof ivy.AngularWebpackPlugin angular == 11
}

function addTransformerToAngularWebpackPlugin(plugin: any, transformer): void {
    const originalFetchQuery = plugin.createFileEmitter; // private method
    plugin.createFileEmitter = function (program, transformers, getExtraDependencies, onAfterEmit) {
        if (!transformers) {
            transformers = {};
        }
        if (!transformers.before) {
            transformers = { before: [] };
        }
        transformers.before.push(transformer);
        return originalFetchQuery.apply(plugin, [program, transformers, getExtraDependencies, onAfterEmit]);
    };
}

export default {
    pre(): void {
        // This hook is not used in our example
    },

    // This hook is used to manipulate the webpack configuration
    config(cfg): any {
        // Find the AngularCompilerPlugin in the webpack configuration
        const angularWebpackPlugin = findAngularWebpackPlugin(cfg);

        if (!angularWebpackPlugin) {
            console.error('Could not inject the typescript transformer: Webpack AngularWebpackPlugin not found');
            return;
        }

        addTransformerToAngularWebpackPlugin(angularWebpackPlugin, relayTransform);
        return cfg;
    },

    post(): void {
        // This hook is not used in our example
    },
};
