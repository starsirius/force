/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairSubApp_QueryVariables = {
    slug: string;
};
export type FairSubApp_QueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"FairSubApp_fair">;
    } | null;
};
export type FairSubApp_QueryRawResponse = {
    readonly fair: ({
        readonly id: string;
        readonly name: string | null;
        readonly slug: string;
    }) | null;
};
export type FairSubApp_Query = {
    readonly response: FairSubApp_QueryResponse;
    readonly variables: FairSubApp_QueryVariables;
    readonly rawResponse: FairSubApp_QueryRawResponse;
};



/*
query FairSubApp_Query(
  $slug: String!
) {
  fair(id: $slug) {
    ...FairSubApp_fair
    id
  }
}

fragment FairSubApp_fair on Fair {
  id
  name
  slug
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug",
    "type": "String!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "slug"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FairSubApp_Query",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FairSubApp_fair"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FairSubApp_Query",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
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
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "FairSubApp_Query",
    "operationKind": "query",
    "text": "query FairSubApp_Query(\n  $slug: String!\n) {\n  fair(id: $slug) {\n    ...FairSubApp_fair\n    id\n  }\n}\n\nfragment FairSubApp_fair on Fair {\n  id\n  name\n  slug\n}\n"
  }
};
})();
(node as any).hash = '4103242ad007a31de6d4f07f3666d749';
export default node;
