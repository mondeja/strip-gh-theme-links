import { test } from "uvu";
import * as assert from "uvu/assert";
import stripGhThemeLinks from "../..";

test("Strip HTML absolute inline with alt", () => {
  const content = `
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/dark">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/light">
  <img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width=70>
</picture>
`;

  // keep light
  assert.equal(
    stripGhThemeLinks(content, "light"),
    `
<img src="https://user-images.githubusercontent.com/light" alt="Alt text" title="Title text" width=70>
`
  );
  // keep dark
  assert.equal(
    stripGhThemeLinks(content, "dark"),
    `
<img src="https://user-images.githubusercontent.com/dark" alt="Alt text" title="Title text" width=70>
`
  );

  // keep default
  assert.equal(
    stripGhThemeLinks(content),
    `
<img src="https://user-images.githubusercontent.com/default" alt="Alt text" title="Title text" width=70>
`
  );
});

test.run();
