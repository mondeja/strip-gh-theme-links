import { test } from "uvu";
import * as assert from "uvu/assert";
import { getKeep } from "../../../action/inputs";

test("Get keep as default", () => {
  assert.equal(getKeep(), undefined);
});

test("Get keep as valid", () => {
  process.env["INPUT_KEEP"] = "light";
  assert.equal(getKeep(), "light");

  process.env["INPUT_KEEP"] = "dark";
  assert.equal(getKeep(), "dark");

  delete process.env["INPUT_KEEP"];
});

test("Get keep as invalid", () => {
  process.env["INPUT_KEEP"] = "awsd";
  assert.throws(getKeep, "'keep' input must be either 'light' or 'dark'");
  delete process.env["INPUT_KEEP"];
});

test.run();
