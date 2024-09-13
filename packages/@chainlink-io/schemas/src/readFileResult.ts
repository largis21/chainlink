import type { ReadFileResult } from "@chainlink-io/core";
import { z } from "zod";

export const successfulReadFileResult = z.object({
  text: z.string(),
  exports: z.union([
    z.object({
      default: z.unknown(),
    }),
    z.record(z.unknown()),
  ]),
});

type __SuccessfulReadFileResult = Extract<ReadFileResult, {}>;
export type SuccessfulReadFileResult = z.infer<typeof successfulReadFileResult>;

const inSync: SuccessfulReadFileResult extends __SuccessfulReadFileResult
  ? true
  : false = true;

const inSyncReverse: __SuccessfulReadFileResult extends SuccessfulReadFileResult
  ? true
  : false = true;
