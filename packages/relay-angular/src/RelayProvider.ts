import { Environment } from 'relay-runtime';
import { BehaviorSubject } from 'rxjs';

export class EnvironmentContext extends BehaviorSubject<Environment> {}

export const environmentContext = new EnvironmentContext(null);

export const RelayProvider = (
    environment: Environment,
): {
    provide: EnvironmentContext;
    useValue: EnvironmentContext;
} => {
    environmentContext.next(environment);
    return { provide: EnvironmentContext as any, useValue: environmentContext };
};
