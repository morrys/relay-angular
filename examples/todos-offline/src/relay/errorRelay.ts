import { Environment, Network, RecordSource, Store } from 'relay-runtime';

async function fetchQuery(operation, variables, cacheConfig, uploadables) {
    const response = await fetch('http://localhost:3000/graphqlError', {
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

const modernEnvironment: Environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
});

export default modernEnvironment;
