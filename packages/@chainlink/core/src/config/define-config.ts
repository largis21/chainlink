import { z } from "zod";

export type ChainlinkConfig = {
  /**
   * Location of the chainlink root folder
   *
   * @default "./chainlink"
   */
  chainlinkRoot?: string;
  /**
   * Location of the chainlink `requests` folder, relative to `chainlinkRoot`
   *
   * @default "requests"
   */
  chainlinkRequests?: string;
  /**
   * Location of the chainlink `chains` folder, relative to `chainlinkRoot`
   *
   * @default "requests"
   */
  chainlinkChains?: string;

  server?: {
    /**
     * Which port should the server run on
     *
     * @default 4202
     */
    port?: number;
  };
};

export const configSchema = z.object({
  chainlinkRoot: z.string().optional(),
  chainlinkRequests: z.string().optional(),
  chainlinkChains: z.string().optional(),
  server: z.object({
    port: z.number().optional()
  }).optional()
});

export const defaultConfig: ChainlinkConfig = {
  chainlinkRoot: "./chainlink",
  chainlinkRequests: "requests",
  chainlinkChains: "chains",
} as const;

export const defaultConfigFile = `
import { defineConfig } from "@chainlink-io/chainlink"

export default defineConfig({
${Object.keys(defaultConfig)
    .map((key) => `  ${key}: ${defaultConfig[key as keyof typeof defaultConfig]}`)
    .join(",\n")}
})
`;

export function defineConfig(config: ChainlinkConfig) {
  return config;
}
