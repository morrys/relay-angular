# offline first application - wora/relay-offline

## Installation

Install @wora/relay-offline & @wora/relay-store using yarn or npm:

```
yarn add @wora/relay-offline @wora/relay-store
```

## Configuration

### RelayProvider with Environment localStorage

```ts
import { Network } from "relay-runtime";
import { Environment } from '@wora/relay-offline';
import { Store, RecordSource } from '@wora/relay-store';

const network = Network.create(fetchQuery);
const recordSource = new RecordSource();
const store = new Store(recordSource);
const environment = new Environment({ network, store });
@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
  ],
  providers: [[RelayProvider(environment)]],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

### RelayProvider with Environment IndexedDB

localStorage is used as the default react web persistence.

To use persistence via IndexedDB:

```ts
import { Network } from "relay-runtime";

import EnvironmentIDB from '@wora/relay-offline/lib/EnvironmentIDB';

const network = Network.create(fetchQuery);
const environment = EnvironmentIDB.create({
    network,
});
```

### @Restore

the **@Restore** decorator allows you to manage the restore of data persisted in the storage.

```ts
import { Component } from '@angular/core';
import { Restore } from 'relay-angular';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {

    @Restore()
    rehydrated: boolean;
}
```

```html
<section>
  <todo-query [userId]="user" *ngIf="rehydrated; else loading">
  </todo-query>
</section>
<ng-template #loading>
  <div>Loading...</div>
 </ng-template>
```

## Extra Configuration

### Environment with Offline Options

```ts
import { Network } from "relay-runtime";
import { Environment } from '@wora/relay-offline';
import { Store, RecordSource } from '@wora/relay-store';

const network = Network.create(fetchQuery);

const networkOffline = Network.create(fetchQueryOffline);
const manualExecution = false;

const recordSource = new RecordSource();
const store = new Store(recordSource);
const environment = new Environment({ network, store });
environment.setOfflineOptions({
  manualExecution, //optional
  network: networkOffline, //optional
  start: async mutations => {
    //optional
    console.log("start offline", mutations);
    return mutations;
  },
  finish: async (mutations, error) => {
    //optional
    console.log("finish offline", error, mutations);
  },
  onExecute: async mutation => {
    //optional
    console.log("onExecute offline", mutation);
    return mutation;
  },
  onComplete: async options => {
    //optional
    console.log("onComplete offline", options);
    return true;
  },
  onDiscard: async options => {
    //optional
    console.log("onDiscard offline", options);
    return true;
  },
  onPublish: async offlinePayload => {
    //optional
    console.log("offlinePayload", offlinePayload);
    return offlinePayload;
  }
});

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
  ],
  providers: [[RelayProvider(environment)]],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

- manualExecution: if set to true, mutations in the queue are no longer performed automatically as soon as you go back online. invoke manually: `environment.getStoreOffline().execute();`

- network: it is possible to configure a different network for the execution of mutations in the queue; all the information of the mutation saved in the offline store are inserted into the "metadata" field of the CacheConfig so that they can be used during communication with the server.

* start: function that is called once the request queue has been started.

* finish: function that is called once the request queue has been processed.

* onExecute: function that is called before the request is sent to the network.

* onPublish: function that is called before saving the mutation in the store

* onComplete: function that is called once the request has been successfully completed. Only if the function returns the value true, the request is deleted from the queue.

* onDiscard: function that is called when the request returns an error. Only if the function returns the value true, the mutation is deleted from the queue



### Environment with PersistOfflineOptions

```ts
import { Network } from "relay-runtime";
import { RecordSource, Store, Environment } from "react-relay-offline";
import { CacheOptions } from "@wora/cache-persist";

const network = Network.create(fetchQuery);

const networkOffline = Network.create(fetchQueryOffline);

const persistOfflineOptions: CacheOptions = {
  prefix: "app-user1"
};
const recordSource = new RecordSource();
const store = new Store(recordSource);
const environment = new Environment({ network, store }, persistOfflineOptions);
```

[CacheOptions](https://morrys.github.io/wora/docs/cache-persist.html#cache-options)

### Store with custom options

```ts
import { Store } from "react-relay-offline";
import { CacheOptions } from "@wora/cache-persist";
import { CacheOptionsStore } from "@wora/relay-store";

const persistOptionsStore: CacheOptionsStore = { defaultTTL: 10 * 60 * 1000 }; // default
const persistOptionsRecords: CacheOptions = {}; // default
const recordSource = new RecordSource(persistOptionsRecords);
const store = new Store(recordSource, persistOptionsStore);
const environment = new Environment({ network, store });
```