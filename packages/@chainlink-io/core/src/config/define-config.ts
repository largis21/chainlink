import path from "path";
import { z } from "zod";

export type ChainlinkConfig<TEnvSchema extends z.ZodSchema = z.ZodSchema> = {
  /**
   * Request- and Chain definitions will have access to a global context. This will be the name of
   * the global variable
   *
   * @example cl.globals.BASE_URL
   *
   * @default "cl"
   */
  chainlinkContextName: string;

  /**
   * Location of the chainlink root folder
   *
   * @default "./chainlink"
   */
  chainlinkRootDir: string;

  /**
   * Location of the chainlink `chains` folder, relative to `chainlinkRoot`
   *
   * @default "requests"
   */
  chainsDir: string;

  env: {
    /**
     * Location of .env file
     *
     * @default `path.resolve(process.env, ".env")` - Will be overriden if chainlink is started with
     * the config flag
     */
    file: string;

    /**
     * Required properties in env
     *
     * @example
     * ```ts
     * {
     *   schema: z.object({
     *     SECRET_KEY: z.string()
     *   })
     * }
     * ```
     */
    schema: TEnvSchema;
  };
  /*
   * Globals
   */
  globals: Record<string, string>;

  /**
   * Location of the chainlink `requests` folder, relative to `chainlinkRoot`
   *
   * @default "requests"
   */
  requestsDir: string;

  server: {
    /**
     * Which port should the server run on
     *
     * @default 4202
     */
    port: number;
  };
};

export const defaultConfig: ChainlinkConfig = {
  chainlinkContextName: "cl",
  chainlinkRootDir: path.resolve(process.cwd(), "chainlink"),
  chainsDir: "chains",
  env: {
    file: path.resolve(process.cwd(), ".env"),
    schema: z.object({}),
  },
  globals: {},
  requestsDir: "requests",
  server: {
    port: 4202,
  },
} as const;

type PartialChainlinkConfig<TEnvSchema extends z.ZodSchema = z.ZodSchema> = {
  [P in keyof ChainlinkConfig<TEnvSchema>]?: Partial<
    ChainlinkConfig<TEnvSchema>[P]
  >;
};

export function defineConfig<TEnvSchema extends z.ZodSchema>(
  config: PartialChainlinkConfig<TEnvSchema>,
) {
  return config;
}

export type ClDeclareGlobal<T extends PartialChainlinkConfig> = {
  globals: T["globals"];
  env: z.infer<NonNullable<NonNullable<T["env"]>["schema"]>>;
};
