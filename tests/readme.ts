import fs from "fs";

import { test } from "uvu";
import * as assert from "uvu/assert";

test("README Github Action version updated in documentation", () => {
  const readmeContent = fs.readFileSync("README.md", "utf-8"),
    packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

  const ghActionReadmeVersionMatch = /strip-gh-theme-links@v([\d\w.]+)/g.exec(
    readmeContent
  );
  assert.not.equal(ghActionReadmeVersionMatch, null);
  const ghActionReadmeVersion = (
    ghActionReadmeVersionMatch as Array<string>
  )[1];

  assert.equal(packageJson.version, ghActionReadmeVersion);
});

test.run();
