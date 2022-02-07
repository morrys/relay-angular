/**
 * @generated SignedSource<<a2f2e0180f18ebb1899de82f142d6f41>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type todoApp_user$data = {
  readonly id: string;
  readonly userId: string;
  readonly totalCount: number;
  readonly " $fragmentSpreads": FragmentRefs<"todoListFooter_user" | "todoList_user">;
  readonly " $fragmentType": "todoApp_user";
};
export type todoApp_user = todoApp_user$data;
export type todoApp_user$key = {
  readonly " $data"?: todoApp_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"todoApp_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "todoApp_user",
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "todoListFooter_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "todoList_user"
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "e98790ba10cece45234c522427451176";

export default node;
