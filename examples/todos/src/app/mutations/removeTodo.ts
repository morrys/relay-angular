import { mutate } from 'relay-angular';
import { graphql } from 'relay-runtime';

import { ConnectionHandler } from 'relay-runtime';

export const mutation = graphql`
    mutation removeTodoMutation($input: RemoveTodoInput!) {
        removeTodo(input: $input) {
            deletedTodoId
            user {
                completedCount
                totalCount
            }
        }
    }
`;

function sharedUpdater(store: any, user: any, deletedID: string) {
    const userProxy = store.get(user.id);
    const conn = ConnectionHandler.getConnection(userProxy, 'TodoList_todos');
    ConnectionHandler.deleteNode(conn, deletedID);
}

function commit(todo: any, user: any): any {
    const input: any = {
        id: todo.id,
        userId: user.userId,
    };

    return mutate({
        mutation,
        variables: {
            input,
        },
        updater: (store: any) => {
            const payload = store.getRootField('removeTodo');
            const deletedTodoId = payload.getValue('deletedTodoId');

            if (typeof deletedTodoId !== 'string') {
                throw new Error(`Expected removeTodo.deletedTodoId to be string, but got: ${typeof deletedTodoId}`);
            }

            sharedUpdater(store, user, deletedTodoId);
        },
        optimisticUpdater: (store: any) => {
            sharedUpdater(store, user, todo.id);
        },
    });
}

export default { commit };
