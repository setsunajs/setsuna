import chalk from "chalk"
import { build as _build } from "esbuild"
import { rm } from "node:fs/promises"
import { execa } from "execa"
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor"
import { print, success, resolve } from "./helper.js"
import { readFileSync, writeFileSync } from "node:fs"
import inquirer from "inquirer"
import minimist from "minimist"
import { minify } from "terser"

const { mod = "prod" } = minimist(process.argv.slice(2))

let { options } = await inquirer.prompt([
  {
    type: "checkbox",
    choices: ["all", "setsuna"],
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
      name: "setsuna",
      dir: resolve("./packages/setsuna"),
      main: resolve("./packages/setsuna/src/main.ts"),
      output: resolve("./packages/setsuna/dist/setsuna"),
      dtsMain: "./dist/temp/setsuna/src/main.d.ts",
      formats: ["esm", "cjs"]
    }
  ]
}

async function build(target) {
  const configs = pkgConfigs[target]

  print("pre build...")
  await rm(resolve(`./packages/${target}/dist`), {
    recursive: true,
    force: true
  })
  success("pre build success")

  print("start code build...")
  await Promise.all(
    configs
      .map(config =>
        config.formats.map(format =>
          _build(createConfig({ ...config, format, prod: false }))
        )
      )
      .flat()
  )
  if (mod === "prod") {
    await Promise.all(
      configs
        .map(config =>
          config.formats.map(format =>
            _build(createConfig({ ...config, format, prod: true })).then(
              async () => {
                const filePath = `${config.output}.prod${ext[format]}`
                const code = await minify(readFileSync(filePath, "utf-8"), {
                  ecma: "es2017",
                  module: true,
                  toplevel: false
                })
                writeFileSync(filePath, code.code, "utf-8")
              }
            )
          )
        )
        .flat()
    )
  }
  success("code build success")

  print("start type build...")
  await configs.reduce((preWork, config) => {
    return preWork.then(() => buildType(config))
  }, Promise.resolve())
  await rm(resolve(`./packages/${target}/dist/temp`), {
    force: true,
    recursive: true
  })
  success("type build success")
}

const ext = { esm: ".js", cjs: ".cjs", iife: ".global.js" }
function createConfig({ format, main, output, prod }) {
  return {
    entryPoints: [main],
    outfile: `${output}${prod ? ".prod" : ""}${ext[format]}`,
    bundle: true,
    allowOverwrite: true,
    charset: "utf8",
    incremental: false,
    format,
    minify: false,
    target: "es2018",
    treeShaking: true,
    external: ["@setsunajs/observable"],
    define: {
      __DEV__: !prod
    }
  }
}

async function buildType({ name, dir, dtsMain }) {
  await execa(
    "tsc",
    ["-p", "./tsconfig.prod.json", "--outDir", `${dir}/dist/temp`],
    {
      stdio: "inherit"
    }
  )

  const apiExtPath = `${dir}/api-extractor.json`
  const mergeConfig = JSON.parse(readFileSync(apiExtPath))

  Object.assign(mergeConfig, {
    mainEntryPointFilePath: dtsMain,
    dtsRollup: {
      enabled: true,
      untrimmedFilePath: `./dist/${name}.d.ts`
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
    throw `merge ${name}.d.ts failed`
  }

  if (name === "setsuna") {
    const dtsPath = resolve("./packages/setsuna/dist/setsuna.d.ts")
    const originDts = readFileSync(dtsPath, "utf-8")
    const jsxDts = readFileSync(resolve("./packages/setsuna/jsx.d.ts"), "utf-8")
    writeFileSync(
      dtsPath,
      jsxDts.replace(`import { SeElement } from "./src/runtime.type"`, "") +
        originDts,
      "utf-8"
    )
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
