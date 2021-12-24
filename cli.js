#!/usr/bin/env node
// @ts-nocheck
/* eslint @typescript-eslint/no-var-requires: 0 */

const fs = require("fs");
const packageJson = require("./package.json");

function help() {
  console.error(
    `
  ${packageJson.description} from a file.
    Output is redirected to STDOUT.

  Usage:
    ${packageJson.name} [-h] [-v] [-k 'light' | 'dark'] file.md

  Options:
    -h, --help     Display this help text and exit.
    -v, --version  Show this program version number (${packageJson.version}).
    -k, --keep     Theme image links to keep. Either 'light or 'dark'.
`
  );
  process.exit(1);
}

function version() {
  console.error(packageJson.version);
  process.exit(1);
}

function processArgs(args) {
  if (args.length === 0) {
    help();
  }

  let keep = "light",
    file,
    _insideKeep = false;
  for (const arg of args) {
    if (["-h", "--help"].includes(arg)) {
      help();
    } else if (["-v", "--version"].includes(arg)) {
      version();
    } else if (["-k", "--keep"].includes(arg)) {
      _insideKeep = true;
    } else if (_insideKeep) {
      if (!["light", "dark"].includes(arg)) {
        console.error(
          `ERROR: -k/--keep argument value must be either 'light' or 'dark'`
        );
        help();
      }
      keep = arg;
    } else {
      if (!fs.existsSync(arg)) {
        console.error(`ERROR: File ${arg} does not exists`);
        help();
      }
      file = arg;
    }
  }

  return { keep, file };
}

if (require.main === module) {
  let sliceN = 1;
  if (
    process.argv.indexOf(module.filename) > -1 ||
    require("path").basename(process.argv[1]) === "strip-gh-theme-links"
  ) {
    sliceN = 2;
  }
  const { file, keep } = processArgs(
    process.argv.slice(sliceN, process.argv.length)
  );

  const { stripGhThemeLinks } = require(".");
  const content = fs.readFileSync(file, "utf-8");
  process.stdout.write(stripGhThemeLinks(content, keep));
}
