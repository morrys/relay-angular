import { commitMutation, Disposable, MutationConfig, MutationParameters } from 'relay-runtime';
import { environmentContext } from './RelayProvider';

let environment = null;
environmentContext.subscribe((env) => {
    environment = env;
});

export const mutate = (options: MutationConfig<MutationParameters>): Disposable => commitMutation(environment, options);
