import path from "path";
import { z } from "zod";

export type ChainlinkConfig = {
  /**
   * Location of the chainlink root folder
   *
   * @default "./chainlink"
   */
  chainlinkRootDir: string;
  /**
   * Location of the chainlink `requests` folder, relative to `chainlinkRoot`
   *
   * @default "requests"
   */
  requestsDir: string;
  /**
   * Location of the chainlink `chains` folder, relative to `chainlinkRoot`
   *
   * @default "requests"
   */
  chainsDir: string;
  server: {
    /**
     * Which port should the server run on
     *
     * @default 4202
     */
    port: number;
  };
};

// All properties are optional because a config definition only needs to specify properties they
// want to change, other properties will use the defaults
export const configSchema = z.object({
  chainlinkRootDir: z.string().optional(),
  requestsDir: z.string().optional(),
  chainsDir: z.string().optional(),
  server: z
    .object({
      port: z.number().optional(),
    })
    .optional(),
});

type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object | undefined ? RecursivePartial<T[P]> :
    T[P];
};

// If these throw type errors, `configSchema` and `ChainlinkConfig` are out of sync
const configSchemaSync: (
  RecursivePartial<ChainlinkConfig> extends z.infer<typeof configSchema> ? true : false
) = true

const schemaConfigSync: (
  z.infer<typeof configSchema> extends RecursivePartial<ChainlinkConfig> ? true : false
) = true

export const defaultConfig: ChainlinkConfig = {
  chainlinkRootDir: path.resolve(process.cwd(), "chainlink"),
  requestsDir: "requests",
  chainsDir: "chains",
  server: {
    port: 4202,
  },
} as const;

export function defineConfig(config: RecursivePartial<ChainlinkConfig>) {
  return config;
}
