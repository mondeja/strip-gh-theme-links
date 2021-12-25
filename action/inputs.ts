import * as fs from "fs";
import * as core from "@actions/core";
import * as glob from "glob";

type keepType = "light" | "dark";

export function getFiles(strict?: boolean | undefined): Array<string> {
  let warned = false;
  const filesInput = core.getInput("files");
  const files = filesInput
    .split("\n")
    .map((filepath) => {
      if (filepath.length === 0) {
        return [];
      }
      const globbed: Array<string> = glob.sync(filepath);
      if (globbed.length === 0) {
        // is not a glob, return file if exists
        if (fs.existsSync(filepath)) {
          return [filepath];
        }
        core[strict ? "error" : "warning"](
          `File '${filepath}' specified inside 'files'`
          + ` input does not exist or glob has not found any files!`
        );
        warned = true
        return [];
      }
      return globbed;
    })
    .flat();
  if (files.length === 0) {
    warned = true;
    core[strict ? "error" : "warning"](
      `Any files found matching the input '${filesInput}'!`
    );
  }
  if (strict && warned) {
    process.exit(1)
  }
  return files;
}

export function getKeep(): keepType {
  let keep = core.getInput("keep") as keepType;
  if (!keep) {
    keep = 'light'
  } else if (!["light", "dark"].includes(keep)) {
    throw new Error(
      `'keep' input must be either 'light' or 'dark' ('${keep}' passed)`
    );
  }
  return keep;
}

export function getStrict(): boolean {
  return ["true", true].includes(core.getInput("strict"));
}
