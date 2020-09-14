import { commitMutation, Disposable, MutationConfig, MutationParameters } from 'relay-runtime';
import { Environment } from 'relay-runtime';
import { environmentContext } from './RelayProvider';

let environment: Environment | null = null;
environmentContext.subscribe((env) => {
    environment = env;
});

export const mutate = (options: MutationConfig<MutationParameters>): Disposable => commitMutation(environment as Environment, options);
