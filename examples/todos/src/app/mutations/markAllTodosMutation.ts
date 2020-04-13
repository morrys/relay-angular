import { graphql, mutate } from 'relay-angular';

export const mutation = graphql`
    mutation markAllTodosMutation($input: MarkAllTodosInput!) {
        markAllTodos(input: $input) {
            changedTodos {
                id
                complete
            }
            user {
                id
                completedCount
            }
        }
    }
`;

function getOptimisticResponse(complete: boolean, todos: any, id, totalCount: any): any {
    // Relay returns Maybe types a lot of times in a connection that we need to cater for
    const validNodes: any = todos.edges
        ? todos.edges
              .filter(Boolean)
              .map((edge: any): any => edge.node)
              .filter(Boolean)
        : [];

    const changedTodos: any = validNodes
        .filter((node: any): boolean => node.complete !== complete)
        .map((node: any): any => ({
            complete: complete,
            id: node.id,
        }));

    return {
        markAllTodos: {
            changedTodos,
            user: {
                id,
                completedCount: complete ? totalCount : 0,
            },
        },
    };
}

function commit(complete: boolean, todos: any, id, userId: any, totalCount): any {
    const input: any = {
        complete,
        userId,
    };

    return mutate({
        mutation,
        variables: {
            input,
        },
        optimisticResponse: getOptimisticResponse(complete, todos, id, totalCount),
    });
}

export default { commit };
