import fs from 'node:fs';
import process from 'node:process';
import core from '@actions/core';
import fakeDiff from 'fake-diff';
import stripGhThemeLinks from '../index.js';
import {getFiles, getKeep, getStrict} from './inputs.js';

export async function run() {
  let warned = false;

  // Parse inputs
  const strict = getStrict();
  const files = getFiles(strict);
  const keep = getKeep();
  const strippedTheme = keep === 'light' ? 'dark' : 'light';

  core.debug(
    `Inputs:
  - files: ${JSON.stringify(files)}
  - keep: '${keep}'
`,
  );

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    // eslint-disable-next-line no-await-in-loop
    const strippedContent = await stripGhThemeLinks(content, keep);

    if (content.length === strippedContent.length) {
      core[strict ? 'error' : 'warning'](
        `Any ${strippedTheme} theme image links stripped from '${file}' file`,
      );
      warned = true;
    } else {
      core.info(
        `---------- Stripped ${strippedTheme} theme image links from` +
          ` '${file}' file ----------\n\n` +
          `${fakeDiff(content, strippedContent)}\n----------`,
      );
      fs.writeFileSync(file, strippedContent);
    }
  }

  if (strict && warned) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
}

await run();
