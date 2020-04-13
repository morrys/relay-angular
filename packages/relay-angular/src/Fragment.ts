import { makeFragmentsDecorator } from './Decorator';
import { resolverDecorator } from './FragmentResolver';
import { FRAGMENT } from './RelayHooksType';

export const Fragment = makeFragmentsDecorator(FRAGMENT, resolverDecorator);
