/**
 * @generated SignedSource<<a54b461f4fdaf3ca8a32d3b9d7b4c688>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type todoListItem_user$data = {
  readonly id: string;
  readonly userId: string;
  readonly totalCount: number;
  readonly completedCount: number;
  readonly " $fragmentType": "todoListItem_user";
};
export type todoListItem_user = todoListItem_user$data;
export type todoListItem_user$key = {
  readonly " $data"?: todoListItem_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"todoListItem_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "todoListItem_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "userId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "completedCount",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "8af439a442782af068be8e7a5605e081";

export default node;
