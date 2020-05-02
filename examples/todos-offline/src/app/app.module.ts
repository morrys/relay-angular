import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TodoAppComponent } from './todo-app/todo-app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoListFooterComponent } from './todo-list-footer/todo-list-footer.component';
import { TodoListHeaderComponent } from './todo-list-header/todo-list-header.component';
import { TodoListItemComponent } from './todo-list-item/todo-list-item.component';

import RelayModernEnvironment from '../relay/relay';
import { RelayProvider } from 'relay-angular';
import { TodoQueryComponent } from './todo-query/todo-query.component';

@NgModule({
    declarations: [
        AppComponent,
        TodoAppComponent,
        TodoQueryComponent,
        TodoListComponent,
        TodoListFooterComponent,
        TodoListHeaderComponent,
        TodoListItemComponent,
    ],
    imports: [BrowserModule, FormsModule],
    providers: [[RelayProvider(RelayModernEnvironment)]],
    bootstrap: [AppComponent],
})
export class AppModule {}
