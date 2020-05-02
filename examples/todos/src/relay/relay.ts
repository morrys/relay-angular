import { Network } from 'relay-runtime';
import EnvironmentIDB from '@wora/relay-offline/lib/EnvironmentIDB';

async function fetchQuery(operation, variables, cacheConfig, uploadables) {
    const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: operation.text,
            variables,
        }),
    });

    return response.json();
}

const network = Network.create(fetchQuery);

const environment = EnvironmentIDB.create({
    network,
});
const manualExecution = false;
environment.setOfflineOptions({
    manualExecution, //optional
    network: network, //optional
    start: async (mutations) => {
        //optional
        console.log('start offline', mutations);
        return mutations;
    },
    finish: async (mutations, error) => {
        //optional
        console.log('finish offline', error, mutations);
    },
    onExecute: async (mutation) => {
        //optional
        console.log('onExecute offline', mutation);
        return mutation;
    },
    onComplete: async (options) => {
        //optional
        console.log('onComplete offline', options);
        return true;
    },
    onDiscard: async (options) => {
        //optional
        console.log('onDiscard offline', options);
        return true;
    },
    onPublish: async (offlinePayload) => {
        //optional
        console.log('offlinePayload', offlinePayload);
        return offlinePayload;
    },
});

export default environment;
