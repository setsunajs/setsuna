import chalk from "chalk"
import { build as _build } from "esbuild"
import { rm, readdir } from "node:fs/promises"
import { execa } from "execa"
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor"
import { print, success, resolve } from "./helper.js"
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import inquirer from "inquirer"
import { config } from "node:process"

let { options } = await inquirer.prompt([
  {
    type: "checkbox",
    choices: ["setsuna", "all"],
    name: "options",
    default: ["all"]
  }
])
if (options.includes("all")) {
  options = ["setsuna"]
}

const pkgConfigs = {
  setsuna: [
    {
      dts: {
        entityName: "main",
        outName: "setsuna"
      },
      entityFile: "/src/main.ts",
      outputFile: "/dist/setsuna",
      formats: ["esm", "cjs"]
    }
  ]
}

async function build(target) {
  const targetDir = resolve(`./packages/${target}`)
  const configs = pkgConfigs[target]

  print("pre build...")
  await rm(targetDir + "/dist", { recursive: true, force: true })
  success("pre build success")

  print("start code build...")
  await Promise.all(
    configs
      .map(config => {
        return config.formats.map(format => {
          const _config = {
            entity: resolve(`./packages/${target}${config.entityFile}`),
            output: resolve(`./packages/${target}${config.outputFile}`)
          }
          return _build(createConfig({ format, ..._config }))
        })
      })
      .flat()
  )
  success("code build success")

  print("start type build...")
  await configs.reduce((preWork, config) => {
    return preWork.then(() => buildType({ ...config.dts, targetDir }))
  }, Promise.resolve())
  await rm(`${targetDir}/dist/temp`, { force: true, recursive: true })
  success("type build success")
}

const ext = { esm: ".js", cjs: ".cjs", iife: ".global.js" }
function createConfig({ format, entity, output }) {
  return {
    outfile: `${output}${ext[format]}`,
    entryPoints: [entity],
    bundle: true,
    allowOverwrite: true,
    charset: "utf8",
    incremental: false,
    format,
    minify: false,
    target: "es2017",
    treeShaking: true
  }
}

async function buildType({ entityName, outName, targetDir }) {
  await execa("tsc", ["-p", "./tsconfig.prod.json", "--outDir", `${targetDir}/dist/temp`], {
    stdio: "inherit"
  })

  const apiExtPath = `${targetDir}/api-extractor.json`
  const mergeConfig = JSON.parse(readFileSync(apiExtPath))

  Object.assign(mergeConfig, {
    mainEntryPointFilePath: `./dist/temp/${entityName}.d.ts`,
    dtsRollup: {
      enabled: true,
      untrimmedFilePath: `./dist/${outName}.d.ts`
    }
  })
  writeFileSync(apiExtPath, JSON.stringify(mergeConfig, null, 2), "utf-8")
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(
    resolve(apiExtPath)
  )
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true
  })
  if (!extractorResult.succeeded) {
    throw `merge ${outName}.d.ts failed`
  }
}

Promise.all(
  options.map(target => {
    return build(target).catch(err => {
      console.log()
      console.log(chalk.red(`build "${target}" failed: \n\n`), err)
      console.log()
    })
  })
).finally(() => process.exit(0))
