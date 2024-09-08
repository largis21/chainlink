import http, { OutgoingHttpHeaders } from "node:http";
import { ChainlinkRequestDefinition } from "../define/define-request";

const validProtocols = ["http", "https"];

export function runRequest(requestDef: ChainlinkRequestDefinition) {
  const url = new URL(requestDef.url);

  const isValidProtocol = validProtocols.includes(url.protocol);

  if (!isValidProtocol) {
    throw new Error(
      `'${url.protocol}' is not a supported protocol. Chainlink supports: ${validProtocols.join(", ")}`,
    );
  }

  const requestHeaders = requestDef.queryParams.reduce<OutgoingHttpHeaders>(
    (acc, cur) => {
      if (!cur.enabled) return acc;

      acc[cur.key] = cur.value;

      return acc
    },
    {},
  );

  const request = http.request({
    hostname: url.hostname,
    port: url.port,
    protocol: url.protocol,
    path: url.pathname,
    method: requestDef.method,
    headers: requestHeaders,
  }, (res) => {
    let data = ''
 
    res.on('data', (chunk) => {
        data += chunk;
    });
 
    // Ending the response 
    res.on('end', () => {
        console.log('Body:', JSON.parse(data))
    })
  })
}
