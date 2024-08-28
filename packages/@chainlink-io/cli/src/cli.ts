import { getConfig } from "@chainlink-io/core";
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
    .action(async (args) => {
      const config = await getConfig(
        args?.config && path.resolve(cwd(), args.config),
      );

      cliActionStart({
        port: args?.port || config.server?.port,
        configPath: args?.config,
      });
    });

  cli
    .command("tests", "readConfig")
    .option("-c, --config <path>", "Config file path")
    .action(async (args) => {
      const config = await getConfig(
        args?.config && path.resolve(cwd(), args.config),
      );

      console.log("Reading config")
      console.log(config)
    });



  // Show help when no command is given
  // Defined after all other commands because the help menu still shows
  // an empty line for this command
  cli.command("").action(() => cli.outputHelp());

  cli.help();
  cli.parse();
}
