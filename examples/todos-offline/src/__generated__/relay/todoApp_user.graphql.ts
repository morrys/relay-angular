/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type todoApp_user = {
    readonly id: string;
    readonly userId: string;
    readonly totalCount: number;
    readonly " $fragmentRefs": FragmentRefs<"todoListFooter_user" | "todoList_user">;
    readonly " $refType": "todoApp_user";
};
export type todoApp_user$data = todoApp_user;
export type todoApp_user$key = {
    readonly " $data"?: todoApp_user$data;
    readonly " $fragmentRefs": FragmentRefs<"todoApp_user">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "todoApp_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "userId",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "totalCount",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "todoListFooter_user",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "todoList_user",
      "args": null
    }
  ]
};
(node as any).hash = 'e98790ba10cece45234c522427451176';
export default node;
