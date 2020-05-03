/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type todoListItem_todo = {
    readonly complete: boolean;
    readonly id: string;
    readonly text: string;
    readonly " $refType": "todoListItem_todo";
};
export type todoListItem_todo$data = todoListItem_todo;
export type todoListItem_todo$key = {
    readonly " $data"?: todoListItem_todo$data;
    readonly " $fragmentRefs": FragmentRefs<"todoListItem_todo">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "todoListItem_todo",
  "type": "Todo",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "complete",
      "args": null,
      "storageKey": null
    },
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
      "name": "text",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'e72674c747efa2397f6915e4d1ed05a3';
export default node;
