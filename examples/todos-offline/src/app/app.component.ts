import { Component } from '@angular/core';
import { EnvironmentContext, Restore } from 'relay-angular';
import environmentLocal from '../relay/localStorageRelay';
import environmentIDX from '../relay/relay';

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
        this.environmentContext.next(environmentIDX);
    }

    handleWrongEnv() {
        this.environmentContext.next(environmentLocal);
    }
}
