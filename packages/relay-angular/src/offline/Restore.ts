import { makeGenericsDecorator } from '../Decorator';
import { environmentContext } from '../RelayProvider';

export const Restore = makeGenericsDecorator('Restore', (_decName) => {
    let environment: any = null;
    let first = true;
    let forceUpdate;
    const subscription = environmentContext.subscribe((env) => {
        environment = env;
        if (!first && forceUpdate) {
            forceUpdate();
        }
    });
    const update = (_props, decForceUpdate): any => {
        if (decForceUpdate) {
            first = false;
            forceUpdate = decForceUpdate;
        }
        if (environment != null) {
            const rehydrated = environment.isRehydrated();
            if (!rehydrated) {
                setTimeout(() => environment.hydrate().then(forceUpdate), 0);
            }
            return rehydrated;
        }
        return false;
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
