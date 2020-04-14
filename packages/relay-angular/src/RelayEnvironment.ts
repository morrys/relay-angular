import { makeGenericsDecorator } from './Decorator';
import { environmentContext } from './RelayProvider';

export const RelayEnvironment = makeGenericsDecorator('RelayEnvironment', (_decName) => {
    let environment = null;
    let first = true;
    let forceUpdate;
    const subscription = environmentContext.subscribe((env) => {
        environment = env;
        if (!first && forceUpdate) {
            forceUpdate();
        }
    });
    const init = (_props, decForceUpdate): any => {
        first = false;
        forceUpdate = decForceUpdate;
        return environment;
    };
    const dispose = (): void => {
        subscription.unsubscribe();
    };
    return {
        init,
        dispose,
    };
});
