import { makeFragmentsDecorator } from './Decorator';
import { resolverDecorator } from './FragmentResolver';
import { PAGINATION } from './RelayHooksType';

export const Pagination = makeFragmentsDecorator(PAGINATION, resolverDecorator);
