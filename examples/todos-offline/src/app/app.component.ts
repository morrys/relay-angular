import { Component } from '@angular/core';
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
        this.user = user;
    }

    handleRightEnv() {
        this.environmentContext.next(EnvironmentRight);
    }

    handleWrongEnv() {
        this.environmentContext.next(EnvironmentError);
    }
}
