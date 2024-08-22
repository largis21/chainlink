import { z } from "zod";
import fs from "fs/promises"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { cwd } from "process";
import { test } from "@chainlink/core"

export const coreInterface = createTRPCRouter({
  getRequestsInFs: publicProcedure
    .input(z.undefined())
    .query(async () => {
      const dir = test("HELLO THIS IS THROUGH CORE")
    
      return {
        dir: dir,
      };
    }),
});
