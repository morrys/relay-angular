import { OperationType, GraphQLTaggedNode } from 'relay-runtime';
import { KeyType, ArrayKeyType, QueryOptions } from './RelayHooksTypes';

export const PROP_METADATA = '__prop__metadata__';

export function noSideEffects<T>(fn: () => T): T {
    return ({ toString: fn }.toString() as unknown) as T;
}

const mapResolverTarget = new Map();
function getOrCreateResolver(target, name, decoratorName, resolve): any {
    const mapResolverField = mapResolverTarget.get(target) || new Map();

    mapResolverTarget.set(target, mapResolverField);
    if (mapResolverField.has(name)) {
        return mapResolverField.get(name);
    }
    const resolver = resolve(decoratorName);
    mapResolverField.set(name, resolver);
    return resolver;
}
function disposeResolver(target, name): void {
    const mapResolverField = mapResolverTarget.get(target);
    if (mapResolverField && mapResolverField.has(name)) {
        const resolver = mapResolverField.get(name);
        if (resolver) {
            resolver.dispose();
            mapResolverField.delete(name);
        }
        mapResolverField.size === 0 && mapResolverTarget.delete(target);
    }
}

function relayDecorator(target, decoratorName, name, resolve, props): void {
    const ngOnInitOriginal = target.ngOnInit;
    const ngOnChangesOriginal = target.ngOnChanges;
    const ngOnDestroyOriginal = target.ngOnDestroy;
    target.ngOnInit = function (): any {
        const resolver = getOrCreateResolver(this, name, decoratorName, resolve);
        if (ngOnInitOriginal) ngOnInitOriginal.apply(this);
        const forceUpdate = (): void => {
            const resolver = getOrCreateResolver(this, name, decoratorName, resolve);
            if (resolver && resolver.update) {
                this[name] = resolver.update(props.apply(this, [this]));
            }
        };
        this[name] = resolver.init(props.apply(this, [this]), forceUpdate);
    };
    target.ngOnChanges = function (changes): any {
        if (ngOnChangesOriginal) ngOnChangesOriginal.apply(this, [changes]);
        const resolver = getOrCreateResolver(this, name, decoratorName, resolve);
        if (resolver && resolver.update) {
            this[name] = resolver.update(props.apply(this, [this]));
        }
    };

    target.ngOnDestroy = function (): any {
        if (ngOnDestroyOriginal) ngOnDestroyOriginal.apply(this);
        disposeResolver(this, name);
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function makeGenericsDecorator(decoratorName: string, resolve: (decoratorName: string, forceUpdate: () => void) => any) {
    return noSideEffects(() => {
        function PropDecoratorFactory(this: unknown | typeof PropDecoratorFactory, props = (): void => undefined): any {
            if (this instanceof PropDecoratorFactory) {
                //metaCtor.apply(this, args);
                return this;
            }

            const decoratorInstance = new (PropDecoratorFactory as any)([props]);

            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            function PropDecorator(target: any, name: string) {
                const constructor = target.constructor;
                // Use of Object.defineProperty is important since it creates non-enumerable property which
                // prevents the property is copied during subclassing.
                const meta = constructor.hasOwnProperty(PROP_METADATA)
                    ? (constructor as any)[PROP_METADATA]
                    : Object.defineProperty(constructor, PROP_METADATA, { value: {} })[PROP_METADATA];
                meta[name] = (meta.hasOwnProperty(name) && meta[name]) || [];
                meta[name].unshift(decoratorInstance);
                relayDecorator(target, decoratorName, name, resolve, props);
            }

            return PropDecorator;
        }
        PropDecoratorFactory.prototype.ngMetadataName = name;
        (PropDecoratorFactory as any).annotationCls = PropDecoratorFactory;
        return PropDecoratorFactory;
    });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function makeQueryDecorator(decoratorName: string, resolve: (decoratorName: string, forceUpdate: () => void) => any) {
    return noSideEffects(() => {
        function PropDecoratorFactory<TOperationType extends OperationType>(
            this: unknown | typeof PropDecoratorFactory,
            props: (
                _this: any,
            ) => {
                query: GraphQLTaggedNode;
                variables?: TOperationType['variables'];
                options?: QueryOptions;
            },
        ): any {
            if (this instanceof PropDecoratorFactory) {
                //metaCtor.apply(this, args);
                return this;
            }

            const decoratorInstance = new (PropDecoratorFactory as any)([props]);

            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            function PropDecorator(target: any, name: string) {
                const constructor = target.constructor;
                // Use of Object.defineProperty is important since it creates non-enumerable property which
                // prevents the property is copied during subclassing.
                const meta = constructor.hasOwnProperty(PROP_METADATA)
                    ? (constructor as any)[PROP_METADATA]
                    : Object.defineProperty(constructor, PROP_METADATA, { value: {} })[PROP_METADATA];
                meta[name] = (meta.hasOwnProperty(name) && meta[name]) || [];
                meta[name].unshift(decoratorInstance);
                relayDecorator(target, decoratorName, name, resolve, props);
            }

            return PropDecorator;
        }
        PropDecoratorFactory.prototype.ngMetadataName = name;
        (PropDecoratorFactory as any).annotationCls = PropDecoratorFactory;
        return PropDecoratorFactory;
    });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function makeFragmentsDecorator(decoratorName: string, resolve: (decoratorName: string, forceUpdate: () => void) => any) {
    return noSideEffects(() => {
        function PropDecoratorFactory<TKey extends KeyType | ArrayKeyType>(
            this: unknown | typeof PropDecoratorFactory,
            props: (
                _this: any,
            ) =>
                | {
                      fragmentNode: GraphQLTaggedNode;
                      fragmentRef: TKey;
                  }
                | {
                      fragmentNode: GraphQLTaggedNode;
                      fragmentRef: TKey | null;
                  },
        ): any {
            if (this instanceof PropDecoratorFactory) {
                return this;
            }

            const decoratorInstance = new (PropDecoratorFactory as any)([props]);

            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            function PropDecorator(target: any, name: string) {
                const constructor = target.constructor;
                // Use of Object.defineProperty is important since it creates non-enumerable property which
                // prevents the property is copied during subclassing.
                const meta = constructor.hasOwnProperty(PROP_METADATA)
                    ? (constructor as any)[PROP_METADATA]
                    : Object.defineProperty(constructor, PROP_METADATA, { value: {} })[PROP_METADATA];
                meta[name] = (meta.hasOwnProperty(name) && meta[name]) || [];
                meta[name].unshift(decoratorInstance);
                relayDecorator(target, decoratorName, name, resolve, props);
            }

            return PropDecorator;
        }

        PropDecoratorFactory.prototype.ngMetadataName = name;
        (PropDecoratorFactory as any).annotationCls = PropDecoratorFactory;
        return PropDecoratorFactory;
    });
}
