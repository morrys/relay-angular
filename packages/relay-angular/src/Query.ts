import { makeQueryDecorator } from './Decorator';
import { QueryFetcher } from './QueryFetcher';
import { STORE_ONLY } from './RelayHooksTypes';
import { environmentContext } from './RelayProvider';

export const Query = makeQueryDecorator('Query', (_decoratorName) => {
    const queryFetcher = new QueryFetcher();
    let environment: any = null;
    let first = true;
    const subscription = environmentContext.subscribe((env) => {
        environment = env;
        if (!first) {
            queryFetcher.resolveEnvironment(environment);
            queryFetcher.forceUpdate && queryFetcher.forceUpdate();
        }
    });
    const update = (props, forceUpdate: () => undefined): any => {
        if (forceUpdate) {
            first = false;
            queryFetcher.setForceUpdate(forceUpdate);
        }
        const options = props.options || {};
        const isOnline = !environment.isOnline || environment.isOnline();
        options.fetchPolicy = isOnline ? options.fetchPolicy : STORE_ONLY;
        queryFetcher.resolve(environment, props.query, props.variables, options);
        return queryFetcher.getData();
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
