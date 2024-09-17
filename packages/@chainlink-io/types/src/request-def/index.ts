import { z } from "zod";

/**
 * @public
 */
export type ChainlinkRequestDefinition = {
  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | string;
  queryParams: { enabled: boolean; key: string; value: string }[];
  // test?: {
  //   expectedResponse: z.ZodSchema
  // }
  // payload?: any;
  // headers?: Record<string, string>;
  // locals?: Record<string, string>;
  //meta?: {};
};

export const requiredChainlinkRequestDefinitionProperties = [
  "url",
  "method",
] as const satisfies (keyof ChainlinkRequestDefinition)[];

type RequiredChainlinkRequestDefinitionProperties =
  (typeof requiredChainlinkRequestDefinitionProperties)[number];

export type PartialChainlinkRequestDefinition =
  Partial<ChainlinkRequestDefinition> &
  Required<
    Pick<
      ChainlinkRequestDefinition,
      RequiredChainlinkRequestDefinitionProperties
    >
  >;

export const chainlinkRequestDefinitionSchema = z.object({
  url: z.string(),
  method: z.string(),
  queryParams: z.array(
    z.object({ enabled: z.boolean(), key: z.string(), value: z.string() }),
  ),
});

const _satisfiesRequestDefSchema: ChainlinkRequestDefinition extends z.infer<
  typeof chainlinkRequestDefinitionSchema
>
  ? true
  : false = true;

const _satisfiesChainlinkConfig: z.infer<
  typeof chainlinkRequestDefinitionSchema
> extends ChainlinkRequestDefinition
  ? true
  : false = true;
