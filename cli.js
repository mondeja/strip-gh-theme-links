#!/usr/bin/env node
/* eslint @typescript-eslint/no-var-requires: 0 */

const fs = require("fs");
const packageJson = require("./package.json");
const fakeDiff = require("fake-diff");

function help() {
  console.error(
    `
  ${packageJson.description} from a file.
    By default, output is redirected to STDOUT.

  Usage:
    ${packageJson.name} [-h] [-v] [-k 'light' | 'dark'] [-d] [-w] [-s] file.md

  Options:
    -h, --help     Display this help text and exit.
    -v, --version  Show this program version number (${packageJson.version}).
    -k, --keep     Theme image links to keep. Either 'light or 'dark'.
    -d, --diff     Show the difference before and after links stripping.
    -w, --write    Write changes in file. Not compatible with --diff.
    -s, --strict   Exit with code 1 if any content is stripped.
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

  let keep = undefined,
    file,
    _insideKeep = false,
    diff = false,
    write = false,
    strict = false;
  for (const arg of args) {
    if (["-h", "--help"].includes(arg)) {
      help();
    } else if (["-v", "--version"].includes(arg)) {
      version();
    } else if (["-d", "--diff"].includes(arg)) {
      diff = true;
    } else if (["-w", "--write"].includes(arg)) {
      write = true;
    } else if (["-s", "--strict"].includes(arg)) {
      strict = true;
    } else if (["-k", "--keep"].includes(arg)) {
      _insideKeep = true;
    } else if (_insideKeep) {
      if (![undefined, "light", "dark"].includes(arg)) {
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

  if (write && diff) {
    console.error(
      `ERROR: The option --write is not compatible along with --diff`
    );
    help();
  }

  return { file, keep, diff, write, strict };
}

if (require.main === module) {
  let sliceN = 1;
  if (
    process.argv.indexOf(module.filename) > -1 ||
    require("path").basename(process.argv[1]) === "strip-gh-theme-links"
  ) {
    sliceN = 2;
  }
  const { file, keep, diff, write, strict } = processArgs(
    process.argv.slice(sliceN)
  );

  const stripGhThemeLinks = require("./dist/cjs/wrapper");
  const content = fs.readFileSync(file, "utf-8");
  const strippedContent = stripGhThemeLinks(content, keep);
  if (strict && content.length === strippedContent.length) {
    console.error(`ERROR: Any content stripped from file '${file}'`);
    process.exit(1);
  }

  if (diff) {
    console.log(fakeDiff(content, strippedContent));
  } else if (write) {
    fs.writeFileSync(file, strippedContent);
  } else {
    console.log(strippedContent);
  }
}
