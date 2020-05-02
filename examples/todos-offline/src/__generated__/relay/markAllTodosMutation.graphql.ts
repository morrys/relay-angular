/* tslint:disable */
/* @relayHash 9c74fb2733c13536e20318a4b10add55 */

import { ConcreteRequest } from "relay-runtime";
export type MarkAllTodosInput = {
    readonly complete: boolean;
    readonly userId: string;
    readonly clientMutationId?: string | null;
};
export type markAllTodosMutationVariables = {
    input: MarkAllTodosInput;
};
export type markAllTodosMutationResponse = {
    readonly markAllTodos: {
        readonly changedTodos: ReadonlyArray<{
            readonly id: string;
            readonly complete: boolean;
        }> | null;
        readonly user: {
            readonly id: string;
            readonly completedCount: number;
        };
    } | null;
};
export type markAllTodosMutation = {
    readonly response: markAllTodosMutationResponse;
    readonly variables: markAllTodosMutationVariables;
};



/*
mutation markAllTodosMutation(
  $input: MarkAllTodosInput!
) {
  markAllTodos(input: $input) {
    changedTodos {
      id
      complete
    }
    user {
      id
      completedCount
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "MarkAllTodosInput!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "markAllTodos",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "MarkAllTodosPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "changedTodos",
        "storageKey": null,
        "args": null,
        "concreteType": "Todo",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "complete",
            "args": null,
            "storageKey": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "user",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "completedCount",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "markAllTodosMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v2/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "markAllTodosMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v2/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "markAllTodosMutation",
    "id": null,
    "text": "mutation markAllTodosMutation(\n  $input: MarkAllTodosInput!\n) {\n  markAllTodos(input: $input) {\n    changedTodos {\n      id\n      complete\n    }\n    user {\n      id\n      completedCount\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '5388409150f4a084ce923ec53d33e56d';
export default node;
