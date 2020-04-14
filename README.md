# [@relay-angular](https://github.com/morrys/relay-angular)

Relay for Angular 

## Contributing

* **Give a star** to the repository and **share it**, you will **help** the **project** and the **people** who will find it useful

* **Create issues**, your **questions** are a **valuable help**

* **PRs are welcome**, but it is always **better to open the issue first** so as to **help** me and other people **evaluating it**

* **Please sponsor me**

## Installation

Install relay-angular using yarn or npm:

```
yarn add relay-angular relay-runtime
```

Install relay-angular-plugin & relay-compiler using yarn or npm:

```
yarn add relay-angular-plugin ngx-build-plus relay-compiler relay-config
```

## Configuration

### relay

configuration file:

```js
// relay.config.js
module.exports = {
    // ...
    // Configuration options accepted by the `relay-compiler` command-line tool,  `babel-plugin-relay` and `relay-angular-plugin`.
    src: './src',
    schema: '../server/data/schema.graphql',
    language: 'typescript',
    artifactDirectory: './src/__generated__/relay/',
};
```

### ngx-build-plus

[see ngx-build-plus getting started](https://github.com/manfredsteyer/ngx-build-plus#getting-started)

* angular.json

Change the builder to serve and build

```
"build": {
  "builder": "ngx-build-plus:browser",
  ...
}
"serve": {
  "builder": "ngx-build-plus:dev-server",
   ...
}
```

### package.json

```
"scripts": {
    ...
    "build": "ng build --plugin relay-angular-plugin",
    "start": "ng serve --plugin relay-angular-plugin",
    "compile": "relay-compiler"
    ...
}    
```
## RelayProvider

```ts
import { RelayProvider } from 'relay-angular';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

async function fetchQuery(operation, variables, cacheConfig, uploadables) {
    const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: operation.text,
            variables,
        }),
    });

    return response.json();
}

const modernEnvironment: Environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
});

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
  ],
  providers: [[RelayProvider(modernEnvironment)]],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## EnvironmentContext

use this for change environment

```ts
import { Component } from '@angular/core';
import { EnvironmentContext } from 'relay-angular';
import EnvironmentError from '../relay/errorRelay';
import EnvironmentRight from '../relay/relay';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent 
    constructor(private environmentContext: EnvironmentContext) {}

    handle click button
    handleRightEnv() {
        this.environmentContext.next(EnvironmentRight);
    }

    handle click button
    handleWrongEnv() {
        this.environmentContext.next(EnvironmentError);
    }
}
```

## @Query

```ts
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
```
```html
 <todo-app *ngIf="result && result.props && result.props.user; else loading"
  [fragmentRef]="result.props.user">
  {{result}}
 </todo-app>
 <ng-template #loading>
    <div *ngIf="!result.error; else error">
      Loading...</div>
 </ng-template>
 <ng-template #error>
    <div>
      Error {{ result.error }}
    </div>
 </ng-template>
```

## @Fragment

```ts
import { Component, Input } from '@angular/core';
import { Fragment } from 'relay-angular';
import { graphql } from 'relay-runtime';
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
}
```

## @Refetch

```ts
import { Component, Input } from '@angular/core';
import { Refetch, RefetchDecorator } from 'relay-angular';
import { graphql } from 'relay-runtime';
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

    // handle button click
    handleRefresh() {
        const { refetch, userId } = this.data;
        refetch(QueryApp, {
            userId,
        });
    }
}
```

```html
<footer class="footer">
  <span class="todo-count"><strong>{{data.totalCount - data.completedCount}}</strong> {{data.totalCount - data.completedCount == 1 ? 'item' : 'items'}} left</span>
  <button 
          class="clear-completed"
          (click)="handleRefresh($event)">
          Refresh
  </button>
</footer>
```

## @Pagination

```ts
import { Component, Input } from '@angular/core';
import { Pagination, PaginationDecorator } from 'relay-angular';
import { graphql } from 'relay-runtime';
import { todoListFooter_user$data } from '../../__generated__/relay/todoListFooter_user.graphql';
import { QueryApp } from '../todo-query/todo-query.component';

const fragmentSpec = graphql`
  fragment todoListFooter_user on User {
    id
    idUser
    todos(idUser: $idUser, first: $first, after: $after)
      @connection(key: "TodoList_todos", filters: ["idUser"]) {
      nextToken
      edges {
         node {
             id
             complete
         }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const connectionConfig = {
  query: QueryApp,
  getVariables: (props, paginationInfo) => ({
    first: 2,
    after: paginationInfo.cursor,
    idUser: props.idUser
  })
};

@Component({
    selector: 'app-todo-list-footer',
    templateUrl: './todo-list-footer.component.html',
    styleUrls: ['./todo-list-footer.component.css'],
})
export class TodoListFooterComponent {
    @Input()
    fragmentRef: any;

    @Pagination((_this) => ({
        fragmentNode,
        fragmentRef: _this.fragmentRef,
    }))
    data: PaginationDecorator<todoListFooter_user$data>;

    // handle button click
    handleLoadMore() {
        const { hasMore, isLoading, loadMore } = this.data;
        hasMore() && !isLoading() && loadMore(connectionConfig, 2, () => null, undefined)
    }
}
```

## @RelayEnvironment

```ts
import { Component } from '@angular/core';
import { RelayEnvironment } from 'relay-angular';
import { graphql, Environment } from 'relay-runtime';
@Component({
    selector: 'todo-app',
    templateUrl: './todo-app.component.html',
    styleUrls: ['./todo-app.component.css'],
})
export class TodoAppComponent {

    @RelayEnvironment()
    environment: Environment;
}
```

## mutate


create mutation

```ts changeTodoStatusMutation.ts
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
    });
}

export default { commit };
```

use it

```
import { Component } from '@angular/core';
import changeTodoStatus from '../mutations/changeTodoStatus';

@Component({
    selector: 'app-todo-list-item',
    templateUrl: './todo-list-item.component.html',
    styleUrls: ['./todo-list-item.component.css'],
})
export class TodoListItemComponent {

    // handle button
    toggleTodoComplete(todo, user) {
        changeTodoStatus.commit(!todo.complete, todo, user);
    }
}
```

