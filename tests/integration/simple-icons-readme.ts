import * as fs from "fs";
import * as path from "path";
import { test } from "uvu";
import * as assert from "uvu/assert";
import stripGhThemeLinks from "../../index";

test("Simple Icons README strip", () => {
  const siReadmeFilePath = path.resolve(
    __dirname,
    "../../node_modules/simple-icons/README.md"
  );
  const siReadme = fs.readFileSync(siReadmeFilePath, "utf8");

  const result = stripGhThemeLinks(siReadme, "light");
  assert.equal(result.split("\n").length, siReadme.split("\n").length);
  assert.not(result.includes("gh-light-mode-only"));
  assert.not(result.includes("gh-dark-mode-only"));
});

test.run();
