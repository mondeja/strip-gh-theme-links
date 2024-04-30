#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import fakeDiff from 'fake-diff';
import stripGhThemeLinks from './index.js';

const scriptPath = fileURLToPath(import.meta.url);

function getPackageJson() {
  return JSON.parse(fs.readFileSync('package.json', 'utf8'));
}

function help() {
  const packageJson = getPackageJson();
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
`,
  );
  process.exit(1);
}

function version() {
  const packageJson = getPackageJson();
  console.error(packageJson.version);
  process.exit(1);
}

function processArguments(arguments_) {
  if (arguments_.length === 0) {
    help();
  }

  let keep;
  let file;
  let _insideKeep = false;
  let diff = false;
  let write = false;
  let strict = false;
  for (const argument of arguments_) {
    if (['-h', '--help'].includes(argument)) {
      help();
    } else if (['-v', '--version'].includes(argument)) {
      version();
    } else if (['-d', '--diff'].includes(argument)) {
      diff = true;
    } else if (['-w', '--write'].includes(argument)) {
      write = true;
    } else if (['-s', '--strict'].includes(argument)) {
      strict = true;
    } else if (['-k', '--keep'].includes(argument)) {
      _insideKeep = true;
    } else if (_insideKeep) {
      if (![undefined, 'light', 'dark'].includes(argument)) {
        console.error(
          `ERROR: -k/--keep argument value must be either 'light' or 'dark'`,
        );
        help();
      }

      keep = argument;
    } else {
      if (!fs.existsSync(argument)) {
        console.error(`ERROR: File ${argument} does not exists`);
        help();
      }

      file = argument;
    }
  }

  if (write && diff) {
    console.error(
      `ERROR: The option --write is not compatible along with --diff`,
    );
    help();
  }

  return {file, keep, diff, write, strict};
}

async function main() {
  let sliceN = 1;
  if (
    process.argv.includes(path.basename(scriptPath)) ||
    path.basename(process.argv[1]) === 'strip-gh-theme-links'
  ) {
    sliceN = 2;
  }

  const {file, keep, diff, write, strict} = processArguments(
    process.argv.slice(sliceN),
  );

  const content = fs.readFileSync(file, 'utf8');
  const strippedContent = await stripGhThemeLinks(content, keep);
  if (strict && content.length === strippedContent.length) {
    console.warn(`WARNING: Any content stripped from file '${file}'`);
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

if (
  process.argv[1] === scriptPath ||
  path.basename(process.argv[1]) === 'strip-gh-theme-links'
) {
  await main();
}
