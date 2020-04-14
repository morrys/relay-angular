import { Component, Input } from '@angular/core';
import { Fragment } from 'relay-angular';
import { graphql } from 'relay-runtime';
import markAllTodosMutation from '../mutations/markAllTodosMutation';

const fragmentNode = graphql`
    fragment todoList_user on User {
        id
        userId
        totalCount
        completedCount
        ...todoListItem_user
        todos(
            first: 2147483647 # max GraphQLInt
        ) @connection(key: "TodoList_todos") {
            edges {
                node {
                    id
                    complete
                    ...todoListItem_todo
                }
            }
        }
    }
`;

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
    @Input()
    fragmentRef: any;

    @Fragment((_this) => ({
        fragmentNode,
        fragmentRef: _this.fragmentRef,
    }))
    data: any;

    handleMarkAllChange(e) {
        console.log('e', e, this.data);
        const complete = e.target.checked;

        if (this.data.todos) {
            markAllTodosMutation.commit(complete, this.data.todos, this.data.id, this.data.userId, this.data.totalCount);
        }
    }
}
