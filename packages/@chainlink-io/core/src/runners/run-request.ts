import { ChainlinkRequestDefinition } from "@/request-def";

const validProtocols = ["http:", "https:"];

export async function runRequest(
  requestDef: ChainlinkRequestDefinition,
): Promise<Response> {
  return new Promise(async (resolve) => {
    const url = new URL(requestDef.url);

    const isValidProtocol = validProtocols.includes(url.protocol);

    if (!isValidProtocol) {
      throw new Error(
        `'${url.protocol}' is not a supported protocol. Chainlink supports: ${validProtocols.join(", ")}`,
      );
    }

    const requestHeaders = requestDef.queryParams.reduce<Headers>(
      (acc, cur) => {
        if (!cur.enabled) return acc;

        acc.set(cur.key, cur.value)

        return acc;
      },
      new Headers(),
    );


    const res = await fetch(url.toString(), {
      method: requestDef.method,
      headers: requestHeaders,
    })

    resolve(res)
  });
}
