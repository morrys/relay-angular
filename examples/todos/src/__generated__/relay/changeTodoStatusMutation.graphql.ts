/**
 * @generated SignedSource<<af2e9fbf5498b9c3b074b8b4831dc15c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ChangeTodoStatusInput = {
  complete: boolean;
  id: string;
  userId: string;
  clientMutationId?: string | null;
};
export type changeTodoStatusMutation$variables = {
  input: ChangeTodoStatusInput;
};
export type changeTodoStatusMutationVariables = changeTodoStatusMutation$variables;
export type changeTodoStatusMutation$data = {
  readonly changeTodoStatus: {
    readonly todo: {
      readonly id: string;
      readonly complete: boolean;
    };
    readonly user: {
      readonly id: string;
      readonly completedCount: number;
    };
  } | null;
};
export type changeTodoStatusMutationResponse = changeTodoStatusMutation$data;
export type changeTodoStatusMutation = {
  variables: changeTodoStatusMutationVariables;
  response: changeTodoStatusMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ChangeTodoStatusPayload",
    "kind": "LinkedField",
    "name": "changeTodoStatus",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Todo",
        "kind": "LinkedField",
        "name": "todo",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "complete",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "completedCount",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "changeTodoStatusMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "changeTodoStatusMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "7798f71856d12bf6b30a04a56ad1f1ee",
    "id": null,
    "metadata": {},
    "name": "changeTodoStatusMutation",
    "operationKind": "mutation",
    "text": "mutation changeTodoStatusMutation(\n  $input: ChangeTodoStatusInput!\n) {\n  changeTodoStatus(input: $input) {\n    todo {\n      id\n      complete\n    }\n    user {\n      id\n      completedCount\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1c617bd7d86cf92a811ec0ef42e1870b";

export default node;
