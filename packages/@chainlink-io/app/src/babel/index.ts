// I hate this
import _generate from "@babel/generator";

export const generate = process.env["TEST"]
  ? _generate
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((_generate as any).default as typeof _generate);
