import { defineRequest } from "@chainlink-io/chainlink";

type Test = 'hello';
const url = 'URLURLURL';

const config = defineRequest({
  method: "GET",
  url,
})

export default config
