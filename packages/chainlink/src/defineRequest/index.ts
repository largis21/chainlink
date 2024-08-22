// Todo move this to @chainlink/core

/**
 * @public
 */
export type RequestTemplateV0_1 = {
  meta: {
    templateVersion: "v0.1";
    name: string;
  };

  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  payload?: any; // TODO: What is the type of payload, can arraybuffers be used in http for example?
  headers?: Record<string, string>;
  locals?: Record<string, string>;
};

/**
 * @public
 */
export function defineRequest(def: RequestTemplateV0_1) {
  return def;
}
