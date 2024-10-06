import { defineRequest } from "@chainlink-io/chainlink";

const url = `${cl.globals.BASE_URL}/users`;

const config = defineRequest({
  url,
  method: "POST",
  queryParams: [
    { enabled: true, key: "Authentication", value: "Bearer 12345" },
  ],
});

export default config;
