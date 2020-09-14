import { Component, Input, OnInit } from '@angular/core';
import { Fragment } from 'relay-angular';
import { graphql } from 'relay-runtime';
import { todoListItem_todo$key, todoListItem_todo$data } from '../../__generated__/relay/todoListItem_todo.graphql';
import changeTodoStatus from '../mutations/changeTodoStatus';
import removeTodo from '../mutations/removeTodo';

const fragmentNode = graphql`
    fragment todoListItem_todo on Todo {
        complete
        id
        text
    }
`;

const fragmentNodeUser = graphql`
    fragment todoListItem_user on User {
        id
        userId
        totalCount
        completedCount
    }
`;

@Component({
    selector: 'app-todo-list-item',
    templateUrl: './todo-list-item.component.html',
    styleUrls: ['./todo-list-item.component.css'],
})
export class TodoListItemComponent {
    @Input()
    fragmentRef: todoListItem_todo$key;

    @Input()
    fragmentRefUser;

    @Fragment<todoListItem_todo$key>(function () {
        return {
            fragmentNode,
            fragmentRef: this.fragmentRef,
        };
    })
    todo: todoListItem_todo$data;

    @Fragment(function () {
        return {
            fragmentNode: fragmentNodeUser,
            fragmentRef: this.fragmentRefUser,
        };
    })
    user;

    toggleTodoComplete() {
        changeTodoStatus.commit(!this.todo.complete, this.todo, this.user);
    }

    removeTodo(todo: any) {
        removeTodo.commit(todo, this.user);
    }
}
