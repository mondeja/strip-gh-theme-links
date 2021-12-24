import * as fs from "fs";
import * as core from "@actions/core";
import * as glob from "glob";

import { stripGhThemeLinks } from ".";

type keepType = "light" | "dark";

export function getFiles(): Array<string> {
  const filesInput = core.getInput("files")
  const files = filesInput
    .split("\n")
    .map((filepath) => {
      if (filepath.length === 0) {
        return []
      }
      const globbed: Array<string> = glob.sync(filepath);
      if (globbed.length === 0) {
        // is not a glob, return file if exists
        if (fs.existsSync(filepath)) {
          return [filepath];
        }
        core.warning(
          `File '${filepath}' specified inside 'files' input does not exist!`
        );
        return [];
      }
      return globbed;
    })
    .flat();
  if (files.length === 0) {
    core.warning(
      `Any files found matching the input '${filesInput}'!`
    );
  }
  return files;
}

export function getKeep(): keepType {
  const keep = core.getInput("keep") as keepType;
  if (!["light", "dark"].includes(keep)) {
    throw new Error(
      `'keep' input must be either 'light' or 'dark' ('${keep}' passed)`
    );
  }
  return keep;
}

export function run() {
  // Get inputs
  const files = getFiles(),
    keep = getKeep(),
    strippedTheme = keep === "light" ? "dark" : "light";

  core.debug(
    `Inputs:
  - files: ${JSON.stringify(files)}
  - keep: '${keep}'
`
  );

  for (const file of files) {
    const content: string = fs.readFileSync(file, "utf-8");
    const strippedContent = stripGhThemeLinks(content, keep);

    if (content.length !== strippedContent.length) {
      core.info(
        `Stripped ${strippedTheme} theme image links from file ${file}`
      );
      fs.writeFileSync(file, strippedContent);
      // TODO: Show diff between original and stripped content for debugging
    } else {
      core.debug(
        `Any ${strippedTheme} theme image links stripped from file ${file}`
      );
    }
  }
}
