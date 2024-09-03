/**
 * @public
 */
export type ChainlinkRequestTemplate = {
  meta: {
    // @TODO: How should versioning work??
    templateVersion: "v0.1";
    name: string;
  };
  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  queryParams: { enabled: boolean; key: string; value: string }[];
  payload?: any;
  headers?: Record<string, string>;
  locals?: Record<string, string>;
};

/**
 * @public
 */
export function defineRequest(def: ChainlinkRequestTemplate) {
  return def;
}
