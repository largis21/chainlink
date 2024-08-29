import path from "path";

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

type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object | undefined ? RecursivePartial<T[P]> :
    T[P];
};


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
