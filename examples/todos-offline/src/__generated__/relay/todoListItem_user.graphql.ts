/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type todoListItem_user = {
    readonly id: string;
    readonly userId: string;
    readonly totalCount: number;
    readonly completedCount: number;
    readonly " $refType": "todoListItem_user";
};
export type todoListItem_user$data = todoListItem_user;
export type todoListItem_user$key = {
    readonly " $data"?: todoListItem_user$data;
    readonly " $fragmentRefs": FragmentRefs<"todoListItem_user">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "todoListItem_user",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "completedCount",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '8af439a442782af068be8e7a5605e081';
export default node;
