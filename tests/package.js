import {test} from 'uvu';
import * as assert from 'uvu/assert';
import stripGhThemeLinks from '../index.js';

const CONTENT = `Foo

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/dark">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/light">
  <img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width=70>
</picture>

Bar
`;

const DARK_ONLY_CONTENT = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/dark">
  <img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width=70>
</picture>
`;

const LIGHT_ONLY_CONTENT = `<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/light">
  <img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width=70>
</picture>
`;

const NO_SOURCES_CONTENT = `<picture>
  <img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width=70>
</picture>
`;

const UNSUPPORTED_SOURCES_CONTENT = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/dark">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/light">
  <source media="(prefers-color-scheme: colorblind)" srcset="https://user-images.githubusercontent.com/light">
  <img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width=70>
</picture>
`;

test('Strip GH theme links (keep light)', async () => {
  // Keep light
  assert.equal(
    await stripGhThemeLinks(CONTENT, 'light'),
    `Foo

<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/light" width="70">

Bar
`,
  );
});

test('Strip GH theme links (keep dark)', async () => {
  // Keep dark
  assert.equal(
    await stripGhThemeLinks(CONTENT, 'dark'),
    `Foo

<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/dark" width="70">

Bar
`,
  );
});

test('Strip GH theme links (keep default)', async () => {
  // Keep default
  assert.equal(
    await stripGhThemeLinks(CONTENT),
    `Foo

<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width="70">

Bar
`,
  );
});

test('HTML blocks with more than a picture tag', async () => {
  const content = `<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/assets/readme/simpleicons-white.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/simpleicons.svg"><img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/simpleicons.svg" alt="Simple Icons" width=70></picture>
  <h3 align="center">Simple Icons</h3>
  <p align="center">
  Over 2300 Free SVG icons for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub.</p>
</p>
`;

  assert.equal(
    await stripGhThemeLinks(content),
    `<p align="center">
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/simpleicons.svg" alt="Simple Icons" width="70">
  <h3 align="center">Simple Icons</h3>
  <p align="center">
  Over 2300 Free SVG icons for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub.</p>
</p>
`,
  );
});

test('Picture with only the dark source (keep=default)', async () => {
  assert.equal(
    await stripGhThemeLinks(DARK_ONLY_CONTENT),
    `<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width="70">
`,
  );
});

test('Picture with only the dark source (keep=dark)', async () => {
  assert.equal(
    await stripGhThemeLinks(DARK_ONLY_CONTENT, 'dark'),
    `<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/dark" width="70">
`,
  );
});

test('Picture with only the dark source (keep=light)', async () => {
  assert.equal(
    await stripGhThemeLinks(DARK_ONLY_CONTENT, 'light'),
    DARK_ONLY_CONTENT,
  );
});

test('Picture with only the light source (keep=default)', async () => {
  assert.equal(
    await stripGhThemeLinks(LIGHT_ONLY_CONTENT),
    `<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width="70">
`,
  );
});

test('Picture with only the light source (keep=dark)', async () => {
  assert.equal(
    await stripGhThemeLinks(LIGHT_ONLY_CONTENT, 'dark'),
    LIGHT_ONLY_CONTENT,
  );
});

test('Picture with only the light source (keep=light)', async () => {
  assert.equal(
    await stripGhThemeLinks(LIGHT_ONLY_CONTENT, 'light'),
    `<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/light" width="70">
`,
  );
});

test('Picture without sources (keep=default)', async () => {
  assert.equal(
    await stripGhThemeLinks(NO_SOURCES_CONTENT),
    `<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width="70">
`,
  );
});

test('Picture without sources (keep=dark)', async () => {
  assert.equal(
    await stripGhThemeLinks(NO_SOURCES_CONTENT, 'dark'),
    NO_SOURCES_CONTENT,
  );
});

test('Picture without sources (keep=light)', async () => {
  assert.equal(
    await stripGhThemeLinks(NO_SOURCES_CONTENT, 'light'),
    NO_SOURCES_CONTENT,
  );
});

test('Picture with unsupported sources (keep=default)', async () => {
  assert.equal(
    await stripGhThemeLinks(UNSUPPORTED_SOURCES_CONTENT),
    `<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/default" width="70">
`,
  );
});

test('Picture with unsupported sources (keep=dark)', async () => {
  assert.equal(
    await stripGhThemeLinks(UNSUPPORTED_SOURCES_CONTENT, 'dark'),
    `<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/dark" width="70">
`,
  );
});

test('Picture with unsupported sources (keep=light)', async () => {
  assert.equal(
    await stripGhThemeLinks(UNSUPPORTED_SOURCES_CONTENT, 'light'),
    `<img alt="Alt text" title="Title text" src="https://user-images.githubusercontent.com/light" width="70">
`,
  );
});

test.run();
