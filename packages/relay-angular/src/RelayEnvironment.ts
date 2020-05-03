import { makeGenericsDecorator } from './Decorator';
import { environmentContext } from './RelayProvider';

export const RelayEnvironment = makeGenericsDecorator('RelayEnvironment', (_decName) => {
    let environment: any = null;
    let first = true;
    let forceUpdate;
    const subscription = environmentContext.subscribe((env) => {
        //environment && environment.dispose && environment.dispose();
        environment = env;
        if (!first && forceUpdate) {
            forceUpdate();
        }
    });
    const update = (_props, decForceUpdate): any => {
        if (forceUpdate) {
            first = false;
            forceUpdate = decForceUpdate;
        }

        return environment;
    };
    const dispose = (): void => {
        subscription.unsubscribe();
    };
    return {
        init: update,
        update,
        dispose,
    };
});
