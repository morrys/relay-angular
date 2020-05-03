import { Component, Input } from '@angular/core';
import { graphql } from 'relay-runtime';
import { Query } from 'relay-angular';
import { todoQueryQuery } from '../../__generated__/relay/todoQueryQuery.graphql';

export const QueryApp = graphql`
    query todoQueryQuery($userId: String) {
        user(id: $userId) {
            id
            ...todoApp_user
        }
    }
`;

@Component({
    selector: 'todo-query',
    templateUrl: './todo-query.component.html',
    styleUrls: ['./todo-query.component.css'],
})
export class TodoQueryComponent {
    @Input()
    userId;

    @Query<todoQueryQuery>(function() {
        return {
            query: QueryApp,
            variables: { userId: this.userId },
        };
    })
    result;
}
