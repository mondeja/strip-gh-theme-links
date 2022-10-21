import { test } from "uvu";
import * as assert from "uvu/assert";
import stripGhThemeLinks from "../..";

test("Strip GH theme links", () => {
  const content = `Foo

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/dark">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/light">
  <img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width=70>
</picture>

Bar
`;

  // keep light
  assert.equal(
    stripGhThemeLinks(content, "light"),
    `Foo

<img src="https://user-images.githubusercontent.com/light" alt="Alt text" title="Title text" width=70>

Bar
`
  );
  // keep dark
  assert.equal(
    stripGhThemeLinks(content, "dark"),
    `Foo

<img src="https://user-images.githubusercontent.com/dark" alt="Alt text" title="Title text" width=70>

Bar
`
  );

  // keep default
  assert.equal(
    stripGhThemeLinks(content),
    `Foo

<img src="https://user-images.githubusercontent.com/default" alt="Alt text" title="Title text" width=70>

Bar
`
  );
});

test.run();
