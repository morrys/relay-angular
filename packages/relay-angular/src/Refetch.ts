import { makeFragmentsDecorator } from './Decorator';
import { resolverDecorator } from './FragmentResolver';
import { REFETCH } from './RelayHooksType';

export const Refetch = makeFragmentsDecorator(REFETCH, resolverDecorator);
