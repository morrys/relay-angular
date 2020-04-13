import { graphql, mutate } from 'relay-angular';
import { ConnectionHandler } from 'relay-runtime';

export const mutation = graphql`
    mutation removeCompletedTodosMutation($input: RemoveCompletedTodosInput!) {
        removeCompletedTodos(input: $input) {
            deletedTodoIds
            user {
                completedCount
                totalCount
            }
        }
    }
`;

function sharedUpdater(store: any, id: any, deletedIDs: ReadonlyArray<string>) {
    const userProxy = store.get(id);
    const conn = ConnectionHandler.getConnection(userProxy, 'TodoList_todos');

    // Purposefully type forEach as void, to toss the result of deleteNode
    deletedIDs.forEach((deletedID: string): void => ConnectionHandler.deleteNode(conn, deletedID));
}

function commit(todos: any, id, userId: any): any {
    const input: any = {
        userId,
    };

    return mutate({
        mutation,
        variables: {
            input,
        },
        updater: (store: any) => {
            const payload = store.getRootField('removeCompletedTodos');
            const deletedIds = payload.getValue('deletedTodoIds');

            // $FlowFixMe `payload.getValue` returns mixed, not sure how to check refinement to $ReadOnlyArray<string>
            sharedUpdater(store, id, deletedIds);
        },
        optimisticUpdater: (store: any) => {
            // Relay returns Maybe types a lot of times in a connection that we need to cater for
            const completedNodeIds: ReadonlyArray<string> = todos.edges
                ? todos.edges
                      .filter(Boolean)
                      .map((edge: any): any => edge.node)
                      .filter(Boolean)
                      .filter((node: any): boolean => node.complete)
                      .map((node: any): string => node.id)
                : [];

            sharedUpdater(store, id, completedNodeIds);
        },
    });
}

export default { commit };
