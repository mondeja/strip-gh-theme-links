import { test } from "uvu";
import * as assert from 'uvu/assert'
import { stripGhThemeLinks } from '../..';

test("Strip Markdown absolute inline with title and alt", () => {
  const content = `
![title](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar "Alt")
![title](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz "Alt")`

  assert.equal(
    stripGhThemeLinks(content, 'light'),
    `
![title](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar "Alt")
`
  )

  assert.equal(
    stripGhThemeLinks(content, 'dark'),
    `

![title](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg?ver=1.0.5&bar=baz "Alt")`
  )
})

test("Strip Markdown absolute inline with title", () => {
  const content = `
![title](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar)
![title](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz)`

  assert.equal(
    stripGhThemeLinks(content, 'light'),
    `
![title](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar)
`
  )
})

test("Strip Markdown absolute inline with empty title", () => {
  const content = `
![](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar)
![](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg?ver=1.0.5&bar=baz)`

  assert.equal(
    stripGhThemeLinks(content, 'dark'),
    `

![](https://raw.githubusercontent.com/user/repo/assets/readme/nodedotjs-white.svg?ver=1.0.5&bar=baz)`
)

})

test("Strip Markdown relative inline with title and alt", () => {
  const content = `
![title](./assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar "Alt")
![title](./assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz "Alt")`

  assert.equal(
    stripGhThemeLinks(content, 'light'),
    `
![title](./assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar "Alt")
`
  )
})

test("Strip Markdown relative inline with title", () => {
  const content = `
![title](./assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar)
![title](./assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz)`

  assert.equal(
    stripGhThemeLinks(content, 'light'),
    `
![title](./assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar)
`
  )
})

test("Strip Markdown relative inline with empty title", () => {
  const content = `
![](./assets/readme/nodedotjs-black.svg#gh-light-mode-only?ver=1.0.1&foo=bar)![](./assets/readme/nodedotjs-white.svg#gh-dark-mode-only?ver=1.0.5&bar=baz)`

  assert.equal(
    stripGhThemeLinks(content, 'light'),
    `
![](./assets/readme/nodedotjs-black.svg?ver=1.0.1&foo=bar)`
  )
})


test.run()

