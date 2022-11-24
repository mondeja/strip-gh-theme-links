import * as fs from "fs";
import { test } from "uvu";
import * as assert from "uvu/assert";

test("README Github Action version updated in documentation", () => {
  const readmeContent = fs.readFileSync("README.md", "utf-8"),
    packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

  const ghActionReadmeVersionMatch = /strip-gh-theme-links@v(\d+)/g.exec(
    readmeContent
  );

  assert.not.equal(ghActionReadmeVersionMatch, null);
  assert.equal(
    packageJson.version.split(".")[0],
    ghActionReadmeVersionMatch[1]
  );
});

test.run();
