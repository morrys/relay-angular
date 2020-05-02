import { Component } from '@angular/core';
import { EnvironmentContext, Restore } from 'relay-angular';
import EnvironmentError from '../relay/localStorageRelay';
import EnvironmentRight from '../relay/relay';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    user = 'me';

    @Restore()
    rehydrated: boolean;

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
