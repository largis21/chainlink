/**
 * @public
 */
export type ChainlinkRequestDefinition = {
  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | string;
  queryParams: { enabled: boolean; key: string; value: string }[];
  extends: ChainlinkRequestDefinition | null;
  // test?: {
  //   expectedResponse: z.ZodSchema
  // }
  // payload?: any;
  // headers?: Record<string, string>;
  // locals?: Record<string, string>;
  //meta?: {};
};

export const defaultChainlinkRequestDefinition: ChainlinkRequestDefinition = {
  url: "", // *
  method: "", // *
  queryParams: [],
  extends: null,
} as const;
// * = Is reqired in ChainlinkRequestDefinition, their value here is not important because it will
// be overriden anyway

const RequiredChainlinkRequestDefinitionProperties = [
  "url",
  "method",
] as const satisfies (keyof ChainlinkRequestDefinition)[];

type RequiredChainlinkRequestDefinitionProperties =
  (typeof RequiredChainlinkRequestDefinitionProperties)[number];

export type PartialChainlinkRequestDefinition =
  Partial<ChainlinkRequestDefinition> &
    Required<
      Pick<
        ChainlinkRequestDefinition,
        RequiredChainlinkRequestDefinitionProperties
      >
    >;

/**
 * @public
 */
export function defineRequest(def: PartialChainlinkRequestDefinition) {
  return def;
}
