import { test } from "uvu";
import * as assert from "uvu/assert";
import { getStrict } from "../../action/inputs";

test("Get strict as default", () => {
  assert.equal(getStrict(), false);
});

test("Get strict as true", () => {
  process.env["INPUT_STRICT"] = "true";
  assert.equal(getStrict(), true);
  delete process.env["INPUT_STRICT"];
});

test("Get strict as true", () => {
  process.env["INPUT_STRICT"] = "false";
  assert.equal(getStrict(), false);
  delete process.env["INPUT_STRICT"];
});

test.run();
