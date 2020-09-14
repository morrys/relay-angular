export type ObserverOrCallback = Observer<void> | ((error: Error) => any);
import * as areEqual from 'fbjs/lib/areEqual';
import * as invariant from 'fbjs/lib/invariant';

import {
    getSelector,
    IEnvironment,
    Disposable,
    Snapshot,
    getFragment,
    Variables,
    getVariablesFromFragment,
    ReaderSelector,
    GraphQLTaggedNode,
    Observable,
    Observer,
    OperationDescriptor,
    CacheConfig,
    Subscription,
    getDataIDsFromFragment,
    __internal,
    PluralReaderSelector,
    Environment,
} from 'relay-runtime';
import { RefetchOptions, PaginationData, PAGINATION, REFETCH, ConnectionConfig } from './RelayHooksType';
import { environmentContext } from './RelayProvider';
import {
    isNetworkPolicy,
    isStorePolicy,
    getPaginationData,
    _getConnectionData,
    toObserver,
    getRootVariablesForSelector,
    getNewSelector,
    createOperation,
} from './Utils';

const { fetchQuery } = __internal;

type SingularOrPluralSnapshot = Snapshot | Array<Snapshot>;

function lookupFragment(environment, selector): SingularOrPluralSnapshot {
    return selector.kind === 'PluralReaderSelector' ? selector.selectors.map((s) => environment.lookup(s)) : environment.lookup(selector);
}

function getFragmentResult(snapshot: SingularOrPluralSnapshot): any {
    if (Array.isArray(snapshot)) {
        return { snapshot, data: snapshot.map((s) => s.data) };
    }
    return { snapshot, data: snapshot.data };
}

type FragmentResult = {
    snapshot: SingularOrPluralSnapshot | null;
    data: any;
};

export class FragmentResolver {
    _environment: IEnvironment;
    _fragment: any;
    _fragmentNode: any;
    _fragmentRef: any;
    _result: FragmentResult;
    _disposable: Disposable = { dispose: (): void => undefined };
    _selector: ReaderSelector;
    _forceUpdate: any;
    _isPlural: boolean;
    _refetchSubscription: Subscription | null;
    paginationData: PaginationData;
    _refetchVariables: Variables;
    _isARequestInFlight = false;
    _selectionReferences: Array<Disposable> = [];
    _cacheSelectionReference: Disposable | null;
    indexUpdate = 0;

    constructor(forceUpdate = (): void => undefined) {
        this._forceUpdate = forceUpdate;
    }

    setForceUpdate(forceUpdate: () => void): void {
        this._forceUpdate = forceUpdate;
    }

    refreshHooks(): void {
        if (this._forceUpdate) {
            this.indexUpdate += 1;
            this._forceUpdate(this.indexUpdate);
        }
    }

    dispose(): void {
        this._disposable && this._disposable.dispose();
        this._refetchSubscription && this._refetchSubscription.unsubscribe();
        this._refetchSubscription = null;
        this.disposeSelectionReferences();

        this._isARequestInFlight = false;
    }

    disposeSelectionReferences(): void {
        this._disposeCacheSelectionReference();
        this._selectionReferences.forEach((r) => r.dispose());
        this._selectionReferences = [];
    }

    _retainCachedOperation(operation: OperationDescriptor): void {
        this._disposeCacheSelectionReference();
        this._cacheSelectionReference = this._environment.retain(operation);
    }

    _disposeCacheSelectionReference(): void {
        this._cacheSelectionReference && this._cacheSelectionReference.dispose();
        this._cacheSelectionReference = null;
    }

    getFragmentVariables(fRef = this._fragmentRef): Variables {
        return getVariablesFromFragment(this._fragment, fRef);
    }

    changedFragmentRef(fragmentRef): boolean {
        if (this._fragmentRef !== fragmentRef) {
            const prevIDs = getDataIDsFromFragment(this._fragment, this._fragmentRef);
            const nextIDs = getDataIDsFromFragment(this._fragment, fragmentRef);

            if (
                !areEqual(prevIDs, nextIDs) ||
                !areEqual(this.getFragmentVariables(fragmentRef), this.getFragmentVariables(this._fragmentRef))
            ) {
                return true;
            }
        }
        return false;
    }

    resolve(environment: IEnvironment, fragmentNode, fragmentRef): void {
        if (this._fragmentNode !== fragmentNode) {
            this._fragment = getFragment(fragmentNode);
        }
        if (this._environment !== environment || this._fragmentNode !== fragmentNode || this.changedFragmentRef(fragmentRef)) {
            this._environment = environment;
            this._fragmentNode = fragmentNode;
            this._fragmentRef = fragmentRef;
            (this._result as any) = null;
            this.dispose();
            if (this._fragmentRef == null) {
                this._result = { data: null, snapshot: null };
            }

            // If fragmentRef is plural, ensure that it is an array.
            // If it's empty, return the empty array direclty before doing any more work.
            this._isPlural = this._fragment.metadata && this._fragment.metadata.plural && this._fragment.metadata.plural === true;
            if (this._isPlural) {
                if (this._fragmentRef.length === 0) {
                    this._result = { data: [], snapshot: [] };
                }
            }

            if (!this._result) {
                this._selector = getSelector(this._fragment, this._fragmentRef);
                this.lookup();
            }
        }
    }

    lookup(): void {
        const snapshot = lookupFragment(this._environment, this._selector);

        // if (!isMissingData(snapshot)) { this for promises
        this._result = getFragmentResult(snapshot);
        this.subscribe();
    }

    getData(): any | null {
        return this._result ? this._result.data : null;
    }

    subscribe(): void {
        const environment = this._environment;
        const renderedSnapshot = this._result.snapshot;

        this._disposable && this._disposable.dispose();
        if (!renderedSnapshot) {
            this._disposable = { dispose: (): void => undefined };
        }

        const dataSubscriptions: any = [];

        if (Array.isArray(renderedSnapshot)) {
            renderedSnapshot.forEach((snapshot, idx) => {
                dataSubscriptions.push(
                    environment.subscribe(snapshot, (latestSnapshot) => {
                        (this._result as any).snapshot[idx] = latestSnapshot;
                        (this._result as any).data[idx] = latestSnapshot.data;
                        this.refreshHooks();
                    }),
                );
            });
        } else {
            dataSubscriptions.push(
                environment.subscribe(renderedSnapshot as Snapshot, (latestSnapshot) => {
                    this._result = getFragmentResult(latestSnapshot);
                    this.refreshHooks();
                }),
            );
        }

        this._disposable = {
            dispose: (): void => {
                dataSubscriptions.map((s) => s.dispose());
            },
        };
    }

    changeVariables(variables, request): void {
        if (this._selector.kind === 'PluralReaderSelector') {
            (this._selector as any).selectors = (this._selector as PluralReaderSelector).selectors.map((s) =>
                getNewSelector(request, s, variables),
            );
        } else {
            this._selector = getNewSelector(request, this._selector, variables);
        }
        this.lookup();
    }

    lookupInStore(environment: IEnvironment, operation, fetchPolicy): Snapshot | null {
        if (isStorePolicy(fetchPolicy)) {
            const check: any = environment.check(operation);
            if (check === 'available' || check.status === 'available') {
                this._retainCachedOperation(operation);
                return environment.lookup(operation.fragment);
            }
        }
        return null;
    }

    refetch = (
        taggedNode: GraphQLTaggedNode,
        refetchVariables: Variables | ((fragmentVariables: Variables) => Variables),
        renderVariables: Variables,
        observerOrCallback: ObserverOrCallback,
        options: RefetchOptions,
    ): Disposable => {
        //TODO Function
        const fragmentVariables = this.getFragmentVariables();
        const fetchVariables = typeof refetchVariables === 'function' ? refetchVariables(fragmentVariables) : refetchVariables;
        const newFragmentVariables = renderVariables ? { ...fetchVariables, ...renderVariables } : fetchVariables;

        /*eslint-disable */
        const observer: any =
            typeof observerOrCallback === 'function'
                ? {
                      next: observerOrCallback,
                      error: observerOrCallback,
                  }
                : observerOrCallback || ({} as any);

        /*eslint-enable */
        const onNext = (operation, payload, complete): void => {
            this.changeVariables(newFragmentVariables, operation.request.node);
            this.refreshHooks();
            complete();
        };

        return this.executeFetcher(taggedNode, fetchVariables, options, observer, onNext);
    };

    // pagination

    isLoading = (): boolean => {
        return !!this._refetchSubscription;
    };

    hasMore = (connectionConfig?: ConnectionConfig): boolean => {
        this.paginationData = getPaginationData(this.paginationData, this._fragment);
        const connectionData = _getConnectionData(this.paginationData, this.getData(), connectionConfig);
        return !!(connectionData && connectionData.hasMore && connectionData.cursor);
    };

    refetchConnection = (
        connectionConfig: ConnectionConfig,
        totalCount: number,
        observerOrCallback: ObserverOrCallback,
        refetchVariables: Variables,
    ): Disposable => {
        this.paginationData = getPaginationData(this.paginationData, this._fragment);

        this._refetchVariables = refetchVariables;
        const paginatingVariables = {
            count: totalCount,
            cursor: null,
            totalCount,
        };
        return this._fetchPage(connectionConfig, paginatingVariables, toObserver(observerOrCallback), { force: true });
    };

    loadMore = (
        connectionConfig: ConnectionConfig,
        pageSize: number,
        observerOrCallback: ObserverOrCallback,
        options: RefetchOptions,
    ): Disposable => {
        this.paginationData = getPaginationData(this.paginationData, this._fragment);

        const observer = toObserver(observerOrCallback);
        const connectionData = _getConnectionData(this.paginationData, this.getData(), connectionConfig);

        if (!connectionData) {
            Observable.create((sink) => sink.complete()).subscribe(observer);
            return { dispose: (): void => undefined };
        }
        const totalCount = connectionData.edgeCount + pageSize;
        if (options && options.force) {
            return this.refetchConnection(connectionConfig, totalCount, observerOrCallback, {});
        }
        //const { END_CURSOR, START_CURSOR } = ConnectionInterface.get();
        const cursor = connectionData.cursor;
        /*warning(
            cursor,
            'ReactRelayPaginationContainer: Cannot `loadMore` without valid `%s` (got `%s`)',
            this._direction === FORWARD ? END_CURSOR : START_CURSOR,
            cursor,
        );*/
        const paginatingVariables = {
            count: pageSize,
            cursor: cursor,
            totalCount,
        };
        return this._fetchPage(connectionConfig, paginatingVariables, observer, options);
    };

    _fetchPage(
        connectionConfig: ConnectionConfig,
        paginatingVariables: {
            count: number;
            cursor: string | null;
            totalCount: number;
        },
        observer: Observer<void>,
        options: RefetchOptions,
    ): Disposable {
        //const { componentRef: _, __relayContext, ...restProps } = this.props;
        //const resolver = prevResult.resolver;
        //const fragments = prevResult.resolver._fragments;
        const rootVariables = getRootVariablesForSelector(this._selector);
        // hack 6.0.0
        let fragmentVariables = {
            ...rootVariables,
            ...this.getFragmentVariables(),
            ...this._refetchVariables,
        };
        let fetchVariables = connectionConfig.getVariables(
            this.getData(),
            {
                count: paginatingVariables.count,
                cursor: paginatingVariables.cursor,
            },
            fragmentVariables,
        );
        invariant(
            typeof fetchVariables === 'object' && fetchVariables !== null,
            'ReactRelayPaginationContainer: Expected `getVariables()` to ' + 'return an object, got `%s` in `%s`.',
            fetchVariables,
            'useFragment pagination',
        );
        fetchVariables = {
            ...fetchVariables,
            ...this._refetchVariables,
        };
        fragmentVariables = {
            ...fetchVariables,
            ...fragmentVariables,
        };

        const onNext = (operation, payload, complete): void => {
            const prevData = this.getData();

            const getFragmentVariables = connectionConfig.getFragmentVariables || this.paginationData.getFragmentVariables;
            this.changeVariables(getFragmentVariables(fragmentVariables, paginatingVariables.totalCount), operation.request.node);

            const nextData = this.getData();

            // Workaround slightly different handling for connection in different
            // core implementations:
            // - Classic core requires the count to be explicitly incremented
            // - Modern core automatically appends new items, updating the count
            //   isn't required to see new data.
            //
            // `setState` is only required if changing the variables would change the
            // resolved data.
            // TODO #14894725: remove PaginationContainer equal check

            if (!areEqual(prevData, nextData)) {
                this.refreshHooks();
                const callComplete = async (): Promise<void> => {
                    complete();
                };
                callComplete();
            } else {
                complete();
            }
        };

        return this.executeFetcher(connectionConfig.query, fetchVariables, options, observer, onNext);
    }

    executeFetcher(
        taggedNode: GraphQLTaggedNode,
        fetchVariables: Variables,
        options: RefetchOptions,
        observerOrCallback: ObserverOrCallback,
        onNext: (operation, payload, complete) => void,
    ): Disposable {
        const cacheConfig: CacheConfig | undefined = options ? { force: !!options.force } : undefined;
        if (cacheConfig != null && options && options.metadata != null) {
            cacheConfig.metadata = options.metadata;
        }

        /*eslint-disable */
        const observer: any =
            typeof observerOrCallback === 'function'
                ? {
                      next: observerOrCallback,
                      error: observerOrCallback,
                  }
                : observerOrCallback || ({} as any);

        /*eslint-enable */

        const operation = createOperation(taggedNode, fetchVariables);

        const optionsFetch = options ? options : {};

        const { fetchPolicy = 'network-only' } = optionsFetch;

        const storeSnapshot = this.lookupInStore(this._environment, operation, fetchPolicy);
        if (storeSnapshot != null) {
            onNext(operation, null, () => {
                observer.next && observer.next();
                observer.complete && observer.complete();
            });
        }
        // Cancel any previously running refetch.
        this._refetchSubscription && this._refetchSubscription.unsubscribe();

        // Declare refetchSubscription before assigning it in .start(), since
        // synchronous completion may call callbacks .subscribe() returns.
        let refetchSubscription: Subscription;

        const isNetwork = isNetworkPolicy(fetchPolicy, storeSnapshot);
        if (!isNetwork) {
            return {
                dispose: (): void => undefined,
            };
        }
        if (isNetwork) {
            const reference = this._environment.retain(operation);

            /*eslint-disable */
            const fetchQueryOptions =
                cacheConfig != null
                    ? {
                          networkCacheConfig: cacheConfig,
                      }
                    : {};

            /*eslint-enable */
            const cleanup = (): void => {
                this._selectionReferences = this._selectionReferences.concat(reference);
                if (this._refetchSubscription === refetchSubscription) {
                    this._refetchSubscription = null;
                    this._isARequestInFlight = false;
                }
            };

            this._isARequestInFlight = true;
            fetchQuery(this._environment, operation, fetchQueryOptions)
                .mergeMap((payload) => {
                    return Observable.create((sink) => {
                        onNext(operation, payload, () => {
                            sink.next(undefined); // pass void to public observer's `next`
                            sink.complete();
                        });
                    });
                })
                // use do instead of finally so that observer's `complete` fires after cleanup
                .do({
                    error: cleanup,
                    complete: cleanup,
                    unsubscribe: cleanup,
                })
                .subscribe({
                    ...observer,
                    start: (subscription) => {
                        refetchSubscription = subscription;
                        this._refetchSubscription = this._isARequestInFlight ? refetchSubscription : null;
                        observer.start && observer.start(subscription);
                    },
                });
        }

        return {
            dispose: (): void => {
                refetchSubscription && refetchSubscription.unsubscribe();
            },
        };
    }
}

export const resolverDecorator = (
    decoratorName,
): {
    init: (forceUpdate, props: any) => any;
    update: (props: any) => any;
    dispose: () => void;
} => {
    const resolver = new FragmentResolver();
    let environment: Environment | null = null;
    let first = true;
    const subscription = environmentContext.subscribe((env) => {
        environment = env;
        if (!first) {
            resolver.refreshHooks();
        }
    });
    const update = (props: any, forceUpdate?: () => undefined): any => {
        if (forceUpdate) {
            first = false;
            resolver.setForceUpdate(forceUpdate);
        }
        resolver.resolve(environment as Environment, props.fragmentNode || props.fragmentNode, props.fragmentRef);
        const data = resolver.getData();
        if (data) {
            switch (decoratorName) {
                case PAGINATION:
                    data.loadMore = resolver.loadMore;
                    data.hasMore = resolver.hasMore;
                    data.isLoading = resolver.isLoading;
                    data.refetchConnection = resolver.refetchConnection;
                    return Object.assign(
                        {
                            loadMore: resolver.loadMore,
                            hasMore: resolver.hasMore,
                            isLoading: resolver.isLoading,
                            refetchConnection: resolver.refetchConnection,
                        },
                        data,
                    );
                case REFETCH:
                    return Object.assign({ refetch: resolver.refetch }, data);
                default:
            }
        }
        return data;
    };
    const dispose = (): void => {
        subscription.unsubscribe();
        resolver.dispose();
    };
    return {
        init: update,
        update,
        dispose,
    };
};
