import { makeQueryDecorator } from './Decorator';
import { QueryFetcher } from './QueryFetcher';
import { STORE_ONLY } from './RelayHooksType';
import { environmentContext } from './RelayProvider';
import { createOperation } from './Utils';

export const Query = makeQueryDecorator('Query', (_decoratorName) => {
    const queryFetcher = new QueryFetcher();
    let environment: any = null;
    let first = true;
    const subscription = environmentContext.subscribe((env) => {
        environment = env;
        if (!first) {
            queryFetcher.refreshHooks();
        }
    });
    const update = (props, forceUpdate: () => undefined): any => {
        if (forceUpdate) {
            first = false;
            queryFetcher.setForceUpdate(forceUpdate);
        }
        const memoVariables = props.variables;
        const operation = createOperation(props.query, memoVariables);
        const options = props.options || {};
        const { ttl } = options;
        const isOnline = !environment.isOnline || environment.isOnline();
        options.fetchPolicy = isOnline ? options.fetchPolicy : STORE_ONLY;
        return queryFetcher.execute(
            environment,
            operation,
            options,
            (environment, query) => environment.retain(query, { ttl }), // TODO new directive
        );
    };
    const dispose = (): void => {
        subscription.unsubscribe();
        queryFetcher.dispose();
    };
    return {
        init: update,
        update,
        dispose,
    };
});
