import { makeFragmentsDecorator } from './Decorator';
import { resolverDecorator } from './FragmentResolver';
import { FRAGMENT_NAME } from './RelayHooksTypes';

export const Fragment = makeFragmentsDecorator(FRAGMENT_NAME, resolverDecorator);
