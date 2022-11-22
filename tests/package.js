import { test } from "uvu";
import * as assert from "uvu/assert";
import stripGhThemeLinks from "../index.js";

test("Strip GH theme links", async () => {
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
    await stripGhThemeLinks(content, "light"),
    `Foo

<img src="https://user-images.githubusercontent.com/light" alt="Alt text" title="Title text" width=70>

Bar
`
  );
  // keep dark
  assert.equal(
    await stripGhThemeLinks(content, "dark"),
    `Foo

<img src="https://user-images.githubusercontent.com/dark" alt="Alt text" title="Title text" width=70>

Bar
`
  );

  // keep default
  assert.equal(
    await stripGhThemeLinks(content),
    `Foo

<img src="https://user-images.githubusercontent.com/default" alt="Alt text" title="Title text" width=70>

Bar
`
  );
});

test("HTML blocks with more than a picture tag", async () => {
  const content = `<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/simpleicons-white.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/simpleicons.svg"><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/simpleicons.svg" alt="Simple Icons" width=70></picture>
  <h3 align="center">Simple Icons</h3>
  <p align="center">
  Over 2300 Free SVG icons for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub.</p>
</p>
`;

  assert.equal(await stripGhThemeLinks(content), ``);
});

test.run();
