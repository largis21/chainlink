/**
 * VERY IMPORTANT:
 *
 * @chainlink-io/core/schemas must not include the @chainlink-io/core bundle!!
 *
 * This is a seperate bundle from @chainlink-io/core which is exported as @chainlink-io/core/schemas
 * It should only include zod schemas that can be used on the frontend
 * This needs to be a seperate bundle because the core bundle includes stuff that can't and shouldn't
 * run in the browser
 *
 * It might be an idea to split this into its own package to avoid this trouble, but it seems a bit
 * overkill
 */

export { chainlinkConfigSchema } from "./configSchema";
