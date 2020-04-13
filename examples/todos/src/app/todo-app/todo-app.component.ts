import { Component, SimpleChanges, Input } from '@angular/core';
import { Fragment, RelayEnvironment } from 'relay-angular';
import { graphql, Environment } from 'relay-runtime';
import AddTodoMutation from '../mutations/addTodo';
import changeTodoStatus from '../mutations/changeTodoStatus';
import removeTodo from '../mutations/removeTodo';

//import { Fragment } from 'relay-angular';

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

    public ngOnInit() {
        console.log('init', this);
    }

    public ngOnChanges(changes: SimpleChanges) {
        console.log('change', changes);
    }

    onChangeUser(userId) {
        console.log('userghgh', userId);
    }

    onAddTodo(todo) {
        console.log('todo', todo);
        AddTodoMutation.commit(todo.text, this.user);
    }

    onToggleTodoComplete(todo) {
        changeTodoStatus.commit(!todo.complete, todo, this.user);
    }

    onRemoveTodo(todo) {
        removeTodo.commit(todo, this.user);
    }
}
