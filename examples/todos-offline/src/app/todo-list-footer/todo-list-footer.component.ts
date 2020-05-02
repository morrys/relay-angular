import { Component, Input } from '@angular/core';
import { Refetch, RefetchDecorator } from 'relay-angular';
import { graphql } from 'relay-runtime';
import removeCompletedTodosMutation from '../mutations/removeCompletedTodosMutation';
import { todoListFooter_user$data } from '../../__generated__/relay/todoListFooter_user.graphql';
import { QueryApp } from '../todo-query/todo-query.component';

const fragmentNode = graphql`
    fragment todoListFooter_user on User {
        id
        userId
        completedCount
        todos(
            first: 2147483647 # max GraphQLInt
        ) @connection(key: "TodoList_todos") {
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
    data: RefetchDecorator<todoListFooter_user$data>;

    handleRefresh() {
        const { refetch, userId } = this.data;
        refetch(QueryApp, {
            userId,
        });
    }

    handleRemoveCompletedTodosClick() {
        const { todos, id, userId } = this.data;

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
