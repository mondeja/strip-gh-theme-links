import fs from "fs";
import core from "@actions/core";
import fakeDiff from "fake-diff";

import stripGhThemeLinks from "../index.js";
import { getFiles, getKeep, getStrict } from "./inputs";

export async function run() {
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
    const content = fs.readFileSync(file, "utf-8");
    const strippedContent = await stripGhThemeLinks(content, keep);

    if (content.length !== strippedContent.length) {
      core.info(
        `---------- Stripped ${strippedTheme} theme image links from` +
          ` '${file}' file ----------\n\n` +
          `${fakeDiff(content, strippedContent)}\n----------`
      );
      fs.writeFileSync(file, strippedContent);
    } else {
      core[strict ? "error" : "warning"](
        `Any ${strippedTheme} theme image links stripped from '${file}' file`
      );
      warned = true;
    }
  }

  if (strict && warned) {
    process.exit(1);
  }
}

(async () => {
  await run();
})();
