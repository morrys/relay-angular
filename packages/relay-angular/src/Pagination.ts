import { makeFragmentsDecorator } from './Decorator';
import { resolverDecorator } from './FragmentResolver';
import { PAGINATION_NAME } from './RelayHooksTypes';

export const Pagination = makeFragmentsDecorator(PAGINATION_NAME, resolverDecorator);
