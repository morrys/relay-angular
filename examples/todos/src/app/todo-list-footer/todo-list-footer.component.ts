import { Component, Input } from '@angular/core';
import { Refetch, ReturnTypeRefetchNode } from 'relay-angular';
import { graphql } from 'relay-runtime';
import removeCompletedTodosMutation from '../mutations/removeCompletedTodosMutation';
import { todoListFooter_user$data, todoListFooter_user$key } from '../../__generated__/relay/todoListFooter_user.graphql';
import { QueryApp } from '../todo-query/todo-query.component';
import { UserFragmentRefetchQuery } from 'src/__generated__/relay/UserFragmentRefetchQuery.graphql';

const fragmentNode = graphql`
    fragment todoListFooter_user on User
        @refetchable(queryName: "UserFragmentRefetchQuery")
        @argumentDefinitions(first: { type: "Int", defaultValue: 2147483647 }, cursor: { type: "String" }) {
        id
        userId
        completedCount
        todos(first: $first, after: $cursor) @connection(key: "TodoList_todos") {
            edges {
                node {
                    id
                    complete
                }
            }
        }
        totalCount
    }
`;

@Component({
    selector: 'app-todo-list-footer',
    templateUrl: './todo-list-footer.component.html',
    styleUrls: ['./todo-list-footer.component.css'],
})
export class TodoListFooterComponent {
    @Input()
    fragmentRef: any;

    @Refetch((_this) => ({
        fragmentNode,
        fragmentRef: _this.fragmentRef,
    }))
    result: ReturnTypeRefetchNode<UserFragmentRefetchQuery, todoListFooter_user$key, todoListFooter_user$data>;

    handleRefresh() {
        const { refetch } = this.result;
        refetch({});
    }

    handleRemoveCompletedTodosClick() {
        const {
            data: { todos, id, userId },
        } = this.result;

        const completedEdges = todos && todos.edges ? todos.edges.filter((edge: any) => edge && edge.node && edge.node.complete) : [];

        removeCompletedTodosMutation.commit(
            {
                edges: completedEdges,
            },
            id,
            userId,
        );
    }
}
