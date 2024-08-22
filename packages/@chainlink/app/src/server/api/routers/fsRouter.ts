import { z } from "zod";
import fs from "fs/promises"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { cwd } from "process";

export const fsRouter = createTRPCRouter({
  getDir: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async () => {
      const dir = await fs.readdir(cwd())
    
      return {
        dir: dir,
      };
    }),
});
