import { makeGenericsDecorator } from './Decorator';
import { environmentContext } from './RelayProvider';

export const RelayEnvironment = makeGenericsDecorator('RelayEnvironment', (decName, decForceUpdate) => {
    let environment = null;
    let first = true;
    const subscription = environmentContext.subscribe((env) => {
        environment = env;
        if (!first) {
            decForceUpdate();
        }
        first = false;
    });
    const forceUpdate = (_props): any => environment;
    const dispose = (): void => {
        subscription.unsubscribe();
    };
    return {
        init: forceUpdate,
        dispose,
    };
});
