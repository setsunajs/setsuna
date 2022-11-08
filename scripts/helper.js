import path from "node:path"
import { readFile, rm } from "node:fs/promises"
import chalk from "chalk"

const cwd = process.cwd()
export const resolve = (...p) => path.resolve(cwd, ...p)

export const clean = path => rm(path, { force: true, recursive: true })

export const resolvePackage = (path = "./package.json") => {
  return readFile(resolve(path), "utf-8").then(pkg => JSON.parse(pkg))
}

export const print = m => console.log(chalk.yellow(m))
export const success = m => console.log(chalk.green(m), "\n")
export const error = m => console.log(chalk.red(m))
