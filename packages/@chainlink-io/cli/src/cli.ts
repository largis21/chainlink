import { getConfig, readRequestDef } from "@chainlink-io/core";
import cac from "cac";
import path from "path";
import { cwd } from "process";

import { cliActionStart } from "./actions/start";

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

  // cli
  //   .command("run", "request")
  //   .option("-c, --config <path>", "Config file path")
  //   .option("-p, --path <path>", "Request definition path")
  //   .action(async (args: { path?: string; config?: string }) => {
  //     if (!args.path) {
  //       throw new Error("Please provide a path to the request definition");
  //     }
  //
  //     const config = await getConfig(
  //       args?.config && path.resolve(cwd(), args.config),
  //     );
  //
  //     const requestDefinition = await readRequestDef(
  //       config,
  //       path.resolve(cwd(), args.path),
  //     );
  //
  //     const response = await runRequest(requestDefinition);
  //
  //     console.log(response.headers);
  //   });
  //
  cli
    .command("tests", "readConfig")
    .option("-c, --config <path>", "Config file path")
    .action(async (args) => {
      const config = await getConfig(
        args?.config && path.resolve(cwd(), args.config),
      );

      console.log(config);
    });

  cli
    .command("test-read-request-def")
    .option("-c, --config <path>", "Config file path")
    .option("-p, --path <path>", "Request definition path")
    .action(async (args) => {
      if (!args.path) {
        throw new Error("Please provide a path to the request definition");
      }

      const config = await getConfig(
        args?.config && path.resolve(cwd(), args.config),
      );

      console.log(
        await readRequestDef(config, path.resolve(cwd(), args.path), {
          getStringifiedPropertySources: true,
        }),
      );
    });

  // cli
  //   .command("tests editable")
  //   .option("-c, --config <path>", "Config file path")
  //   .option("-p, --path <path>", "Request definition path")
  //   .action(async (args: { path?: string; config?: string }) => {
  //     console.log("ME");
  //     if (!args.path) {
  //       throw new Error("Please provide a path to the request definition");
  //     }
  //
  //     const config = await getConfig(
  //       args?.config && path.resolve(cwd(), args.config),
  //     );
  //
  //     console.log(
  //       await getEditableRequestDefinition(
  //         config,
  //         path.resolve(cwd(), args.path),
  //       ),
  //     );
  //   });

  // cli
  //   .command("tests", "set-url")
  //   .option("-c, --config <path>", "Config file path")
  //   .option("-p, --path <path>", "Request definition path")
  //   .option("-n, --new <path>", "New url value")
  //   .action(async (args: { path?: string; config?: string; new?: string }) => {
  //     if (!args.path) {
  //       throw new Error("Please provide a path to the request definition");
  //     }
  //
  //     if (!args.new) {
  //       throw new Error("Please provide a new value");
  //     }
  //
  //     const config = await getConfig(
  //       args?.config && path.resolve(cwd(), args.config),
  //     );
  //
  //     await setRequestDefinitionValue(
  //       config,
  //       path.resolve(cwd(), args.path),
  //       "url",
  //       args.new,
  //     );
  //   });

  // Show help when no command is given
  // Defined after all other commands because the help menu still shows
  // an empty line for this command
  cli.command("").action(() => cli.outputHelp());

  cli.help();
  cli.parse();
}
