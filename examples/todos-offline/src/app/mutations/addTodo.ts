import { mutate } from 'relay-angular';
import { graphql } from 'relay-runtime';

import { ConnectionHandler } from 'relay-runtime';

export const mutation = graphql`
    mutation addTodoMutation($input: AddTodoInput!) {
        addTodo(input: $input) {
            todoEdge {
                __typename
                cursor
                node {
                    complete
                    id
                    text
                }
            }
            user {
                id
                totalCount
            }
        }
    }
`;

function sharedUpdater(store: any, user: any, newEdge: any) {
    const userProxy = store.get(user.id);
    const conn = ConnectionHandler.getConnection(userProxy, 'TodoList_todos');
    ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

let tempID = 0;

function commit(text: string, user: any): any {
    const input: any = {
        text,
        userId: user.userId,
        clientMutationId: `${tempID++}`,
    };
    console.log('mutate', mutate);
    return mutate({
        mutation,
        variables: {
            input,
        },
        updater: (store: any) => {
            const payload = store.getRootField('addTodo');
            const newEdge = payload.getLinkedRecord('todoEdge');
            sharedUpdater(store, user, newEdge);
        },
        optimisticUpdater: (store: any) => {
            const id = 'client:newTodo:' + tempID++;
            const node = store.create(id, 'Todo');
            node.setValue(text, 'text');
            node.setValue(id, 'id');

            const newEdge = store.create('client:newEdge:' + tempID++, 'TodoEdge');
            newEdge.setLinkedRecord(node, 'node');
            sharedUpdater(store, user, newEdge);

            // Get the UserProxy, and update the totalCount
            const userProxy = store.get(user.id);

            if (!userProxy) {
                throw new Error('Failed to retrieve userProxy from store');
            }

            const totalCount = userProxy.getValue('totalCount');

            if (typeof totalCount !== 'number') {
                throw new Error(`Expected userProxy.totalCount to be number, but got: ${typeof totalCount}`);
            }

            userProxy.setValue(totalCount + 1, 'totalCount');
        },
    });
}

export default { commit };
