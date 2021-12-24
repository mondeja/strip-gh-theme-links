import { tmpdir } from "os";
import * as fs from "fs";
import * as path from "path";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { getFiles } from "../../action/inputs";

const TMP_DIRNAME = "shgtla-get-files-as-globs";

test("Get files from plain text", () => {
  const testdir = path.join(tmpdir(), TMP_DIRNAME);
  if (fs.existsSync(testdir)) {
    fs.rmdirSync(testdir, { recursive: true });
  }
  fs.mkdirSync(testdir);

  const filenames = ["foo.md", "bar.md"];
  for (const filename of filenames) {
    const filepath = path.join(testdir, filename);
    fs.writeFileSync(filepath, "");
  }

  process.env["INPUT_FILES"] =
    filenames.map((filename) => path.join(testdir, filename)).join("\n") + "\n"; // newline that action appends in multiline inputs
  assert.equal(
    getFiles(),
    filenames.map((filename) => path.join(testdir, filename))
  );
  delete process.env["INPUT_FILES"];

  fs.rmdirSync(testdir, { recursive: true });
});

test("Get files from globs", () => {
  const testdir = path.join(tmpdir(), TMP_DIRNAME);
  if (fs.existsSync(testdir)) {
    fs.rmdirSync(testdir, { recursive: true });
  }
  fs.mkdirSync(testdir);

  const filenames = ["foo.md", "bar.md"];
  for (const filename of filenames) {
    const filepath = path.join(testdir, filename);
    fs.writeFileSync(filepath, "");
  }

  process.env["INPUT_FILES"] = path.join(testdir, "*.md") + "\n";
  assert.equal(
    getFiles(),
    filenames.map((filename) => path.join(testdir, filename)).sort()
  );
  delete process.env["INPUT_FILES"];

  fs.rmdirSync(testdir, { recursive: true });
});

test("Unexistent files", () => {
  process.env["INPUT_FILES"] = "foo.md\nbar.md";
  assert.equal(getFiles(), []);
  delete process.env["INPUT_FILES"];
});

test.run();
