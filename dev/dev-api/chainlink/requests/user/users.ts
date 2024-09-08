import { defineRequest } from "@chainlink-io/chainlink";

const defaultMethod = "GET"

export default defineRequest({
  method: defaultMethod,
  url: `${ cl.schema.parse({}) }}/users`,
  expectedResponse: baseApiResponse(z.array(z.string()))
});

const a = cl.schema.parse({})
