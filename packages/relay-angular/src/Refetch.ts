import { makeFragmentsDecorator } from './Decorator';
import { resolverDecorator } from './FragmentResolver';
import { REFETCHABLE_NAME } from './RelayHooksTypes';

export const Refetch = makeFragmentsDecorator(REFETCHABLE_NAME, resolverDecorator);
