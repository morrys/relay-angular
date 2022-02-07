/**
 * @generated SignedSource<<21946528cd86701201badf153c5be0d1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type todoListItem_todo$data = {
  readonly complete: boolean;
  readonly id: string;
  readonly text: string;
  readonly " $fragmentType": "todoListItem_todo";
};
export type todoListItem_todo = todoListItem_todo$data;
export type todoListItem_todo$key = {
  readonly " $data"?: todoListItem_todo$data;
  readonly " $fragmentSpreads": FragmentRefs<"todoListItem_todo">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "todoListItem_todo",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "complete",
      "storageKey": null
    },
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
      "name": "text",
      "storageKey": null
    }
  ],
  "type": "Todo",
  "abstractKey": null
};

(node as any).hash = "e72674c747efa2397f6915e4d1ed05a3";

export default node;
