import { defineRequest } from "@chainlink-io/chainlink";

const defaultMethod = "GET"

export default defineRequest({
  method: defaultMethod,
  url: `${ cl.globals.BASE_URL }/users`,
});
