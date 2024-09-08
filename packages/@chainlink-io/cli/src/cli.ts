import { getConfig, readRequestDef } from "@chainlink-io/core";
import { cliActionStart } from "./actions/start";
import cac from "cac";
import path from "path";
import { cwd } from "process";

export function runCli() {
  const cli = cac("chainlink");

  cli
    .command("start")
    .option("-c, --config <path>", "Config file path")
    .option("-p, --port <port>", "Server port")
    .action(async (args: { config: string; port: string } | undefined) => {
      const config = await getConfig(
        args?.config && path.resolve(cwd(), args.config),
      );

      if (args?.port && !isNaN(parseInt(args.port))) {
        config.server.port = parseInt(args.port);
      }

      cliActionStart(config);
    });

  cli
    .command("run", "request")
    .option("-c, --config <path>", "Config file path")
    .option("-p, --path <path>", "Request definition path")
    .action(async (args: { path?: string, config?: string }) => {
      if (!args.path) {
        throw new Error("Please provide a path to the request definition")
      }

      const config = await getConfig(
        args?.config && path.resolve(cwd(), args.config),
      );

      const requestDefinition = readRequestDef(config, args.path)

      console.log("Running request NOT");
    });

  cli
    .command("tests", "readConfig")
    .option("-c, --config <path>", "Config file path")
    .action(async (args) => {
      const config = await getConfig(
        args?.config && path.resolve(cwd(), args.config),
      );

      console.log(config);
    });

  // Show help when no command is given
  // Defined after all other commands because the help menu still shows
  // an empty line for this command
  cli.command("").action(() => cli.outputHelp());

  cli.help();
  cli.parse();
}
