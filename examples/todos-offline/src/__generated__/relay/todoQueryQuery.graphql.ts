/* tslint:disable */
/* @relayHash 499c8a34e3bca9935b9d5147531ec0f6 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type todoQueryQueryVariables = {
    userId?: string | null;
};
export type todoQueryQueryResponse = {
    readonly user: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"todoApp_user">;
    } | null;
};
export type todoQueryQuery = {
    readonly response: todoQueryQueryResponse;
    readonly variables: todoQueryQueryVariables;
};



/*
query todoQueryQuery(
  $userId: String
) {
  user(id: $userId) {
    id
    ...todoApp_user
  }
}

fragment todoApp_user on User {
  id
  userId
  totalCount
  ...todoListFooter_user
  ...todoList_user
}

fragment todoListFooter_user on User {
  id
  userId
  completedCount
  todos(first: 2147483647) {
    edges {
      node {
        id
        complete
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
  totalCount
}

fragment todoListItem_todo on Todo {
  complete
  id
  text
}

fragment todoListItem_user on User {
  id
  userId
  totalCount
  completedCount
}

fragment todoList_user on User {
  id
  userId
  totalCount
  completedCount
  ...todoListItem_user
  todos(first: 2147483647) {
    edges {
      node {
        id
        complete
        ...todoListItem_todo
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "userId",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "userId"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 2147483647
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "todoQueryQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "user",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "FragmentSpread",
            "name": "todoApp_user",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "todoQueryQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "user",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "todos",
            "storageKey": "todos(first:2147483647)",
            "args": (v3/*: any*/),
            "concreteType": "TodoConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "TodoEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Todo",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
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
                        "name": "__typename",
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
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "todos",
            "args": (v3/*: any*/),
            "handle": "connection",
            "key": "TodoList_todos",
            "filters": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "todoQueryQuery",
    "id": null,
    "text": "query todoQueryQuery(\n  $userId: String\n) {\n  user(id: $userId) {\n    id\n    ...todoApp_user\n  }\n}\n\nfragment todoApp_user on User {\n  id\n  userId\n  totalCount\n  ...todoListFooter_user\n  ...todoList_user\n}\n\nfragment todoListFooter_user on User {\n  id\n  userId\n  completedCount\n  todos(first: 2147483647) {\n    edges {\n      node {\n        id\n        complete\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  totalCount\n}\n\nfragment todoListItem_todo on Todo {\n  complete\n  id\n  text\n}\n\nfragment todoListItem_user on User {\n  id\n  userId\n  totalCount\n  completedCount\n}\n\nfragment todoList_user on User {\n  id\n  userId\n  totalCount\n  completedCount\n  ...todoListItem_user\n  todos(first: 2147483647) {\n    edges {\n      node {\n        id\n        complete\n        ...todoListItem_todo\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '17b7af5d8db70d9d3832e4e2e607579d';
export default node;
