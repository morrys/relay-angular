import { makeQueryDecorator } from './Decorator';
import QueryFetcher from './QueryFetcher';
import { environmentContext } from './RelayProvider';
import { createOperation } from './Utils';

export const Query = makeQueryDecorator('Query', (_decoratorName, forceUpdate) => {
    const queryFetcher = new QueryFetcher(forceUpdate);
    let environment = null;
    let first = true;
    const subscription = environmentContext.subscribe((env) => {
        environment = env;
        if (!first) {
            forceUpdate();
        }
        first = false;
    });
    const update = (props): any => {
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
