import { mutate } from 'relay-angular';
import { graphql } from 'relay-runtime';

export const mutation = graphql`
    mutation changeTodoStatusMutation($input: ChangeTodoStatusInput!) {
        changeTodoStatus(input: $input) {
            todo {
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

function getOptimisticResponse(complete: boolean, todo: any, user: any): any {
    return {
        changeTodoStatus: {
            todo: {
                complete: complete,
                id: todo.id,
            },
            user: {
                id: user.id,
                completedCount: complete ? user.completedCount + 1 : user.completedCount - 1,
            },
        },
    };
}

function commit(complete: boolean, todo: any, user: any): any {
    const input: any = {
        complete,
        userId: user.userId,
        id: todo.id,
    };

    return mutate({
        mutation,
        variables: {
            input,
        },
        optimisticResponse: getOptimisticResponse(complete, todo, user),
    });
}

export default { commit };
