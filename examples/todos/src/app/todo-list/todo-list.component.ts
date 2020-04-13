import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fragment } from 'relay-angular';
import { graphql } from 'relay-runtime';
import { Todo } from '../todo';
import markAllTodosMutation from '../mutations/markAllTodosMutation';

const fragmentNode = graphql`
    fragment todoList_user on User {
        id
        userId
        totalCount
        completedCount
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

    @Output()
    remove: EventEmitter<Todo> = new EventEmitter();

    @Output()
    toggleComplete: EventEmitter<Todo> = new EventEmitter();

    handleMarkAllChange(e) {
        console.log('e', e, this.data);
        const complete = e.target.checked;

        if (this.data.todos) {
            markAllTodosMutation.commit(complete, this.data.todos, this.data.id, this.data.userId, this.data.totalCount);
        }
    }

    onToggleTodoComplete(todo: Todo) {
        this.toggleComplete.emit(todo);
    }

    onRemoveTodo(todo: Todo) {
        this.remove.emit(todo);
    }
}
