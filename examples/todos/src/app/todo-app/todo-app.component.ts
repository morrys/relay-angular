import { Component, SimpleChanges, Input } from '@angular/core';
import { Fragment, RelayEnvironment } from 'relay-angular';
import { graphql, Environment } from 'relay-runtime';
import AddTodoMutation from '../mutations/addTodo';

const fragmentNode = graphql`
    fragment todoApp_user on User {
        id
        userId
        totalCount
        ...todoListFooter_user
        ...todoList_user
    }
`;

@Component({
    selector: 'todo-app',
    templateUrl: './todo-app.component.html',
    styleUrls: ['./todo-app.component.css'],
})
export class TodoAppComponent {
    @Input()
    fragmentRef: any;

    @Fragment((_this) => ({
        fragmentNode,
        fragmentRef: _this.fragmentRef,
    }))
    user;

    @RelayEnvironment()
    environment: Environment;

    onAddTodo(todo) {
        AddTodoMutation.commit(todo.text, this.user);
    }
}
