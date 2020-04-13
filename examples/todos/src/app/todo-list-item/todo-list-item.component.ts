import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Fragment } from 'relay-angular';
import { graphql } from 'relay-runtime';
import { Todo } from '../todo';
import { todoListItem_todo$key, todoListItem_todo$data } from '../../__generated__/relay/todoListItem_todo.graphql';

const fragmentNode = graphql`
    fragment todoListItem_todo on Todo {
        complete
        id
        text
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

    @Fragment<todoListItem_todo$key>(function() {
        return {
            fragmentNode,
            fragmentRef: this.fragmentRef,
        };
    })
    todo: todoListItem_todo$data;

    @Output()
    remove: EventEmitter<Todo> = new EventEmitter();

    @Output()
    toggleComplete: EventEmitter<Todo> = new EventEmitter();

    toggleTodoComplete(todo: Todo) {
        this.toggleComplete.emit(todo);
    }

    removeTodo(todo: Todo) {
        this.remove.emit(todo);
    }
}
