import type { z } from "zod";

export type ChainlinkConfig<
  TEnvSchema extends z.ZodSchema = z.ZodSchema,
  TGlobals extends Record<string, string> = Record<string, string>,
> = {
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
    schema?: TEnvSchema;
  };

  /*
   * Globals
   */
  globals: TGlobals;

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

/**
 * @public
 *
 * This is the type that should be the default config of the chainlink config file
 */
export type PartialChainlinkConfig<
  TEnvSchema extends z.ZodSchema = z.ZodSchema,
  TGlobals extends Record<string, string> = Record<string, string>,
> = {
    [P in keyof ChainlinkConfig<TEnvSchema, TGlobals>]?: Partial<
      ChainlinkConfig<TEnvSchema, TGlobals>[P]
    >;
  };

/**
 * @public
 *
 * Helper type for using the chainlink global context typesafely
 */
export type ClDeclareGlobal<T extends PartialChainlinkConfig> = {
  globals: NonNullable<T["globals"]>;
  env: z.infer<NonNullable<NonNullable<T["env"]>["schema"]>>;
};
