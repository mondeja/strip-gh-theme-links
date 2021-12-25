import * as fs from "fs";
import * as core from "@actions/core";

import stripGhThemeLinks from "..";
import { getFiles, getKeep, getStrict } from './inputs';

export function run() {
  let warned = false;

  // Parse inputs
  const strict = getStrict(),
    files = getFiles(strict),
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
        `Stripped ${strippedTheme} theme image links from '${file}' file`
      );
      fs.writeFileSync(file, strippedContent);
      // TODO: Show diff between original and stripped content for debugging
    } else {
      core[strict ? "error" : "warning"](
        `Any ${strippedTheme} theme image links stripped from '${file}' file`
      );
      warned = true;
    }
  }

  if (strict && warned) {
    process.exit(1)
  }
}

run()
