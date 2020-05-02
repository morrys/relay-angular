import { makeQueryDecorator } from './Decorator';
import { QueryFetcher } from './QueryFetcher';
import { environmentContext } from './RelayProvider';
import { createOperation } from './Utils';

export const Query = makeQueryDecorator('Query', (_decoratorName) => {
    const queryFetcher = new QueryFetcher();
    let environment = null;
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
        return queryFetcher.execute(environment, operation, props.options || {});
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
