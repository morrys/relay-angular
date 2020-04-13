import { OperationType, GraphQLTaggedNode } from 'relay-runtime';
import { KeyType, ArrayKeyType, QueryOptions } from './RelayHooksType';

export const PROP_METADATA = '__prop__metadata__';

export function noSideEffects<T>(fn: () => T): T {
    return ({ toString: fn }.toString() as unknown) as T;
}

function relayDecorator(target, decoratorName, name, resolve, props): void {
    const ngOnInitOriginal = target.ngOnInit;
    const ngOnChangesOriginal = target.ngOnChanges;
    const ngOnDestroyOriginal = target.ngOnDestroy;
    let resolver;
    target.ngOnInit = function (): any {
        resolver = resolve(decoratorName, () => {
            this[name] = resolver.update(props.apply(this, [this]));
        });
        if (ngOnInitOriginal) ngOnInitOriginal.apply(this);
        this[name] = resolver.init(props.apply(this, [this]));
    };
    target.ngOnChanges = function (changes): any {
        if (ngOnChangesOriginal) ngOnChangesOriginal.apply(this, [changes]);
        if (resolver && resolver.update) {
            this[name] = resolver.update(props.apply(this, [this]));
        }
    };

    target.ngOnDestroy = function (): any {
        if (ngOnDestroyOriginal) ngOnDestroyOriginal.apply(this);
        if (resolver) resolver.dispose();
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
