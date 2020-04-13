import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { EnvironmentContext } from 'relay-angular';
import EnvironmentError from '../relay/errorRelay';
import EnvironmentRight from '../relay/relay';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    user = 'me';

    constructor(private environmentContext: EnvironmentContext) {}

    onChangeUser(user) {
        console.log('user', user);
        this.user = user;
    }

    handleRightEnv() {
        this.environmentContext.next(EnvironmentRight);
        console.log('this environmentContex', this.environmentContext);
    }

    handleWrongEnv() {
        this.environmentContext.next(EnvironmentError);
        console.log('this environmentContex', this.environmentContext);
    }
}
