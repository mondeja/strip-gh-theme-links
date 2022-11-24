import fs from "fs";
import { test } from "uvu";
import * as assert from "uvu/assert";
import stripGhThemeLinks from "../index.js";

test("Simple Icons README strip", async () => {
  const siReadme = fs.readFileSync("si-readme.md", "utf8");

  const result = await stripGhThemeLinks(siReadme, "dark");
  assert.not(result.includes("prefers-colors-scheme"));
  assert.not(result.includes("source media="));
  assert.ok(result.includes("assets/readme/simpleicons-white.svg"));
});

test.run();
