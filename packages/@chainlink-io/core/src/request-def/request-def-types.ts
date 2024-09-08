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

