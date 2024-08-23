import { startServer } from "./cli/start-server";
import { getConfig } from "@chainlink/core";
import cac from "cac";
import path from "path";
import { cwd } from "process";

const cli = cac("chainlink");

cli
  .command("start")
  .option("-c, --config <path>", "Config file path")
  .option("-p, --port <port>", "Server port")
  .action(async (args) => {
    const config = await getConfig(
      args?.config && path.resolve(cwd(), args.config),
    );

    startServer({
      port: args?.port,
      configPath: args?.config,
    })
  });

// Show help when no command is given
// Defined after all other commands because the help menu still shows
// an empty line for this command
cli.command("").action(() => cli.outputHelp());

cli.help();
cli.parse();
