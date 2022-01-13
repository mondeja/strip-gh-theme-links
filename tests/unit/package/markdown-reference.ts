import { test } from "uvu";
import * as assert from "uvu/assert";
import stripGhThemeLinks from "../../..";

test("Strip Markdown absolute referenced with title and alt", () => {
  const content = `
[title]: https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar "Alt"
[title]: https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz "Alt"`;

  assert.equal(
    stripGhThemeLinks(content, "light"),
    `
[title]: https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar "Alt"`
  );

  assert.equal(
    stripGhThemeLinks(content, "dark"),
    `
[title]: https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg?ver=1.0.5&bar=baz "Alt"`
  );
});

test("Strip Markdown absolute referenced with title", () => {
  const content = `
[title]: https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar
[title]: https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz`;

  assert.equal(
    stripGhThemeLinks(content, "light"),
    `
[title]: https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar`
  );
});

test("Strip Markdown relative referenced", () => {
  const content = `
[title]: ./assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar
[title]: ./assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz`;

  assert.equal(
    stripGhThemeLinks(content, "light"),
    `
[title]: ./assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar`
  );
});

test.run();
