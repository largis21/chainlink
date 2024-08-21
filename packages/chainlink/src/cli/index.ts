#!/usr/bin/env node

import { _startServer } from "../serve/index"
import { getConfig } from "./get_config"

console.log("Running Chainlink CLI")

async function run() {
  // const config = await getConfig(process.cwd())
  // console.log("config", config)
  _startServer()
}

run()


