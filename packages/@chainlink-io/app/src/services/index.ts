import { z } from "zod";
import { getRequestsDir } from "./fs/get-request-dir";
import { WebSocket as NodeWebSocket } from "ws"

export type WSIOSchemas = {
  input: z.Schema;
  output: z.Schema;
};

export type WSServiceRunner<
  S extends WSIOSchemas = {
    input: z.ZodUndefined;
    output: z.ZodUndefined;
  },
> = (data: z.infer<S["input"]>, ws: NodeWebSocket) => void;

export type WSService<CS extends WSIOSchemas> = {
  /**
   * The function that will be ran on the server when the service is called from the client
   */
  run: WSServiceRunner<CS>;
  /**
   * Input needed for the runner when the service is called from the client
   */
  input: CS["input"];
  /**
   * What the service will send to the client
   *
   * @NOTE The server can either call the service as a result of the client asking for something
   * or on any other events, like FS changes
   */
  output: CS["output"];
};

export const wsServices = {
  ["fs.getRequestsDir"]: getRequestsDir,
} as const;

export const serviceMessageSchemaFromServer = z.object({
  service: z.string(),
  output: z.unknown(),
});

/**
 * Helper function to call services with typesafety
 */
export async function callServiceFromServer<N extends keyof typeof wsServices>(
  name: N,
  output: z.infer<(typeof wsServices)[N]["output"]>,
  ws: NodeWebSocket
) {
  ws.send(
    JSON.stringify({
      service: name,
      output: output,
    } satisfies z.infer<typeof serviceMessageSchemaFromServer>),
  );
}

export const serviceMessageSchemaFromClient = z.object({
  service: z.string(),
  input: z.any(),
});

/**
 * Helper function to call services with typesafety
 */
export async function callServiceFromClient<N extends keyof typeof wsServices>(
  name: N,
  input: z.infer<(typeof wsServices)[N]["input"]>,
  ws: WebSocket
) {
  ws.send(
    JSON.stringify({
      service: name,
      input: input,
    } satisfies z.infer<typeof serviceMessageSchemaFromClient>),
  );
}

export function handleMessageFromClient(
  message: string,
  ws: NodeWebSocket
) {
  let jsonData;
  try {
    jsonData = JSON.parse(message)
  } catch {
    console.error("Recieved invalid json")
    return
  }

  const data = serviceMessageSchemaFromClient.safeParse(jsonData);
  if (!data.success) {
    console.error("Recieved invalid message");
    return;
  }

  const serviceMessage = data.data;

  if (!Object.keys(wsServices).includes(serviceMessage.service)) {
    console.error(`Invalid service: '${serviceMessage.service}'`);
    return;
  }

  const serviceToRun =
    wsServices[serviceMessage.service as keyof typeof wsServices];

  if (!serviceToRun) {
    // This shouldn't happen but handle it just in case
    console.error(`Invalid service: '${serviceMessage.service}'`);
    return;
  }

  const validInput = serviceToRun.input.safeParse(serviceMessage.input);
  if (!validInput.success) {
    console.error(`Invalid input to service: '${serviceMessage.service}'`);
    return;
  }

  serviceToRun.run(validInput.data, ws);
}
