import fs from "fs/promises";
import path from "path";
import {promisify} from "util"
import {exec as _exec} from "child_process"
import { input } from "@inquirer/prompts";

const exec = promisify(_exec)

const validPm = ["npm", "pnpm", "yarn", "bun"]

export function installDepsIfNotInstalled() {
  return new Promise(async (resolve) => {
    const needsInstall = await getPathsNeedingInstall(
      path.resolve(__dirname, "../app"),
      [],
    );

    if (needsInstall.length === 0) {
      return;
    }

    let packageManager: typeof validPm[number] | null = null

    while (!packageManager) {
      const pmCandidate = await input({
        message: `The Chainlink application needs to install some dependencies which cant be installed automaticly
  Which package manager would you like to install them with? (${validPm.join("|")}):`,
      });

      if (validPm.includes(pmCandidate)) {
        packageManager = pmCandidate
      }
    }

    for (const path of needsInstall) {
      console.log(`Installing packages in ${path}`)
      await installPackages("pnpm", path)
    }
  });
}

async function getPathsNeedingInstall(currentPath: string, paths: string[]) {
  if (currentPath.endsWith("node_modules") || currentPath.endsWith(".next")) {
    return paths;
  }

  let dir;
  try {
    dir = await fs.readdir(currentPath);
  } catch {
    return paths;
  }

  if (dir.includes("package.json") && !dir.includes("node_modules")) {
    paths.push(currentPath);
  }

  for (const node of dir) {
    await getPathsNeedingInstall(path.resolve(currentPath, node), paths);
  }

  return paths;
}

async function installPackages(pm: typeof validPm[number], path: string) {
  await exec(`cd ${path} && pnpm install --ignore-workspace`)
}
