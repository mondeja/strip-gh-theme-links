import fs from 'node:fs';
import process from 'node:process';
import core from '@actions/core';
import {glob} from 'glob';

/**
 *
 * @param {boolean} strict Whether to exit with error if no files are found
 * @returns {string[]} Files to process
 */
export function getFiles(strict) {
  let warned = false;
  const filesInput = core.getInput('files');
  const files = filesInput.split('\n').flatMap((filepath) => {
    if (filepath.length === 0) {
      return [];
    }

    const globbed = glob.sync(filepath);
    if (globbed.length === 0) {
      // Is not a glob, return file if exists
      if (fs.existsSync(filepath)) {
        return [filepath];
      }

      core[strict ? 'error' : 'warning'](
        `File '${filepath}' specified inside 'files'` +
          ` input does not exist or glob has not found any files!`,
      );
      warned = true;
      return [];
    }

    return globbed;
  });
  if (files.length === 0) {
    warned = true;
    core[strict ? 'error' : 'warning'](
      `Any files found matching the input '${filesInput}'!`,
    );
  }

  if (strict && warned) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  return files;
}

/**
 * Get the theme links to keep
 * @returns {import("../index.js").keepType} Which theme links to keep
 */
export function getKeep() {
  let keep = core.getInput('keep');
  if (!keep) {
    keep = undefined;
  } else if (![undefined, 'light', 'dark'].includes(keep)) {
    throw new Error(
      `'keep' input must be either 'light' or 'dark' ('${keep}' passed)`,
    );
  }

  return keep;
}

/**
 * Whether to exit with error if no files are found
 * @returns {boolean} Whether to exit with error if no files are found
 */
export function getStrict() {
  return ['true', true].includes(core.getInput('strict'));
}
