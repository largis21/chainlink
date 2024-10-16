import { defineRequest } from "@chainlink-io/chainlink";

const url = `${cl.globals.BASE_URL}/users`;

// User opens request
// Sees the stringLiteral node in url field
// For query params: sees evaluated queryParams property
//
// For patching url:
// patch = {
//  path: "default.url",
//  nodes: ["TemplateLiteral", "StringLiteral"],
//  setNode: {
//    value: `${cl.globals.BASE_URL}/users`}
//  }
// }
//
// for patching queryParams:
// patch = {
//  path: "default.queryParams",
//  nodes: ["ArrayExpression"],
//  setNode: {
//    value: "[...cl.globals.BASE_QUERY_PARAMS, { enabled: true, key: 'test', value: 'test' }]"
//  }
// }
//
// for patching objects:
// b4: { key1: "hello", key2: "goodbye"}
//
// patch = {
//  path: "default.object",
//  nodes: ["ObjectExpression"],
//  setNode: {
//    path: "key1",
//    value: '`${cl.globals.BASE_URL}/test`'
//  }
//
//  after: { key1: `${cl.globals.BASE_URL}/test`, key2: "goodbye" }
// }

const queryParams = [
  ...cl.globals.BASE_QUERY_PARAMS,
  { enabled: true, key: "custom key", value: "balue" },
];

const config = defineRequest({
  url,
  method: "POST",
  queryParams,
});

export default config;
